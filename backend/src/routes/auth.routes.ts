import express from "express";
import { redisClient } from "../config/redis.js";
import { executeQuery } from "../controller/helper.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtutils.js";
import { generateUUID } from "../utils/uuid.js"
import { middleware } from "../middleware/auth.middleware.js";
import { decrypt, encrypt } from "../utils/security.js";
import sendMail from "../utils/mail.js";
import { forgotPassword } from "../utils/mail_template.js";
import crypto from "crypto";

const router = express.Router()


const generatePasswordResetLink = async (user: {
    id: string;
    name: string;
    email: string;
}) => {
    const cipherObj = {
        id: user.id,
        email: user.email,
        timestamp: Date.now(),
    };

    // Use your existing encryption function
    const encryptedToken = encrypt(JSON.stringify(cipherObj));

    // Save encrypted token and 30-minute expiry
    await executeQuery(
        `UPDATE user
         SET reset_token = ?,
             reset_token_expire = DATE_ADD(NOW(), INTERVAL 30 MINUTE)
         WHERE id = ?`,
        [encryptedToken, user.id]
    );

    const frontendUrl =
        process.env.FRONTEND_URL || process.env.FRONT_URL;

    if (!frontendUrl) {
        throw new Error("Frontend URL is not configured");
    }

    const resetLink =
        `${frontendUrl}/#/reset-password/${encodeURIComponent(encryptedToken)}`;

    return resetLink;
};

router.post("/user_register", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            address,
            role,
        } = req.body;

        // Validation
        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({
                status: 0,
                message: "Please provide all required fields",
            });
        }

        // Check existing email
        const checkUser = await executeQuery(
            "SELECT id FROM user WHERE email = ?",
            [email]
        );

        if (checkUser.length > 0) {
            return res.status(400).json({
                status: 0,
                message: "Email already exists",
            });
        }

        // Hash password
        const secPass = await bcrypt.hash(password, 10);

        const generateId = generateUUID();

        // Insert user
        const query = `
            INSERT INTO user (
                id,
                name,
                email,
                phone,
                password,
                address,
                role,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        await executeQuery(query, [
            generateId,
            name,
            email,
            phone,
            secPass,
            address,
            role,
        ]);

        // Generate encrypted reset token and save expiry
        const resetLink = await generatePasswordResetLink({
            id: generateId,
            name,
            email,
        });

        // Send reset email
        const html = forgotPassword({
            name,
            link: resetLink,
        });

        await sendMail({
            from: `"Diabetic-Diet-Assistant" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Forgot Your Password",
            html,
        });

        return res.status(201).json({
            status: 1,
            message: "User registered successfully. Password setup link sent to email.",
        });

    } catch (error) {
        console.error("User Register Error:", error);

        return res.status(500).json({
            status: 0,
            message: "Internal Server Error",
        });
    }
});



router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            address,
            doctor_id,
            role,
        } = req.body;

        // Validation
        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({
                status: 0,
                message: "Please provide all required fields",
            });
        }

        // Check existing email
        const checkUser = await executeQuery(
            "SELECT id FROM user WHERE email = ?",
            [email]
        );

        if (checkUser.length > 0) {
            return res.status(400).json({
                status: 0,
                message: "Email already exists",
            });
        }

        // Patient doctor validation
        if (role === "patient" && !doctor_id) {
            return res.status(400).json({
                status: 0,
                message: "Doctor is required for patient",
            });
        }

        // Hash password
        const secPass = await bcrypt.hash(password, 10);

        const generateId = generateUUID();

        // Insert user
        const query = `
            INSERT INTO user (
                id,
                name,
                email,
                phone,
                password,
                address,
                role,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        await executeQuery(query, [
            generateId,
            name,
            email,
            phone,
            secPass,
            address,
            role,
        ]);

        // Insert patient details
        if (role === "patient") {
            const patientQuery = `
                INSERT INTO patient (
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

        // Generate encrypted reset token and save expiry
        const resetLink = await generatePasswordResetLink({
            id: generateId,
            name,
            email,
        });

        // Send reset email
        const html = forgotPassword({
            name,
            link: resetLink,
        });

        await sendMail({
            from: `"Diabetic-Diet-Assistant" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Forgot Your Password",
            html,
        });

        return res.status(201).json({
            status: 1,
            message: "User registered successfully. Password setup link sent to email.",
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            status: 0,
            message: "Internal Server Error",
        });
    }
});



router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
      remember = false,
    }: {
      email: string;
      password: string;
      remember?: boolean;
    } = req.body;
    // console.log(email)
    // console.log(password)


    if (!email || !password) {
      return res.status(400).json({
        status: 0,
        error: "Email and Password are required",
      });
    }

    const checkEmployee = await executeQuery(
      `SELECT 
      u.*,
      d.name AS doctor_name,
      d.email AS doctor_email,
      d.phone AS doctor_phone,
      d.id AS doctor_id

   FROM user u

   LEFT JOIN patient p
      ON u.id = p.patient_id
   LEFT JOIN user d
      ON d.id = p.doctor_id

   WHERE u.email = ?
     AND u.status = 0
  `,
      [email.trim()]
    );
    // console.log("Login query result:", checkEmployee[0]);
    const user = Array.isArray(checkEmployee)
      ? checkEmployee[0]
      : checkEmployee;

    if (!user) {
      return res.status(400).json({
        status: 0,
        error: "User not found",
      });
    }

    const pwdCompare = await bcrypt.compare(
      password,
      user.password
    );

    if (!pwdCompare) {
      return res.status(400).json({
        status: 0,
        error: "Wrong password",
      });
    }

    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    const auth_token = generateToken(
      payload,
      remember ? "30d" : "1d"
    );

    return res.status(200).json({
      status: 1,
      message: "Login success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        doctor_name: user.doctor_name,
        doctor_id: user.doctor_id
        // doctor

      },
      auth_token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Internal Server Error.",
    });
  }
});

// router.post("/set-password", async (req, res) => {
//   try {
//     const { token, password, confirm_password } = req.body;
//     if (!token || !password || !confirm_password) {

//       return res.status(400).json({
//         status: 0,
//         error: "All fields are required"
//       });
//     }

//     if (password !== confirm_password) {

//       return res.status(400).json({
//         error: "Password and confirm password do not match"
//       });
//     }

//     // Password validation
//     if (password.length < 8) {
//       return res.status(400).json({
//         status: 0,
//         error: "Password must be at least 8 characters"
//       });
//     }

//     // Find employee using token
//     const employee = await executeQuery(` SELECT *
//             FROM user
//             WHERE
//                 reset_token = ?
//                 AND reset_token_expire > NOW()
//             `,
//       [token]
//     );

//     if (employee.length === 0) {
//       return res.status(400).json({
//         status: 0,
//         error: "Invalid or expired link"
//       });
//     }

//     // Hash password
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword =
//       await bcrypt.hash(password, salt);
//     // Update password
//     await executeQuery(
//       ` UPDATE user
//             SET
//                 password = ?,
//                 reset_token = NULL,
//                 reset_token_expire = NULL,
//                 updated_at = CURRENT_TIMESTAMP
//             WHERE id = ?
//             `,
//       [
//         hashedPassword,
//         employee[0].id
//       ]
//     );

//     return res.status(200).json({
//       status: 1,
//       success:
//         "Password created successfully"
//     });

//   } catch (error) {

//     return res.status(500).json({
//       status: 0,
//       error: "Internal Server Error"
//     });
//   }
// });




router.post("/set-password", async (req, res) => {
  try {
    const { token, password, confirm_password } = req.body;

    if (!token || !password || !confirm_password) {
      return res.status(400).json({
        status: 0,
        error: "All fields are required",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        status: 0,
        error: "Password and confirm password do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 0,
        error: "Password must be at least 8 characters",
      });
    }

    // Find user using the original encrypted token
    const employee = await executeQuery(
      `SELECT id
       FROM user
       WHERE reset_token = ?
       AND reset_token_expire > NOW()
       LIMIT 1`,
      [token]
    );

    if (!employee || employee.length === 0) {
      return res.status(400).json({
        status: 0,
        error: "Invalid or expired link",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await executeQuery(
      `UPDATE user
       SET password = ?,
           reset_token = NULL,
           reset_token_expire = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [hashedPassword, employee[0].id]
    );

    return res.status(200).json({
      status: 1,
      success: "Password created successfully",
    });

  } catch (error) {
    console.error("Set password error:", error);

    return res.status(500).json({
      status: 0,
      error: "Internal Server Error",
    });
  }
});




router.post("/forgot", async (req, res) => {
    try {
        const { email } = req.body as { email?: string };

        if (!email || typeof email !== "string") {
            return res.status(400).json({
                status: 0,
                error: "Invalid email",
            });
        }

        // Check user
        const [user] = await executeQuery(
            `SELECT id, name, email FROM user WHERE email = ?`,
            [email]
        );

        if (!user) {
            return res.status(404).json({
                status: 0,
                error: "No account found with that email.",
            });
        }

        // Generate encrypted reset token and save expiry
        const resetLink = await generatePasswordResetLink({
            id: user.id,
            name: user.name,
            email: user.email,
        });

        // Generate email HTML
        const html = forgotPassword({
            name: user.name,
            link: resetLink,
        });

        // Send reset email
        await sendMail({
            from: `"Diabetic-Diet-Assistant" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Reset Your Password",
            html,
        });

        return res.status(200).json({
            status: 1,
            success: "Password reset link has been sent to your email.",
        });

    } catch (error) {
        console.error("Error in /forgot:", error);

        return res.status(500).json({
            status: 0,
            error: "Internal server error.",
        });
    }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({
      status: 0,
      error: "Invalid request"
    });

    const decrypted = JSON.parse(decrypt(decodeURIComponent(token)));
    const { id, timestamp } = decrypted;

    // Expiry check (30 minutes)
    if (Date.now() - timestamp > 30 * 60 * 1000) {
      return res.status(400).json({
        status: 0,
        error: "Reset link expired. Please request a new one."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await executeQuery(`UPDATE user SET password = ? WHERE id = ?`, [hashedPassword, id]);

    return res.json({ status: 1, success: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error in user/reset-password:", error);

    return res.status(500).json({ status: 1, error: "Internal server error." });
  }
});

router.post("/logout", middleware, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 0,
        message: "Valid token required",
      });
    }

    const token = authHeader.split(" ")[1];

    await executeQuery(
      `INSERT INTO blacklisted_tokens (token) VALUES (?)`,
      [token]
    );

    return res.status(200).json({
      status: 1,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      status: 0,
      message: "Logout failed",
    });
  }
});





export default router;