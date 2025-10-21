
import * as React from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/authentication.jsx";

function ArticleSection() {
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = React.useState([]);
  const [category, setCategory] = React.useState("");
  const [posts, setPosts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  // ดึง categories จากฐานข้อมูลเมื่อ component โหลด
  React.useEffect(() => {
    fetchCategories();
  }, []);

  // ฟังก์ชันดึงข้อมูลที่จะถูกเรียกเมื่อ page หรือ category เปลี่ยนแปลง
  React.useEffect(() => {
    fetchPosts();
  }, [page, category]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      // เพิ่ม "All" category ที่ด้านหน้า
      const allCategories = [
        { id: 'all', name: 'All' },
        ...response.data
      ];
      setCategories(allCategories);
      // ตั้งค่า "All" เป็น default
      setCategory('All');
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    
    try {
      // ใช้ category parameter เฉพาะเมื่อไม่ใช่ "All"
      const categoryParam = (category && category !== 'All') ? category : "";
      
      // ใช้ API endpoint ที่ถูกต้องตาม role
      const apiUrl = (user?.role === 'admin') 
        ? "/posts/admin" 
        : "/posts";
      
      const response = await axios.get(apiUrl, {
        params: {
          page: page,
          limit: 6,
          category: categoryParam
        },
        headers: (user?.role === 'admin') ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        } : {}
      });
      
      // ตรวจสอบว่าเป็นหน้าแรกหรือไม่
      if (page === 1) {
        // ถ้าเป็นหน้าแรก ให้แทนที่ posts ทั้งหมด
        setPosts(response.data.posts);
      } else {
        // ถ้าไม่ใช่หน้าแรก ให้รวมกับ posts เดิม และกรอง ID ที่ซ้ำ
        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map(post => post.id));
          const newPosts = response.data.posts.filter(post => !existingIds.has(post.id));
          return [...prevPosts, ...newPosts];
        });
      }
      
      // ตรวจสอบว่าได้ข้อมูลหน้าสุดท้ายแล้วหรือยัง
      if (response.data.currentPage >= response.data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // รีเซ็ตข้อมูลเมื่อเปลี่ยน category
  React.useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [category]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <section className="w-full mx-auto max-w-[1200px] p-10">
      <div>
        <h1 className="h3">Latest articles</h1>
        <div className="bg-brown-200 mt-2 px-10">
        {/* Desktop: Category buttons + Search */}
        <div className="sm:flex hidden gap-4 py-10 px-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded font-medium text-sm transition-colors
                ${
                  category === cat.name
                    ? "bg-brown-500 text-white cursor-not-allowed"
                    : "bg-brown-300 hover:bg-brown-400"
                }`}
              disabled={category === cat.name}
              onClick={() => setCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}

          <div className="ml-auto">
            <SearchBar />
          </div>
        </div>

        {/* Mobile: Select + Search */}
        <div className="sm:hidden flex flex-col gap-4 py-10">
          {/* Search */}
          <SearchBar />

          {/* Category Select */}
          <div className="relative flex">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full bg-white rounded-lg p-2 b1 text-brown-600 border border-brown-300 focus:outline-none focus:ring-2 focus:ring-brown-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        </div>
      </div>

      {/* Grid Layout: render ตาม posts จาก API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {posts.map((post) => (
          <BlogCard
            key={`${post.id}-${category}-${page}`}
            id={post.id}
            image={post.image}
            category={post.categories?.name || post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            author_avatar={post.author_avatar}
            date={post.date}
          />
        ))}
      </div>

      {/* View More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="hover:text-muted-foreground font-medium underline"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View more"}
          </button>
        </div>
      )}
    </section>
  );
}

export default ArticleSection;
