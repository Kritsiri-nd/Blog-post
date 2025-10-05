import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import protectUser from "../middleware/protectUser.mjs";
import protectAdmin from "../middleware/protectAdmin.mjs";
import { validateRegister, validateLogin, validateResetPassword } from "../middleware/authValidation.js";
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);
const authRouter = Router();

authRouter.post("/register", validateRegister, async (req, res) => {
    const { email, password, username, name } = req.body;

    try {
        // ตรวจสอบว่า username มีในฐานข้อมูลหรือไม่
        const { data: existingUser, error: usernameError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: "This username is already taken" });
        }

        // สร้างผู้ใช้ใหม่ผ่าน Supabase Auth
        const { data, error: supabaseError } = await supabase.auth.signUp({
            email,
            password,
        });

        // ตรวจสอบ error จาก Supabase
        if (supabaseError) {
            if (supabaseError.code === "user_already_exists") {
                return res
                    .status(400)
                    .json({ error: "User with this email already exists" });
            }
            // จัดการกับ error อื่นๆ จาก Supabase
            return res
                .status(400)
                .json({ error: "Failed to create user. Please try again." });
        }

        const supabaseUserId = data.user.id;

        // เพิ่มข้อมูลผู้ใช้ในฐานข้อมูล Supabase
        const { data: userData, error: insertError } = await supabase
            .from('users')
            .insert({
                id: supabaseUserId,
                username,
                name,
                role: "user"
            })
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ error: "Failed to create user profile" });
        }

        res.status(201).json({
            message: "User created successfully",
            user: userData,
        });
    } catch (error) {
        res.status(500).json({ error: "An error occurred during registration" });
    }
});

authRouter.post("/login", validateLogin, async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // ตรวจสอบว่า error เกิดจากข้อมูลเข้าสู่ระบบไม่ถูกต้องหรือไม่
            if (
                error.message.includes("Invalid login credentials") ||
                error.message.includes("Invalid email or password")
            ) {
                return res.status(400).json({
                    error: "Your password is incorrect or this email doesn't exist",
                });
            }
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({
            message: "Signed in successfully",
            access_token: data.session.access_token,
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred during login" });
    }
});

authRouter.get("/get-user", protectUser, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    try {
        // ดึงข้อมูลผู้ใช้จาก Supabase
        const { data, error } = await supabase.auth.getUser(token);
        if (error) {
            return res.status(401).json({ error: "Unauthorized or token expired" });
        }

        const supabaseUserId = data.user.id;
        
        // ดึงข้อมูลผู้ใช้จาก Supabase users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', supabaseUserId)
            .single();

        if (userError || !userData) {
            return res.status(404).json({ error: "User profile not found" });
        }

        res.status(200).json({
            id: data.user.id,
            email: data.user.email,
            username: userData.username,
            name: userData.name,
            role: userData.role,
            profilePic: userData.profile_pic,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.put("/reset-password", protectUser, validateResetPassword, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header
    const { oldPassword, newPassword } = req.body;
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
  
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }
  
    try {
      // ตั้งค่า session ด้วย token ที่ส่งมา
      const { data: userData, error: userError } = await supabase.auth.getUser(
        token
      );
  
      if (userError) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
  
      // ตรวจสอบรหัสผ่านเดิมโดยลองล็อกอิน
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: userData.user.email,
          password: oldPassword,
        });
  
      if (loginError) {
        return res.status(400).json({ error: "Invalid old password" });
      }
  
      // อัปเดตรหัสผ่านของผู้ใช้
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(200).json({
        message: "Password updated successfully",
        user: data.user,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  

export default authRouter;

