import * as React from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import InteractionButtons from "./InteractionButtons";
import CommentSection from "./CommentSection";

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
        `https://blog-post-project-api.vercel.app/posts/${postId}`
      );
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Failed to load post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)' }}>
        <div className="w-full mx-auto max-w-[1200px] p-10">
          <div className="text-center">
            <div className="h3" style={{ color: 'var(--brown-600)' }}>Loading...</div>
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
            <h1 className="h2 mb-6 text-brown-600">{post.title}</h1>

            {/* Description */}
            <p className="b1 mb-8 leading-relaxed text-brown-500">
              {post.description}
            </p>

            {/* Content */}
            <div className="markdown">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Interaction Buttons */}
            <InteractionButtons likes={post.likes} postId={post.id} />

            {/* Comment Section */}
            <CommentSection />
          </article>

          {/* Author Sidebar */}
          <aside className="lg:w-80 lg:flex-shrink-0">
            <div 
              className="rounded-lg p-6 bg-brown-200 sticky-sidebar"
              style={{ 
                position: 'sticky', 
                top: '1rem',
                alignSelf: 'flex-start'
              }}
            >
              <h3 className="h4 mb-4 text-brown-600">Author</h3>
              
              {/* Author Photo */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/src/assets/authorPhoto.jpg"
                  alt={post.author}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="h4 text-brown-600" >{post.author}</h4>
                </div>
              </div>

              {/* Author Bio */}
              <p className="b2 leading-relaxed text-brown-500" >
                I am a pet enthusiast and freelance writer who specializes in animal behavior and care. 
                With a deep love for cats, I enjoy sharing insights on feline companionship and wellness. 
                When I'm not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.
              </p>
            </div>
          </aside>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-lg transition-colors b1 bg-brown-500 text-white"
            
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--brown-600)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--brown-500)'}
          >
            Back to Articles
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
