import supabase from "../utils/supabaseClient.js";

// Middleware ตรวจสอบ JWT token และดึง user_id
const protectUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // ใช้ Supabase ตรวจสอบ token และดึงข้อมูลผู้ใช้
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // ดึงข้อมูลโปรไฟล์เพิ่มเติมจากตาราง 'users'
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role') // ดึงเฉพาะ role
      .eq('id', data.user.id)
      .single();

    if (profileError || !userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // แนบข้อมูลผู้ใช้และ role เข้ากับ request object
    req.user = { ...data.user, role: userProfile.role };

    // ดำเนินการต่อไปยัง middleware หรือ route handler ถัดไป
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectUser;

