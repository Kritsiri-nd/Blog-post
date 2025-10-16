import express from 'express';
import supabase from '../utils/supabaseClient.js';
import protectUser from '../middleware/protectUser.mjs';

const router = express.Router();

// GET /notifications - ดึงการแจ้งเตือนทั้งหมดสำหรับผู้ใช้ที่ล็อกอิน
router.get('/', protectUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        id,
        created_at,
        type,
        is_read,
        actor:actor_id(name, profile_pic),
        post:post_id(id, title)
      `)
      .eq('user_to_notify_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ notifications: data });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /notifications/:notificationId/read - อัปเดตสถานะการแจ้งเตือนเป็น "อ่านแล้ว"
router.put('/:notificationId/read', protectUser, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_to_notify_id', userId) // Ensure user can only update their own notifications
      .select()
      .single();

    if (error) throw error;

    if (!data) {
        return res.status(404).json({ error: "Notification not found or user not authorized." });
    }

    res.status(200).json({ message: 'Notification marked as read.', notification: data });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /notifications/read-all - อัปเดตการแจ้งเตือนทั้งหมดเป็น "อ่านแล้ว"
router.put('/read-all', protectUser, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_to_notify_id', userId)
        .eq('is_read', false); // Only update unread notifications
  
      if (error) throw error;
  
      res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

export default router;