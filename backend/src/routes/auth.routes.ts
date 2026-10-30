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

const router = express.Router()

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

    // validation


    // check existing email
    const checkUser = await executeQuery(
      "SELECT * FROM `user` WHERE email = ?",
      [email]
    );
    // console.log(checkUser[0])

    if (checkUser.length > 0) {
      return res.status(400).json({
        status: 0,
        message: "Email already exists",
      });
    }

    // hash password
    const secPass = await bcrypt.hash(password, 10);

    const generateId = generateUUID();

    // insert user
    const query = `
      INSERT INTO user
      (
      id,
      name, 
      email,
      phone,
      password,
      address,
      role,
      created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, now())
    `;

    const result = await executeQuery(query, [
      generateId,
      name,
      email,
      phone,
      secPass,
      // password,
      address,
      role,
    ]);

    return res.status(201).json({
      status: 1,
      message: "User registered successfully",
    });

  } catch (error) {
    console.log(error);

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

    // validation


    // check existing email
    const checkUser = await executeQuery(
      "SELECT * FROM `user` WHERE email = ?",
      [email]
    );
    // console.log(checkUser[0])

    if (checkUser.length > 0) {
      return res.status(400).json({
        status: 0,
        message: "Email already exists",
      });
    }

    // hash password
    const secPass = await bcrypt.hash(password, 10);

    const generateId = generateUUID();

    // insert user
    const query = `
      INSERT INTO user
      (
      id,
      name, 
      email,
      phone,
      password,
      address,
      doctor_id,
      role,
      created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, now())
    `;

    const result = await executeQuery(query, [
      generateId,
      name,
      email,
      phone,
      secPass,
      address,
      doctor_id,
      role,
    ]);

    return res.status(201).json({
      status: 1,
      message: "User registered successfully",
    });

  } catch (error) {
    console.log(error);

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
    console.log(email)
    console.log(password)


    if (!email || !password) {
      return res.status(400).json({
        error: "Email and Password are required",
      });
    }

    const checkEmployee = await executeQuery(
      `SELECT *
        FROM user u
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
        error: "User not found",
      });
    }

    const pwdCompare = await bcrypt.compare(
      password,
      user.password
    );

    if (!pwdCompare) {
      return res.status(400).json({
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
      message: "Login success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role

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

router.post("/set-password", async (req, res) => {
  try {
    const { token, password, confirm_password } = req.body;
    if (!token || !password || !confirm_password) {
      
      return res.status(400).json({
        status: 0,
        error: "All fields are required"
      });
    }

    if (password !== confirm_password) {
      
      return res.status(400).json({
        error: "Password and confirm password do not match"
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        status: 0,
        error: "Password must be at least 8 characters"
      });
    }

    // Find employee using token
    const employee = await executeQuery(` SELECT *
            FROM user
            WHERE
                reset_token = ?
                AND reset_token_expire > NOW()
            `,
      [token]
    );

    if (employee.length === 0) {
      return res.status(400).json({
        status: 0,
        error: "Invalid or expired link"
      });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword =
      await bcrypt.hash(password, salt);
    // Update password
    await executeQuery(
      ` UPDATE user
            SET
                password = ?,
                reset_token = NULL,
                reset_token_expire = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            `,
      [
        hashedPassword,
        employee[0].id
      ]
    );
    
    return res.status(200).json({
      status: 1,
      success:
        "Password created successfully"
    });

  } catch (error) {

    return res.status(500).json({
      status: 0,
      error: "Internal Server Error"
    });
  }
});

router.post(
  "/forgot",
  async (req, res) => {
    try {
      const { email } = req.body as { email?: string };

      if (!email || typeof email !== "string") {
        res.status(400).json({
          status: 0,
          error: "Invalid email",
        });
        return;
      }

    

      // Check whether the user exists
      const [user] = await executeQuery(
        `SELECT id, name,email FROM user WHERE email = ? `,
        [email]
      );

      if (!user) {
        res.status(404).json({
          status: 0,
          error: "No account found with that email.",
        });
        return;
      }

      // Generate an encrypted reset token
      const cipherObj = {
        id: user.id,
        email: user.email,
        timestamp: Date.now(),
      };

      const encryptedToken = encrypt(cipherObj);

      // Frontend URL from environment variables
      const frontendUrl =
        process.env.FRONTEND_URL || process.env.FRONT_URL;

      if (!frontendUrl) {
        throw new Error(
          "FRONTEND_URL or FRONT_URL is not configured"
        );
      }

      // Create reset link
      const resetLink =
        `${frontendUrl}/#/reset-password/${encryptedToken}`;

      // // Generate email HTML
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

      res.status(200).json({
        status: 1,
        success: "Password reset link has been sent to your email.",
      });
    } catch (error) {
      console.error("Error in /forgot:", error);

      res.status(500).json({
        status: 0,
        error: "Internal server error.",
      });
    }
  }
);

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

    if (!authHeader) {

      return res.status(401).json({
        status: 0,
        message: "Token required"
      });
    }

    const token = authHeader.split(" ")[1];

    await executeQuery(
      `
            INSERT INTO blacklisted_tokens (token)
            VALUES (?)
            `,
      [token]
    );

    return res.status(200).json({
      status: 1,
      message: "Logout successful"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      status: 0,
      message: "error"
    });
  }
});





export default router;