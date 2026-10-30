
import express from "express";
import connection from "../config/db.js";
import { redisClient } from "../config/redis.js";
import { executeQuery } from "../controller/helper.js";
import { generateUUID } from "../utils/uuid.js";
import { middleware } from "../middleware/auth.middleware.js";
import { encrypt } from "../utils/security.js";
import { createPassword } from "../utils/mail_template.js";
import sendMail from "../utils/mail.js";

const router = express.Router()



interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: number;
  created_at: Date;
}

interface CountResult {
  total_items: number;
}

const frontendUrl =
  process.env.FRONTEND_URL || process.env.FRONT_URL;

router.post("/add", middleware, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      doctor_id,
      role,
    } = req.body;

    // Check existing email
    const checkUser = await executeQuery(
      "SELECT id FROM `user` WHERE email = ?",
      [email]
    );

    if (checkUser.length > 0) {
      return res.status(400).json({
        status: 0,
        message: "Email already exists",
      });
    }

    // Generate user ID
    const generateId = generateUUID();

    // Insert user
    const userQuery = `
      INSERT INTO user
      (
        id,
        name,
        email,
        phone,
        address,
        role,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, now())
    `;

    await executeQuery(userQuery, [
      generateId,
      name,
      email,
      phone,
      address,
      role,
    ]);

    // Assign doctor to patient
    if (role === "patient" && doctor_id) {
      const patientQuery = `
        INSERT INTO patient
        (
          id,
          patient_id,
          doctor_id
        )
        VALUES (?, ?, ?)
      `;

      await executeQuery(patientQuery, [
        generateUUID(),
        generateId,
        doctor_id,
      ]);
    }

    const cipherObj = {
      id: generateId,
      email: email,
      timestamp: Date.now(),
    };

    const encryptedToken = encrypt(cipherObj);
    const resetLink =
      `${frontendUrl}/#/create-password/${encryptedToken}`;

    const html = createPassword({
      name: name,
      link: resetLink,
    });

    // Send reset email
    await sendMail({
      from: `"Diabetic-Diet-Assistant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html,
    });

    return res.status(201).json({
      status: 1,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Add user error:", error);

    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
    });
  }
});




interface AddUserRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  doctor_id?: string;
  role: "admin" | "doctor" | "patient";
}

interface ExistingUser {
  id: string;
}

router.post(
  "/add",
  middleware,
  async (
    req,
    res
  ): Promise<void> => {

    try {
      const {
        name,
        email,
        phone,
        address,
        doctor_id,
        role,
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !address || !role) {
        res.status(400).json({
          status: 0,
          message: "All required fields must be provided",
        });
        return;
      }

      if (role === "patient" && !doctor_id) {
        res.status(400).json({
          status: 0,
          message: "Doctor is required for patient",
        });
        return;
      }

      // Check existing email
      const [checkUser] = await executeQuery(
        "SELECT id FROM user WHERE email = ?",
        [email]
      );

      if (checkUser.length > 0) {
        res.status(400).json({
          status: 0,
          message: "Email already exists",
        });
        return;
      }

      // Generate user ID
      const generateId = generateUUID();


      // Insert user
      const userQuery = `
                INSERT INTO user
                (
                    id,
                    name,
                    email,
                    phone,
                    address,
                    role,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `;

      await executeQuery(userQuery, [
        generateId,
        name,
        email,
        phone,
        address,
        role,
      ]);

      // Assign doctor to patient
      if (role === "patient") {
        const patientQuery = `
                    INSERT INTO patient
                    (
                        id,
                        patient_id,
                        doctor_id
                    )
                    VALUES (?, ?, ?)
                `;

        await executeQuery(patientQuery, [
          generateUUID(),
          generateId,
          doctor_id,
        ]);
      }

      // Generate encrypted password creation link
      const cipherObj = {
        id: generateId,
        email,
        timestamp: Date.now(),
      };

      const encryptedToken = encrypt(cipherObj);

      const resetLink =
        `${frontendUrl}/#/create-password/${encryptedToken}`;

      const html = createPassword({
        name,
        link: resetLink,
      });

      // Send password creation email
      await sendMail({
        from: `"Diabetic-Diet-Assistant" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Create Your Password",
        html,
      });


      res.status(201).json({
        status: 1,
        message: "User registered successfully",
      });

    } catch (error) {


      console.error("Add user error:", error);

      res.status(500).json({
        status: 0,
        message: "Internal Server Error",
      });

    }
  }
);



router.post("/assign", middleware, async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
    } = req.body;

    // validation

    const generateId = generateUUID();

    // insert user
    const query = `
      INSERT INTO patient
      (
      id,
      patient_id, 
      doctor_id,
      )
      VALUES (?, ?, ?)
    `;

    const result = await executeQuery(query, [
      generateId,
      patient_id,
      doctor_id,
    ]);

    return res.status(201).json({
      status: 1,
      message: "Assign doctor successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
    });
  }
});

router.get("/profile", middleware, async (req, res) => {
  // console.log("mnbnmz")
  try {
    const {
      id
    } = req.query;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "User ID is required"
      });
    }
    // console.log(id)

    const data = await executeQuery(
      `
                SELECT
                    u.id,
                    u.name,
                    u.email,
                    u.phone,
                    u.address,
                    u.role,
                    p.doctor_id,
                    d.name AS doctor_name,
                    d.email AS doctor_email,
                    d.phone AS doctor_phone
                FROM user u

                LEFT JOIN patient p
                    ON u.id = p.patient_id

             

                LEFT JOIN user d
                ON d.id = p.doctor_id
                AND d.role = 'doctor'
                AND d.status = 0

                WHERE
                    u.status = 0
                    AND u.id = ?
                    
                `,
      [id]
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
      message: "Profile fetched successfully",
      data: data[0],
    });

  } catch (error) {


    return res.status(500).json({
      status: 0,
      message: "Internal Server Error"
    });
  }
});

router.put("/edit-profile", middleware, async (req, res) => {
  try {



    const {
      name,
      email,
      phone,
      address,
      id
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        status: 0,
        message: "All fields are required",
      });
    }

    // Check whether email belongs to another user
    const existingUser = await executeQuery(
      `SELECT id FROM user WHERE email = ? AND id != ?`,
      [email, id]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 0,
        message: "Email already exists",
      });
    }

    // Update profile
    const updateQuery = `
      UPDATE user
      SET
        name = ?,
        email = ?,
        phone = ?,
        address = ?
      WHERE id = ?
    `;

    await executeQuery(updateQuery, [
      name,
      email,
      phone,
      address,
      id,
    ]);

    // Fetch updated profile
    const updatedUser = await executeQuery(
      `SELECT id, name, email, phone, address, role
       FROM user
       WHERE id = ?`,
      [id]
    );

    if (updatedUser.length === 0) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: 1,
      message: "Profile updated successfully",
      data: updatedUser[0],
    });

  } catch (error) {
    console.error("Edit profile error:", error);

    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
    });
  }
});


router.get(
  "/get-all-patient",
  middleware,
  async (req, res): Promise<void> => {
    try {
      const {
        page = "1",
        limit = "10",
        search = "",
      } = req.query;

      const parsedPage = Math.max(Number(page) || 1, 1);
      const parsedLimit = Math.max(Number(limit) || 10, 0);

      const offset = (parsedPage - 1) * parsedLimit;

      const searchQuery = `%${String(search).trim()}%`;

      // WHERE CLAUSE
      const whereClause = `
                u.status = 0
                AND u.role = 'patient'
                AND (
                    u.name LIKE ?
                    OR u.email LIKE ?
                    OR u.phone LIKE ?
                )
            `;

      const queryParams: (string | number)[] = [
        searchQuery,
        searchQuery,
        searchQuery,
      ];

      // MAIN QUERY
      let query = `
                SELECT
                    u.id,
                    u.name,
                    u.email,
                    u.phone,
                    u.address,
                    u.role,
                    u.status,
                    u.created_at
                FROM user u
                WHERE ${whereClause}
                ORDER BY u.created_at DESC
            `;

      // PAGINATION
      if (parsedLimit !== 0) {
        query += `
                    LIMIT ?
                    OFFSET ?
                `;

        queryParams.push(parsedLimit, offset);
      }

      // GET PATIENTS
      const data = await executeQuery(
        query,
        queryParams
      );

      // TOTAL COUNT
      const totalItemsResult = await executeQuery(
        `
                    SELECT COUNT(*) AS total_items
                    FROM user u
                    WHERE ${whereClause}
                `,
        [
          searchQuery,
          searchQuery,
          searchQuery,
        ]
      );

      const totalItems = Number(
        totalItemsResult[0]?.total_items || 0
      );

      // NEXT PAGE
      const isNext = totalItems > offset + data.length;

      // RESPONSE
      res.status(200).json({
        status: 1,
        message: "Patient list fetched successfully",
        data,
        pagination: {
          currentPage: parsedPage,
          limit: parsedLimit,
          totalItems,
          totalPages:
            parsedLimit === 0
              ? 1
              : Math.ceil(totalItems / parsedLimit),
          isNext,
        },
      });

    } catch (error) {
      console.error("Get all patients error:", error);

      res.status(500).json({
        status: 0,
        message: "Internal server error",
      });
    }
  }
);






export default router;
