import * as React from "react";
import axios from "axios";
import { toast } from "sonner";
import LoginModal from "./LoginModal";
import { useAuth } from "../context/authentication.jsx";

function CommentSection({ postId }) {
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  
  // Use real authentication context
  const { isAuthenticated } = useAuth();

  // ดึง comments จาก Server เมื่อ component โหลด
  React.useEffect(() => {
    const fetchComments = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get(`/posts/${postId}/comments`);
        setComments(response.data.comments || []);
=======
        const response = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
        const commentsWithAvatars = (response.data.comments || []).map(comment => ({
          ...comment,
          avatar: comment.author_avatar || "/src/assets/default-user.jpg"
        }));
        setComments(commentsWithAvatars);
>>>>>>> ae047e8 (feat: add default user avatar and format date in BlogCard and PostPage)
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/posts/${postId}/comments`, {
        content: newComment.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Add comment to local state
      const newCommentData = {
        id: response.data.comment.id,
        author: response.data.comment.author_name,
        avatar: response.data.comment.author_avatar || "/src/assets/default-user.jpg",
        date: new Date(response.data.comment.created_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        content: response.data.comment.content
      };
      
      setComments(prev => [...prev, newCommentData]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error('Comment error:', error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="mt-12">
      <h3 className="h3 mb-6" style={{ color: 'var(--brown-600)' }}>Comment</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full p-4 border rounded-lg resize-none"
            style={{
              borderColor: 'var(--brown-300)',
              backgroundColor: 'var(--white)',
              color: 'var(--brown-600)',
              minHeight: '100px'
            }}
            rows={4}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-6 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: isSubmitting ? 'var(--brown-400)' : 'var(--brown-600)',
              color: 'var(--white)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            
            {/* Comment Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="b1 font-semibold" style={{ color: 'var(--brown-600)' }}>
                    {comment.author}
                  </h4>
                  <span className="b3" style={{ color: 'var(--brown-400)' }}>
                    {comment.date}
                  </span>
                </div>
              </div>
              <p className="b1 leading-relaxed" style={{ color: 'var(--brown-500)' }}>
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}

export default CommentSection;
