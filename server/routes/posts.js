import express from 'express';
import supabase from '../utils/supabaseClient.js';
import { validatePutPost, validatePostPost } from '../middleware/validation.js';
import protectUser from '../middleware/protectUser.mjs';
import protectAdmin from '../middleware/protectAdmin.mjs';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// ฟังก์ชันสำหรับส่ง Notification เมื่อมีโพสต์ใหม่จาก Admin
const sendNewPostNotification = async (postId, authorId) => {
    try {
        // ดึงรายชื่อ User ทั้งหมด (ที่ไม่ใช่ admin)
        const { data: usersToNotify, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('role', 'user');

        if (userError) throw userError;

        // สร้าง Notification สำหรับ User แต่ละคน
        const notifications = usersToNotify.map(user => ({
            user_to_notify_id: user.id,
            actor_id: authorId,
            type: 'new_post',
            post_id: postId,
        }));

        if (notifications.length > 0) {
            await supabase.from('notifications').insert(notifications);
        }
    } catch (error) {
        console.error('Failed to send new post notifications:', error);
    }
};

// POST /posts - สร้างบทความใหม่ (ต้องเป็น user)
router.post("/", protectUser, validatePostPost, async (req, res) => {
    try {
        const { title, image, category_id, description, content, status_id } = req.body;
        const userId = req.user.id; // ดึง user_id จาก protectUser middleware

        // สร้างบทความใน Supabase
        const { data, error } = await supabase
            .from('posts')
            .insert({
                user_id: userId, // เพิ่ม user_id ของผู้สร้าง
                title,
                image,
                category_id,
                description,
                content,
                status_id,
                user_id: req.user.id, // เพิ่ม user_id ของผู้สร้างบทความ
                date: new Date().toISOString(), // เพิ่มวันที่ปัจจุบัน
                likes_count: 0 // เริ่มต้นด้วย 0 likes
            })
            .select()
            .single(); // ใช้ single() เพราะเราคาดหวังผลลัพธ์เดียว

        if (error) {
            throw error;
        }

        // ถ้าโพสต์ถูกเผยแพร่ (Published) และผู้สร้างเป็น Admin ให้แจ้งเตือน Member ทุกคน
        const post = data;
        const authorRole = req.user.role;
        const PUBLISHED_STATUS_ID = 1; // สมมติว่า status_id = 1 คือ 'Published'

        if (post && parseInt(status_id, 10) === PUBLISHED_STATUS_ID && authorRole === 'admin') {
            await sendNewPostNotification(post.id, userId);
        }

        res.status(201).json({
            "message": "Post created successfully",
            "data": post
        });

    } catch (error) {
        console.error('Server could not create post because database connection:', error);
        res.status(500).json({ "error": error.message });
    }
});

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
        res.status(500).json({ "error": error.message });
    }
});

// GET /posts/:postId - ดึงข้อมูลบทความเดียวจาก Supabase
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        // ดึงข้อมูลจาก Supabase พร้อมข้อมูล author
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                users!inner(id, name, bio, profile_pic)
            `)
            .eq('id', postId)
            .single();

        if (error) {
            // ถ้าไม่พบข้อมูล
            return res.status(404).json({
                "message": "Server could not find a requested post"
            });
        }
        
        // จัดรูปแบบข้อมูลให้เหมาะสมกับ frontend
        const formattedData = {
            ...data,
            author: data.users.name,
            author_bio: data.users.bio,
            author_avatar: data.users.profile_pic,
            author_id: data.users.id
        };
        
        // ลบข้อมูล users object ออกเพราะเราได้แยกข้อมูลออกมาแล้ว
        delete formattedData.users;
        
        // ถ้าพบข้อมูล
        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Server could not read post because database connection:', error);
        res.status(500).json({ "error": error.message });
    }
});

// PUT /posts/:postId - แก้ไขบทความที่มีอยู่ (ต้องเป็น user)
router.put("/:postId", protectUser, validatePutPost, async (req, res) => {
    try {
        const { postId } = req.params;
        
        // Destructuring เฉพาะ fields ที่ต้องการ
        const { title, content, category_id, description, image, status_id, date, likes_count } = req.body;
        
        // ตรวจสอบว่าบทความมีอยู่หรือไม่ และดึงสถานะปัจจุบัน
        const { data: existingPost, error: fetchError } = await supabase
            .from('posts')
            .select('id, status_id, user_id')
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

        // ตรวจสอบว่าสถานะถูกเปลี่ยนเป็น 'Published' หรือไม่
        const PUBLISHED_STATUS_ID = 1;
        const previousStatusId = existingPost.status_id;
        const authorRole = req.user.role;

        if (
            status_id !== undefined &&
            parseInt(status_id, 10) === PUBLISHED_STATUS_ID &&
            previousStatusId !== PUBLISHED_STATUS_ID &&
            authorRole === 'admin'
        ) {
            await sendNewPostNotification(postId, existingPost.user_id);
        }

        res.status(200).json({
            "message": "Updated post sucessfully"
        });

    } catch (error) {
        console.error('Server could not update post because database connection:', error);
        res.status(500).json({ "error": error.message });
    }
});

// DELETE /posts/:postId - ลบบทความ (ต้องเป็น admin)
router.delete("/:postId", protectAdmin, async (req, res) => {
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
        res.status(500).json({ "error": error.message });
    }
});

// GET /posts/:postId/like-status - ตรวจสอบ like status
router.get("/:postId/like-status", protectUser, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        
        // ดึงข้อมูล post
        const { data: post, error: postError } = await supabase
            .from('posts')
            .select('likes_count')
            .eq('id', postId)
            .single();
            
        if (postError) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        // ตรวจสอบว่า user เคย like post นี้หรือไม่
        const { data: existingLike, error: likeError } = await supabase
            .from('likes')
            .select('id')
            .eq('user_id', userId)
            .eq('post_id', postId)
            .single();
            
        res.status(200).json({
            likeCount: post.likes_count || 0,
            isLiked: !!existingLike
        });
        
    } catch (error) {
        console.error('Like status error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /posts/:postId/like - เพิ่ม like
router.post("/:postId/like", protectUser, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        
        // ตรวจสอบว่า user เคย like post นี้แล้วหรือไม่
        const { data: existingLike, error: likeError } = await supabase
            .from('likes')
            .select('id')
            .eq('user_id', userId)
            .eq('post_id', postId)
            .single();
            
        if (existingLike) {
            // ถ้าเคย like แล้ว ให้ unlike แทน
            await supabase
                .from('likes')
                .delete()
                .eq('user_id', userId)
                .eq('post_id', postId);
            
            // ลด likes_count ใน posts table
            const { data: currentPost } = await supabase
                .from('posts')
                .select('likes_count')
                .eq('id', postId)
                .single();
                
            if (currentPost) {
                await supabase
                    .from('posts')
                    .update({ likes_count: Math.max(0, currentPost.likes_count - 1) })
                    .eq('id', postId);
            }
                
            return res.status(200).json({
                message: "Like removed successfully",
                action: "unliked"
            });
        }
        
        // เพิ่ม like ใน Supabase
        const { data, error } = await supabase
            .from('likes')
            .insert({
                user_id: userId,
                post_id: postId
            })
            .select()
            .single();
            
        if (error) {
            return res.status(500).json({ error: "Failed to add like" });
        }
        
        // เพิ่ม likes_count ใน posts table
        const { data: currentPost } = await supabase
            .from('posts')
            .select('likes_count')
            .eq('id', postId)
            .single();
            
        if (currentPost) {
            await supabase
                .from('posts')
                .update({ likes_count: (currentPost.likes_count || 0) + 1 })
                .eq('id', postId);
        }
        
        // สร้าง Notification สำหรับเจ้าของโพสต์
        try {
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select('user_id')
                .eq('id', postId)
                .single();

            if (postError) {
                console.error("Error fetching post for notification:", postError.message);
                return; // Exit if we can't get post info
            }

            // Ensure postData and user_id exist and the user is not the post owner
            if (postData && postData.user_id && postData.user_id !== userId) {
                const { error: notificationError } = await supabase
                    .from('notifications')
                    .insert({
                        user_to_notify_id: postData.user_id,
                        actor_id: userId,
                        type: 'like_post',
                        post_id: postId,
                    });
                
                if (notificationError) {
                    console.error("Error creating like notification:", notificationError.message);
                }
            }
        } catch (e) {
            console.error("Exception during like notification creation:", e.message);
        }

        res.status(201).json({
            message: "Like added successfully",
            action: "liked",
            like: data
        });
        
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /posts/:postId/comments - ดึง comments
router.get("/:postId/comments", async (req, res) => {
    try {
        const { postId } = req.params;
        
        // ดึง comments จาก Supabase
        const { data: comments, error } = await supabase
            .from('comments')
            .select(`
                id,
                comment_text,
                created_at,
                users!inner(name, profile_pic)
            `)
            .eq('post_id', postId)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('Comments fetch error:', error);
            return res.status(500).json({ error: "Failed to fetch comments" });
        }
        
        // Format comments data
        const formattedComments = comments.map(comment => ({
            id: comment.id,
            content: comment.comment_text,
            created_at: comment.created_at,
            author_name: comment.users.name,
            author_avatar: comment.users.profile_pic
        }));
        
        res.status(200).json({
            comments: formattedComments
        });
        
    } catch (error) {
        console.error('Comments error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /posts/:postId/comments - เพิ่ม comment
router.post("/:postId/comments", protectUser, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        
        if (!content || !content.trim()) {
            return res.status(400).json({ error: "Content is required" });
        }
        
        // ดึงข้อมูล user profile
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('name, profile_pic')
            .eq('id', userId)
            .single();
            
        if (profileError) {
            console.error('Profile error:', profileError);
            return res.status(500).json({ error: "Failed to get user profile" });
        }
        
        // เพิ่ม comment ใน Supabase
        const { data, error } = await supabase
            .from('comments')
            .insert({
                user_id: userId,
                post_id: postId,
                comment_text: content.trim()
            })
            .select()
            .single();
            
        if (error) {
            console.error('Comment insert error:', error);
            return res.status(500).json({ error: "Failed to add comment", details: error.message });
        }
        
        // ไม่ต้องอัปเดต comments_count เพราะ column ไม่มีใน posts table
        
        // สร้าง Notification สำหรับเจ้าของโพสต์
        try {
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select('user_id')
                .eq('id', postId)
                .single();

            if (postError) {
                console.error("Error fetching post for notification:", postError.message);
                return; // Exit if we can't get post info
            }

            // Ensure postData and user_id exist and the user is not the post owner
            if (postData && postData.user_id && postData.user_id !== userId) {
                const { error: notificationError } = await supabase
                    .from('notifications')
                    .insert({
                        user_to_notify_id: postData.user_id,
                        actor_id: userId,
                        type: 'comment_post',
                        post_id: postId,
                    });

                if (notificationError) {
                    console.error("Error creating comment notification:", notificationError.message);
                }
            }
        } catch (e) {
            console.error("Exception during comment notification creation:", e.message);
        }

        // (Optional) แจ้งเตือนผู้ที่เคยคอมเมนต์ในโพสต์นี้
        // For now, we will skip this part as it can be added later.

        res.status(201).json({
            message: "Comment added successfully",
            comment: {
                id: data.id,
                content: data.comment_text,
                created_at: data.created_at,
                author_name: userProfile.name,
                author_avatar: userProfile.profile_pic
            }
        });
        
    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE /posts/:postId/comments/:commentId - ลบ comment
router.delete("/:postId/comments/:commentId", protectUser, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user.id;
        
        // ตรวจสอบว่า comment เป็นของ user นี้หรือไม่
        const { data: comment, error: commentError } = await supabase
            .from('comments')
            .select('user_id')
            .eq('id', commentId)
            .eq('post_id', postId)
            .single();
            
        if (commentError || !comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        
        if (comment.user_id !== userId) {
            return res.status(403).json({ error: "Not authorized to delete this comment" });
        }
        
        // ลบ comment จาก Supabase
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);
            
        if (error) {
            return res.status(500).json({ error: "Failed to delete comment" });
        }
        
        // ไม่ต้องอัปเดต comments_count เพราะ column ไม่มีใน posts table
        
        res.status(200).json({
            message: "Comment deleted successfully"
        });
        
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;