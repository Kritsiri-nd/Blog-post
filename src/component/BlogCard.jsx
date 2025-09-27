import { useNavigate } from "react-router-dom";

export default function BlogCard({ image, category, title, description, author, date, id }) {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate(`/post/${id}`);
  };

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
          <span 
            className="rounded-full px-3 py-1 b2 font-semibold mb-2"
            style={{ backgroundColor: 'var(--green-light)', color: 'var(--green)' }}
          >
            {category}
          </span>
        </div>
        <button onClick={handleTitleClick} className="text-left">
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
        <div className="flex items-center b2">
          <span style={{ color: 'var(--brown-500)' }}>{author}</span>
          <span className="mx-2" style={{ color: 'var(--brown-300)' }}>|</span>
          <span style={{ color: 'var(--brown-400)' }}>{date}</span>
        </div>
      </div>
    </div>
  );
}
