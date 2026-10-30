import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { executeQuery } from "../controller/helper.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload directory
const uploadDir = path.join(
    __dirname,
    "../public/image_calculation"
);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        const uniqueName = `${Date.now()}_${Math.round(
            Math.random() * 1e9
        )}${ext}`;

        cb(null, uniqueName);
    }
});

// Upload middleware
const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"));
        }

        cb(null, true);
    }
});

// Analyze Image API
router.post(
    "/analyze-image",
    upload.single("image"),
    async (req, res) => {

        let imageFullPath = null;

        try {

            const { meal_type, user_id } = req.body;

            // Validation
            if (!req.file) {
                return res.status(400).json({
                    status: 0,
                    error: "Please upload an image"
                });
            }

            if (!meal_type || !user_id) {
                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    status: 0,
                    error: "Patient ID and meal type are required"
                });
            }

            // Check patient
            const [patient] = await executeQuery(
                `SELECT id FROM user WHERE id = ?`,
                [user_id]
            );

            if (!patient) {
                fs.unlinkSync(req.file.path);

                return res.status(404).json({
                    status: 0,
                    error: "Patient not found"
                });
            }

            // ---------------------------------
            // STEP 1: Call Python FastAPI
            // ---------------------------------

            const formData = new FormData();

            const imageBlob = new Blob(
                [fs.readFileSync(req.file.path)],
                {
                    type: req.file.mimetype
                }
            );

            formData.append(
                "image",
                imageBlob,
                req.file.originalname
            );

            formData.append("meal_type", meal_type);

            const pythonResponse = await fetch(
               `${process.env.PYTHON_API_URL}/api/analyze`,
                {
                    method: "POST",
                    body: formData,
                    signal: AbortSignal.timeout(120000)
                }
            );

            if (!pythonResponse.ok) {

                const errorData = await pythonResponse.text();

                throw new Error(
                    `Python API Error (${pythonResponse.status}): ${errorData}`
                );
            }

            const analysis = await pythonResponse.json();

            console.log("Python Response:", analysis);

            // ---------------------------------
            // STEP 2: Extract nutrition details
            // ---------------------------------

            const nutrition = analysis.nutrition || analysis;

            const foodName =
                analysis.food_name ??
                analysis.detected_food ??
                nutrition.food_name ??
                null;

            const grams =
                analysis.grams ??
                nutrition.grams ??
                null;

            const calories =
                nutrition.calories ?? null;

            const carbs =
                nutrition.carbs ??
                nutrition.carbohydrates ??
                null;

            const protein =
                nutrition.protein ??
                nutrition.proteins ??
                null;

            const carbohydrates =
                nutrition.carbohydrates ??
                nutrition.carbs ??
                null;

            const fats =
                nutrition.fats ??
                nutrition.fat ??
                null;

            const fiber =
                nutrition.fiber ?? null;

            const sugar =
                nutrition.sugar ??
                nutrition.sugars ??
                null;

            const cholesterol =
                nutrition.cholesterol_mg ??
                nutrition.cholesterol ??
                null;

            const glucose =
                nutrition.glucose ?? null;

            const calcium =
                nutrition.calcium_mg ??
                nutrition.calcium ??
                null;

            const riskLevel =
                analysis.risk_level ??
                nutrition.risk_level ??
                "Unknown";

            // ---------------------------------
            // STEP 3: Save image path
            // ---------------------------------

            const imagePath = `/image_calculation/${req.file.filename}`;

            imageFullPath = req.file.path;

            // ---------------------------------
            // STEP 4: Save analysis in MySQL
            // ---------------------------------

            const result = await executeQuery(
                `INSERT INTO image_calculation
                (
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
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())`,
                [
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
                    riskLevel
                ]
            );

            // ---------------------------------
            // STEP 5: Send response
            // ---------------------------------

            return res.status(200).json({
                status: 1,
                success: "Meal analyzed and saved successfully",

                data: {
                    id: result.insertId,
                    user_id,
                    image: imagePath,
                    meal_type,
                    food_name: foodName,
                    grams,
                    calories,
                    carbs,
                    protein,
                    carbohydrates,
                    fats,
                    fiber,
                    sugar,
                    cholesterol_mg: cholesterol,
                    glucose,
                    calcium_mg: calcium,
                    risk_level: riskLevel,
                    analysis
                }
            });

        } catch (error) {

            // Delete uploaded image if analysis or database fails
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            console.error(
                "Image Analysis Error:",
                error.message
            );

            return res.status(500).json({
                status: 0,
                error: error.message || "Internal server error"
            });
        }
    }
);

export default router;