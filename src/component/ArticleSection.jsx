import Search from "../assets/Search.png";
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const categorys = ["Highlight", "Cat", "Inspiration", "General"]
function ArticleSection() {
    return (
        <section className="w-full mx-auto max-w-[1200px] p-10">
  <div className="bg-brown-200 px-10">
    <h1 className="h3">Latest articles</h1>

    {/* ✅ Desktop: ปุ่ม + Search */}
    <div className="sm:flex hidden gap-4 py-10 px-10">
      <button className="b1">Highlight</button>
      <button className="b1">Cat</button>
      <button className="b1">Inspiration</button>
      <button className="b1">General</button>

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
    <Select>
      <SelectTrigger className="w-full bg-white border border-brown-300 rounded-lg p-2 b1">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categorys.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</div>

  </div>
</section>

    )
}
export default ArticleSection