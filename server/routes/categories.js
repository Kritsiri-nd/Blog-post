import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /categories - ดึงข้อมูล categories ทั้งหมด
router.get("/", async (req, res) => {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            throw error;
        }

        res.status(200).json(categories || []);
    } catch (error) {
        console.error('Server could not read categories:', error);
        res.status(500).json({ "error": error.message });
    }
});

// GET /categories/:id - ดึงข้อมูล category เดียว
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                "message": "Category not found"
            });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Server could not read category:', error);
        res.status(500).json({ "error": error.message });
    }
});

export default router;

