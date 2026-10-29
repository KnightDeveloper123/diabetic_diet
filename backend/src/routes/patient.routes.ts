
import express from "express";
import connection from "../config/db.js";
import { redisClient } from "../config/redis.js";
import { executeQuery } from "../controller/helper.js";
import { generateUUID } from "../utils/uuid.js";
import { middleware } from "../middleware/auth.middleware.js";

const router = express.Router()

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

    const generateId = generateUUID();

    // insert user
    const query = `
      INSERT INTO user
      (
      id,
      name, 
      email,
      phone,
      address,
      doctor_id,
      role
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(query, [
      generateId,
      name,
      email,
      phone,
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

router.get("/get-patient", middleware, async (req, res) => {
    try {
        const {
            patient_id
        } = req.query;

        if (!patient_id) {
            return res.status(400).json({
                status: 0,
                message: "Patient ID is required"
            });
        }
       
        const data = `
            SELECT * from user
             where user.role='patient' AND user.status=0
        `;

        return res.status(200).json({
            status: 1,
            message: "Patient fetched successfully",
            data,
           
        });

    } catch (error) {


        return res.status(500).json({
            status: 0,
            message: "Internal Server Error"
        });
    }
});





export default router;
