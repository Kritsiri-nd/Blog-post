import { useNavigate } from "react-router-dom";
import { formatThaiDate } from "../lib/utils";

export default function BlogCard({ image, category, title, description, author, author_avatar, date, id }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={handleClick}
        className="relative h-[212px] sm:h-[260px] w-full cursor-pointer"
      >
        <img
          className="w-full h-full object-cover rounded-md hover:opacity-90 transition-opacity"
          src={image}
          alt={title}
        />
      </button>
      <div className="flex flex-col">
        <div className="flex">
          <span 
            className="rounded-full px-3 py-1 b2 font-semibold mb-2"
            style={{ backgroundColor: 'var(--green-light)', color: 'var(--green)' }}
          >
            {category}
          </span>
        </div>
        <button onClick={handleClick} className="text-left">
          <h2 
            className="h4 mb-2 hover:underline cursor-pointer"
            style={{ color: 'var(--brown-600)' }}
          >
            {title}
          </h2>
        </button>
        <p 
          className="b2 mb-4 flex-grow line-clamp-3"
          style={{ color: 'var(--brown-400)' }}
        >
          {description}
        </p>
        <div className="flex items-center gap-3 b2">
          <img 
            src={author_avatar || "/src/assets/default-user.jpg"} 
            alt={author}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--brown-500)' }}>{author}</span>
            <span style={{ color: 'var(--brown-300)' }}>|</span>
            <span style={{ color: 'var(--brown-400)' }}>{formatThaiDate(date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
