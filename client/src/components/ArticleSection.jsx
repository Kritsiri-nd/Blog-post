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
import CoffeeLoading from "./CoffeeLoading";
import { useAuth } from "../context/authentication.jsx";

function ArticleSection() {
  const { user } = useAuth();
  const [categories, setCategories] = React.useState([]);
  const [category, setCategory] = React.useState("All");
  const [posts, setPosts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);

  // ดึง categories ครั้งแรก
  React.useEffect(() => {
    fetchCategories();
  }, []);

  // โหลดโพสต์ทุกครั้งที่ page หรือ category เปลี่ยน
  React.useEffect(() => {
    fetchPosts();
  }, [page, category]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      const allCategories = [{ id: "all", name: "All" }, ...response.data];
      setCategories(allCategories);
      setCategory("All");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async () => {
    if (page === 1) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const categoryParam = category !== "All" ? category : "";
      const apiUrl = user?.role === "admin" ? "/posts/admin" : "/posts";


      const response = await axios.get(apiUrl, {
        params: { page, limit: 6, category: categoryParam },
        headers: user?.role === "admin"
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {},
      });

      if (page === 1) {
        setPosts(response.data.posts || []);
      } else {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPosts = (response.data.posts || []).filter((p) => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
      }

      if (response.data.currentPage >= response.data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  // รีเซ็ตเมื่อเปลี่ยนหมวดหมู่
  React.useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true); // เพิ่มเพื่อให้แสดง CoffeeLoading ตอนเปลี่ยนหมวด
  }, [category]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

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
                  ${category === cat.name
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
            <SearchBar />
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

      {/* ✅ Posts Grid */}
      {isLoading && page === 1 ? (
        // ☕ แสดงตอนโหลดด้วย CoffeeLoading
        <div className="flex justify-center items-center min-h-[60vh]">
          <CoffeeLoading text="กำลังชงกาแฟของคุณ..." />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          ไม่มีบทความในหมวดนี้ ☕
        </div>
      ) : (
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
      )}

      {/* ✅ Loader ตอนโหลดเพิ่ม */}
      {isFetchingMore && (
        <div className="flex justify-center items-center py-6">
          <CoffeeLoading size="w-8 h-8" text="กำลังเทกาแฟเพิ่ม..." />
        </div>
      )}

      {/* ✅ View More */}
      {!isFetchingMore && hasMore && posts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="hover:text-muted-foreground font-medium underline"
          >
            View more
          </button>
        </div>
      )}
    </section>
  );
}

export default ArticleSection;
