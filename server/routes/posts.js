import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { validatePutPost } from '../middleware/validation.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /posts - ดึงข้อมูลบทความทั้งหมด (พร้อม pagination และ filter)
router.get("/", async (req, res) => {
    try {
        // ดึง query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const category = req.query.category;
        const keyword = req.query.keyword;

        // คำนวณ offset สำหรับ pagination
        const offset = (page - 1) * limit;

        // สร้าง query builder
        let query = supabase
            .from('posts')
            .select(`
                id,
                image,
                title,
                description,
                date,
                content,
                status_id,
                likes_count,
                categories!inner(name)
            `, { count: 'exact' });

        // กรองตาม category (ถ้ามี)
        if (category) {
            query = query.eq('categories.name', category);
        }

        // ค้นหาตาม keyword (ถ้ามี)
        if (keyword) {
            query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`);
        }

        // เพิ่ม pagination
        query = query.range(offset, offset + limit - 1);

        // เรียงลำดับตาม date (ใหม่สุดก่อน)
        query = query.order('date', { ascending: false });

        // ดึงข้อมูล
        const { data: posts, error, count } = await query;

        if (error) {
            throw error;
        }

        // คำนวณ totalPages
        const totalPosts = count;
        const totalPages = Math.ceil(totalPosts / limit);

        // สร้าง response
        const response = {
            totalPosts,
            totalPages,
            currentPage: page,
            limit,
            posts: posts || [],
            nextPage: page < totalPages ? page + 1 : null
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Server could not read post because database connection:', error);
        res.status(500).json({ 
            "message": "Server could not read post because database connection" 
        });
    }
});

// GET /posts/:postId - ดึงข้อมูลบทความเดียวจาก Supabase
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        // ดึงข้อมูลจาก Supabase
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) {
            // ถ้าไม่พบข้อมูล
            return res.status(404).json({
                "message": "Server could not find a requested post"
            });
        }
        // ถ้าพบข้อมูล
        res.status(200).json(data);
    } catch (error) {
        console.error('Server could not read post because database connection:', error);
        res.status(500).json({ "error": error.message });
    }
});

// PUT /posts/:postId - แก้ไขบทความที่มีอยู่
router.put("/:postId", validatePutPost, async (req, res) => {
    try {
        const { postId } = req.params;
        
        // Destructuring เฉพาะ fields ที่ต้องการ
        const { title, content, category_id, description, image, status_id, date, likes_count } = req.body;
        
        // ตรวจสอบว่าบทความมีอยู่หรือไม่
        const { data: existingPost, error: fetchError } = await supabase
            .from('posts')
            .select('id')
            .eq('id', postId)
            .single();

        if (fetchError) {
            return res.status(404).json({
                "message": "Server could not find a requested post to update"
            });
        }

        // สร้าง update object เฉพาะ fields ที่มีค่า
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (content !== undefined) updateFields.content = content;
        if (category_id !== undefined) updateFields.category_id = category_id;
        if (description !== undefined) updateFields.description = description;
        if (image !== undefined) updateFields.image = image;
        if (status_id !== undefined) updateFields.status_id = status_id;
        if (date !== undefined) updateFields.date = date;
        if (likes_count !== undefined) updateFields.likes_count = likes_count;

        // อัพเดทข้อมูลใน Supabase
        const { data, error } = await supabase
            .from('posts')
            .update(updateFields)
            .eq('id', postId)
            .select();

        if (error) {
            throw error;
        }

        res.status(200).json({
            "message": "Updated post sucessfully"
        });

    } catch (error) {
        console.error('Server could not update post because database connection:', error);
        res.status(500).json({ "error": error.message });
    }
});

// DELETE /posts/:postId - ลบบทความ
router.delete("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        // ตรวจสอบว่าบทความมีอยู่หรือไม่
        const { data: existingPost, error: fetchError } = await supabase
            .from('posts')
            .select('id')
            .eq('id', postId)
            .single();

        if (fetchError) {
            return res.status(404).json({
                "message": "Server could not find a requested post to delete"
            });
        }

        // ลบบทความจาก Supabase
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) {
            throw error;
        }

        res.status(200).json({
            "message": "Deleted post sucessfully"
        });

    } catch (error) {
        console.error('Server could not delete post because database connection:', error);
        res.status(500).json({ 
            "message": "Server could not delete post because database connection" 
        });
    }
});

export default router;
