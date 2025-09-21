export default function BlogCard({ image, category, title, description, author, date }) {
  return (
    <div className="flex flex-col gap-4">
      <a href="#" className="relative h-[212px] sm:h-[260px]">
        <img
          className="w-full h-full object-cover rounded-md"
          src={image}
          alt={title}
        />
      </a>
      <div className="flex flex-col">
        <div className="flex">
          <span className="bg-green-200 rounded-full px-3 py-1 b2 font-semibold text-green-600 mb-2">
            {category}
          </span>
        </div>
        <a href="#">
          <h2 className="text-start h4 text-brown-600  mb-2  hover:underline">
            {title}
          </h2>
        </a>
        <p className="text-muted-foreground b2 text-brown-400 mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        <div className="flex items-center b2">
          <span className="text-brown-500">{author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-brown-400">{date}</span>
        </div>
      </div>
    </div>
  );
}
