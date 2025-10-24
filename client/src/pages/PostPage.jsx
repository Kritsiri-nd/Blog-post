import * as React from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import { formatThaiDate } from "../lib/utils";
import InteractionButtons from "../components/InteractionButtons";
import CommentSection from "../components/CommentSection";
import CoffeeLoading from "../components/CoffeeLoading";

function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/posts/${postId}`
      );
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Failed to load post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => formatThaiDate(dateString);

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)' }}>
        <div className="w-full mx-auto max-w-[1200px] p-10">
          <div className="text-center">
            <CoffeeLoading text="กำลังโหลดบทความ..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)' }}>
        <div className="w-full mx-auto max-w-[1200px] p-10">
          <div className="text-center">
            <div className="h3 mb-4" style={{ color: 'var(--red)' }}>{error}</div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded transition-colors"
              style={{
                backgroundColor: 'var(--brown-500)',
                color: 'var(--white)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--brown-600)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--brown-500)'}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)' }}>
        <div className="w-full mx-auto max-w-[1200px] p-10">
          <div className="text-center">
            <div className="h3 mb-4" style={{ color: 'var(--brown-600)' }}>Post not found</div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded transition-colors"
              style={{
                backgroundColor: 'var(--brown-500)',
                color: 'var(--white)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--brown-600)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--brown-500)'}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" >
      <div className="w-full mx-auto max-w-[1200px] p-10">
        {/* Header Image */}
        <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="flex-1 lg:max-w-none">
            {/* Category and Date */}
            <div className="flex items-center gap-4 mb-4">
              <span
                className="rounded-full px-3 py-1 b2 font-semibold bg-green-light text-green"

              >
                {post.category}
              </span>
              <span className="b2 text-brown-400">{formatDate(post.date)}</span>
            </div>

            {/* Title */}
            <h1 className="sm:h2 h3 mb-6 text-brown-600">{post.title}</h1>

            {/* Description */}
            <p className="b1 mb-8 leading-relaxed text-brown-500">
              {post.description}
            </p>

            {/* Content */}
            <div className="markdown">
              <ReactMarkdown >{post.content}</ReactMarkdown>
            </div>

            {/* Desktop Interaction Buttons - Only visible on desktop */}
            <div className="hidden lg:block">
              <InteractionButtons likes={post.likes} postId={post.id} />
            </div>

            {/* Mobile Author Card - Only visible on mobile */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm p-6 mb-8">
              {/* Author Section */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={post.author_avatar || "/src/assets/authorPhoto.jpg"}
                    alt={post.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-sm text-gray-500 ">Author</h3>
                    <h4 className="text-lg font-semibold text-gray-800">{post.author}</h4>
                  </div>
                </div>
                <hr className="w-full border-brown-300 mb-3" />
                {/* Author Bio */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {post.author_bio || "No bio available for this author."}
                </p>
              </div>
            </div>

            {/* Mobile Interaction Buttons - Only visible on mobile */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm p-6 mb-8">
              <InteractionButtons likes={post.likes} postId={post.id} />
            </div>

            {/* Comment Section */}
            <CommentSection postId={post.id} />
          </article>

          {/* Desktop Author Sidebar - Only visible on desktop */}
          <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0 ">
            <div
              className="bg-white rounded-xl p-6 sticky top-10 text-center shadow-sm"
            >
              {/* Author Photo */}
              <div className="flex flex-row items-center gap-4">
                <img
                  src={post.author_avatar || "/src/assets/authorPhoto.jpg"}
                  alt={post.author}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <div className="flex flex-col text-left">
                  <h3 className="text-[14px] text-brown-600 ">Author</h3>
                  <h4 className="h3 text-brown-600" >{post.author}</h4>
                </div>
              </div>
              <hr className="w-full border-brown-300 mb-3" />
              {/* Author Bio */}
              <p className="b1 leading-relaxed text-brown-500" >
                {post.author_bio || "No bio available for this author."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
