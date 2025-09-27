import * as React from "react";

// Mock comments data
const mockComments = [
  {
    id: 1,
    author: "Jacob Lash",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    date: "12 September 2024 at 18:30",
    content: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting."
  },
  {
    id: 2,
    author: "Ahri",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    date: "12 September 2024 at 18:30",
    content: "Such a great read! I've always wondered why my cat slow blinks at me—now I know it's her way of showing trust!"
  },
  {
    id: 3,
    author: "Mimi mama",
    avatar: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=40&h=40&fit=crop&crop=face",
    date: "12 September 2024 at 18:30",
    content: "This article perfectly captures why cats make such amazing pets. I had no idea their purring could help with healing. Fascinating stuff!"
  }
];

function CommentSection() {
  const [comments, setComments] = React.useState(mockComments);
  const [newComment, setNewComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment = {
        id: comments.length + 1,
        author: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        content: newComment.trim()
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment("");
      setIsSubmitting(false);
    }, 1000);
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
              <div className="flex items-center gap-2 mb-2">
                <h4 className="b1 font-semibold" style={{ color: 'var(--brown-600)' }}>
                  {comment.author}
                </h4>
                <span className="b3" style={{ color: 'var(--brown-400)' }}>
                  {comment.date}
                </span>
              </div>
              <p className="b1 leading-relaxed" style={{ color: 'var(--brown-500)' }}>
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
