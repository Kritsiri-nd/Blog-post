import Search from "../assets/Search.png";
import * as React from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BlogCard from "./BlogCard";

const categories = ["Highlight", "Cat", "Inspiration", "General"];

function ArticleSection() {
  const [category, setCategory] = React.useState("Highlight");
  const [posts, setPosts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  // ฟังก์ชันดึงข้อมูลที่จะถูกเรียกเมื่อ page หรือ category เปลี่ยนแปลง
  React.useEffect(() => {
    fetchPosts();
  }, [page, category]);

  const fetchPosts = async () => {
    setIsLoading(true);
    
    try {
      // ใช้ category parameter เฉพาะเมื่อไม่ใช่ Highlight
      const categoryParam = category === "Highlight" ? "" : category;
      
      const response = await axios.get(
        "https://blog-post-project-api.vercel.app/posts", {
          params: {
            page: page,
            limit: 6,
            category: categoryParam
          }
        }
      );
      
      // รวมโพสต์ใหม่กับโพสต์เดิม
      setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      
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
      <div className="bg-brown-200 px-10">
        <h1 className="h3">Latest articles</h1>

        {/* Desktop: Category buttons + Search */}
        <div className="sm:flex hidden gap-4 py-10 px-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded font-medium text-sm transition-colors
                ${
                  category === cat
                    ? "bg-brown-500 text-white cursor-not-allowed"
                    : "bg-brown-300 hover:bg-brown-400"
                }`}
              disabled={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}

          <div className="relative flex ml-auto">
            <input
              type="text"
              placeholder="Search"
              className="b1 border border-brown-300 rounded-lg p-2 w-full sm:max-w-[350px]"
            />
            <img
              src={Search}
              alt="search"
              className="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {/* Mobile: Select + Search */}
        <div className="sm:hidden flex flex-col gap-4 py-10">
          {/* Search */}
          <div className="relative flex">
            <input
              type="text"
              placeholder="Search"
              className="b1 border border-brown-300 rounded-lg p-2 w-full"
            />
            <img
              src={Search}
              alt="search"
              className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          {/* Category Select */}
          <div className="relative flex">
            <Select value={category} onValueChange={(val) => setCategory(val)}>
              <SelectTrigger className="w-full bg-white rounded-lg p-2 b1 text-brown-600 border border-brown-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid Layout: render ตาม posts จาก API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
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
