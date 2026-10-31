import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { generateUUID } from "../utils/uuid.js";
import { executeQuery } from "../controller/helper.js";
import { middleware } from "../middleware/auth.middleware.js";

interface WeeklyGraphItem {
    date: string;
    day: string;
    carbohydrates: number;
    threshold: number;
    status: string;
}

const weeklyGraph: WeeklyGraphItem[] = [];

const router = express.Router();

// ----------------------------------
// Multer Configuration
// ----------------------------------

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
        }
    },
});


// ----------------------------------
// Analyze Image API
// ----------------------------------

router.post(
    "/analyze-image",
    upload.single("image"), middleware,
    async (req, res) => {

        let imageFullPath = null;

        try {

            const { meal_type, user_id } = req.body;

            // ----------------------------------
            // STEP 1: Validate Image
            // ----------------------------------

            if (!req.file) {
                return res.status(400).json({
                    status: 0,
                    error: "Please upload an image",
                });
            }

            if (!meal_type || !user_id) {
                return res.status(400).json({
                    status: 0,
                    error: "Patient ID and meal type are required",
                });
            }

            // ----------------------------------
            // STEP 2: Check Patient
            // ----------------------------------

            const patientResult = await executeQuery(
                `SELECT id FROM user WHERE id = ? LIMIT 1`,
                [user_id]
            );

            const patient = Array.isArray(patientResult)
                ? patientResult[0]
                : patientResult.data?.[0];

            if (!patient) {
                return res.status(404).json({
                    status: 0,
                    error: "Patient not found",
                });
            }

            // ----------------------------------
            // STEP 3: Create Upload Directory
            // ----------------------------------

            const uploadDir = path.join(
                process.cwd(),
                "public",
                "image_calculation"
            );

            fs.mkdirSync(uploadDir, {
                recursive: true,
            });

            // ----------------------------------
            // STEP 4: Save Image
            // ----------------------------------

            const imageExt = path.extname(
                req.file.originalname
            ).toLowerCase();

            const uniqueId = generateUUID();

            const imageName =
                `${uniqueId}_meal${imageExt}`;

            imageFullPath = path.join(
                uploadDir,
                imageName
            );

            fs.writeFileSync(
                imageFullPath,
                req.file.buffer
            );

            const imagePath =
                `/image_calculation/${imageName}`;

            // ----------------------------------
            // STEP 5: Call Python FastAPI
            // ----------------------------------

            const formData = new FormData();

            const imageArrayBuffer = new ArrayBuffer(req.file.buffer.length);

            new Uint8Array(imageArrayBuffer).set(req.file.buffer);

            const imageBlob = new Blob(
                [imageArrayBuffer],
                {
                    type: req.file.mimetype,
                }
            );
            // console.log(imageBlob)
            formData.append(
                "image",
                imageBlob,
                req.file.originalname
            );

            formData.append(
                "meal_type",
                meal_type
            );

            const pythonResponse = await fetch(
                `${process.env.PYTHON_API_URL}/api/analyze`,
                {
                    method: "POST",
                    body: formData,
                    signal: AbortSignal.timeout(120000),
                }
            );

            if (!pythonResponse.ok) {

                const errorData = await pythonResponse.text();

                throw new Error(
                    `Python API Error (${pythonResponse.status}): ${errorData}`
                );
            }

            const analysis = await pythonResponse.json();

            // console.log(
            //     "Python Analysis Response:",
            //     analysis
            // );

            // ----------------------------------
            // STEP 6: Validate Python Response
            // ----------------------------------

            if (
                !analysis ||
                typeof analysis !== "object" ||
                Array.isArray(analysis)
            ) {
                throw new Error(
                    "Invalid response received from Python API"
                );
            }

            // ----------------------------------
            // STEP 7: Extract Food Details
            // ----------------------------------

            const foods = Array.isArray(analysis.foods)
                ? analysis.foods
                : [];

            const foodName = foods.map((food: any) => food.name).join(", ");

            const grams = foods.map((food: any) => food.grams).join(", ");

            // ----------------------------------
            // STEP 8: Extract Nutrition Details
            // ----------------------------------

            const totals = analysis.totals || {};

            const calories =
                totals.calories_kcal ?? null;

            const carbs =
                totals.carbs_g ?? null;

            const protein =
                totals.protein_g ?? null;

            const carbohydrates =
                totals.carbs_g ?? null;

            const fats =
                totals.fat_g ?? null;

            const fiber =
                totals.fiber_g ?? null;

            const sugar =
                totals.sugar_g ?? null;

            const cholesterol =
                totals.cholesterol_mg ?? null;

            // Python response does not currently provide glucose.
            const glucose = null;

            const calcium =
                totals.calcium_mg ?? null;

            const riskLevel =
                analysis.glycemic_load?.risk_level ??
                "Unknown";


            // ----------------------------------
            // STEP 10: Save Analysis in MySQL
            // ----------------------------------

            const id = generateUUID();

            const result = await executeQuery(
                `
                INSERT INTO image_calculation
                (
                    id,
                    user_id,
                    image,
                    meal_type,
                    food_name,
                    grams,
                    calories,
                    carbs,
                    protein,
                    carbohydrates,
                    fats,
                    fiber,
                    sugar,
                    cholesterol_mg,
                    glucose,
                    calcium_mg,
                    risk_level,
                    date,
                    time
                )
                VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME()
                )
                `,
                [
                    id,
                    user_id,
                    imagePath,
                    meal_type,
                    foodName,
                    grams,
                    calories,
                    carbs,
                    protein,
                    carbohydrates,
                    fats,
                    fiber,
                    sugar,
                    cholesterol,
                    glucose,
                    calcium,
                    riskLevel,
                ]
            );

            // ----------------------------------
            // STEP 11: Success Response
            // ----------------------------------

            return res.status(200).json({
                status: 1,
                success: "Meal analyzed and saved successfully",

            });

        } catch (error) {

            // ----------------------------------
            // STEP 12: Delete Image If Failed
            // ----------------------------------

            if (
                imageFullPath &&
                fs.existsSync(imageFullPath)
            ) {
                try {
                    fs.unlinkSync(imageFullPath);
                } catch (deleteError) {
                    console.error(
                        "Image Delete Error:",
                        deleteError
                    );
                }
            }

            console.error(
                "Image Analysis Error:",
                error
            );

            return res.status(500).json({
                status: 0,
                error: "Internal server error",
            });
        }
    }
);


router.get("/get_calculatin", middleware, async (req, res) => {
    // console.log("mnbnmz")
    try {
        const {
            patient_id
        } = req.query;

        if (!patient_id) {
            return res.status(400).json({
                status: 0,
                message: "User ID is required"
            });
        }
        // console.log(id)

        const data = await executeQuery(
            `
                SELECT
                  *
                FROM image_calculation 

                `,
            [patient_id]
        );

        if (data.length === 0) {
            res.status(404).json({
                status: 0,
                message: "User profile not found",
            });
            return;
        }

        res.status(200).json({
            status: 1,
            message: " fetched successfully",
            data: data,
        });

    } catch (error) {


        return res.status(500).json({
            status: 0,
            message: "Internal Server Error"
        });
    }
});



const DAILY_THRESHOLD = 60;
const WEEKLY_THRESHOLD = 200;

router.get("/graph-data", middleware, async (req, res) => {
    try {
        const userId = req.query.id as string;
        const selectedDate = req.query.date as string;

        // Validate date if provided
        if (
            selectedDate &&
            !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)
        ) {
            return res.status(400).json({
                status: 0,
                error: "Invalid date format. Use YYYY-MM-DD",
            });
        }

        // Get selected date (defaults to MySQL current date)
        const [dateResult] = await executeQuery(
            `SELECT COALESCE(?, CURDATE()) AS selected_date`,
            [selectedDate || null]
        );

        const date = String(dateResult.selected_date).slice(0, 10);

        // --------------------------------
        // 1. DAILY MEAL GRAPH
        // --------------------------------

        const dailyRows = await executeQuery(
            `
            SELECT
                id,
                meal_type,
                DATE_FORMAT(time, '%H:%i') AS meal_time,
                food_name,
                COALESCE(carbs, 0) AS carbohydrates
            FROM image_calculation
            WHERE user_id = ?
              AND date = ?
            `,
            [userId, date]
        );

        const dailyGraph = dailyRows.map((item: any) => ({
            id: item.id,
            meal: item.meal_type,
            time: item.meal_time,
            food_name: item.food_name,
            carbohydrates: Number(item.carbohydrates),
            threshold: DAILY_THRESHOLD,
            status:
                Number(item.carbohydrates) > DAILY_THRESHOLD
                    ? "Above threshold"
                    : "Within threshold",
        }));

        // --------------------------------
        // 2. WEEKLY MEAL GRAPH
        // --------------------------------

        const weeklyRows = await executeQuery(
            `
            SELECT
                DATE_FORMAT(date, '%Y-%m-%d') AS meal_date,
                SUM(COALESCE(carbs, 0)) AS total_carbohydrates
            FROM image_calculation
            WHERE user_id = ?
              AND date BETWEEN DATE_SUB(?, INTERVAL 6 DAY) AND ?
            GROUP BY date
            ORDER BY date ASC
            `,
            [userId, date, date]
        );

        // Create all 7 dates, including days without meals
        const weeklyData = new Map(
            weeklyRows.map((item: any) => [
                item.meal_date,
                Number(item.total_carbohydrates),
            ])
        );

        // const weeklyGraph = [];

        const endDate = new Date(`${date}T00:00:00Z`);

        for (let i = 6; i >= 0; i--) {
            const currentDate = new Date(endDate);
            currentDate.setUTCDate(endDate.getUTCDate() - i);

            const dateKey = currentDate.toISOString().slice(0, 10);

            const carbohydrates: any = weeklyData.get(dateKey) ?? 0;
            // const carbohydrates: number = Number(item.carbohydrates) || 0;

            weeklyGraph.push({
                date: dateKey,
                day: currentDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    timeZone: "UTC",
                }),
                carbohydrates:carbohydrates,
                threshold: WEEKLY_THRESHOLD,
                status:
                    carbohydrates > WEEKLY_THRESHOLD
                        ? "Above threshold"
                        : "Within threshold",
            });
        }

        // --------------------------------
        // 3. REPORT SUMMARY
        // --------------------------------

        const totalCarbohydrates = weeklyGraph.reduce(
            (total, item) => total + item.carbohydrates,
            0
        );

        const mealsRecorded = dailyRows.length;

        const weeklyMealCount = await executeQuery(
            `
            SELECT COUNT(*) AS total
            FROM image_calculation
            WHERE user_id = ?
              AND date BETWEEN DATE_SUB(?, INTERVAL 6 DAY) AND ?
            `,
            [userId, date, date]
        );

        const daysAboveThreshold = weeklyGraph.filter(
            (item) => item.carbohydrates > WEEKLY_THRESHOLD
        ).length;

        const summary = {
            meals_recorded: Number(weeklyMealCount[0]?.total || 0),

            daily_average: Number(
                (totalCarbohydrates / 7).toFixed(2)
            ),

            days_above_threshold: daysAboveThreshold,

            weekly_total: Number(totalCarbohydrates.toFixed(2)),

            daily_threshold: DAILY_THRESHOLD,

            weekly_threshold: WEEKLY_THRESHOLD,
        };

        // --------------------------------
        // 4. RECENT MEAL RECORDS
        // --------------------------------

        const recentMeals = await executeQuery(
            `
            SELECT
                id,
                DATE_FORMAT(date, '%Y-%m-%d') AS meal_date,
                DATE_FORMAT(time, '%H:%i') AS meal_time,
                meal_type,
                food_name,
                COALESCE(carbs, 0) AS carbohydrates,
                risk_level
            FROM image_calculation
            WHERE user_id = ?
              AND date BETWEEN DATE_SUB(?, INTERVAL 6 DAY) AND ?
            ORDER BY date DESC, STR_TO_DATE(time, '%H:%i:%s') DESC
            LIMIT 10
            `,
            [userId, date, date]
        );

        const formattedRecentMeals = recentMeals.map((item: any) => ({
            ...item,
            carbohydrates: Number(item.carbohydrates),
            status:
                Number(item.carbohydrates) > DAILY_THRESHOLD
                    ? "Above threshold"
                    : "Within threshold",
        }));

        console.log(dailyGraph)
        return res.status(200).json({
            status: 1,
            message: "Report data fetched successfully",
            data: {
                selected_date: date,
                summary,
                daily_graph: dailyGraph,
                weekly_graph: weeklyGraph,
                recent_meals: formattedRecentMeals,
            },
        });
    } catch (error) {
        console.error("Graph Data Error:", error);

        return res.status(500).json({
            status: 0,
            error: "Internal server error",
        });
    }
});





// ----------------------------------
// Multer Error Handler
// ----------------------------------

router.use((err: any, req: any, res: any, next: any) => {

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            status: 0,
            error: err.message,
        });
    }

    if (err) {
        return res.status(400).json({
            status: 0,
            error: err.message || "File upload failed",
        });
    }

    next();
});

export default router;