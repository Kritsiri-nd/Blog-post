import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ✅ ทุกครั้งที่เปลี่ยน path ให้ scroll ไปบนสุด
    window.scrollTo({
      top: 0,
      behavior: "auto", 
    });
  }, [pathname]);

  return null;
}
