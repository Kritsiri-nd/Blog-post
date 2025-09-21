import Search from "../assets/Search.png";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blogPosts } from "../data/blogPosts.js";
import BlogCard from "./BlogCard";

const categories = ["Highlight", "Cat", "Inspiration", "General"];

function ArticleSection() {
  const [category, setCategory] = React.useState("Highlight"); // ✅ ค่าเริ่มต้น

  // ✅ filter posts ตาม category
  const filteredPosts = blogPosts.filter(
    (post) => category === "Highlight" || post.category === category
  );

  return (
    <section className="w-full mx-auto max-w-[1200px] p-10">
      <div className="bg-brown-200 px-10">
        <h1 className="h3">Latest articles</h1>

        {/* ✅ Desktop: Category buttons + Search */}
        <div className="sm:flex hidden gap-4 py-10 px-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded font-medium text-sm transition-colors
                ${
                  category === cat
                    ? "bg-brown-500 text-white cursor-not-allowed" // ถ้าเลือกอยู่
                    : "bg-brown-300 hover:bg-brown-400" // ปกติ
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

        {/* ✅ Mobile: Select + Search */}
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

      {/* ✅ Grid Layout: render ตาม filteredPosts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {filteredPosts.map((post) => (
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
    </section>
  );
}

export default ArticleSection;
