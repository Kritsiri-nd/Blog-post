import * as React from "react";
import FacebookIcon from "../assets/Facebook_ic.png";
import LinkedInIcon from "../assets/LinkedIN_ic.png";
import TwitterIcon from "../assets/Twitter_ic.png";

function InteractionButtons({ likes, postId }) {
  const [likeCount, setLikeCount] = React.useState(likes || 0);
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/post/${postId}`;
    const title = document.title;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-8 py-4 rounded-full transition-colors  ${
          isLiked 
            ? 'bg-green-light text-green' 
            : 'bg-brown-200 text-brown-600'
        }`}
      >
        <span className="text-2xl">😊</span>
        <span className="b2 font-medium">{likeCount}</span>
      </button>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-8 py-4 rounded-full transition-colors bg-brown-200 text-brown-600 hover:bg-brown-300"
      >
        <span className="text-2xl">🔗</span>
        <span className="b2 font-medium">Copy link</span>
      </button>

      {/* Social Media Share Buttons */}
      <div className="flex items-center ">
        <button
          onClick={() => handleShare("facebook")}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm border border-gray-200"
        >
          <img 
            src={FacebookIcon} 
            alt="Facebook" 
            className="w-10 h-10"
          />
        </button>
        
        <button
          onClick={() => handleShare("linkedin")}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm border border-gray-200"
        >
          <img 
            src={LinkedInIcon} 
            alt="LinkedIn" 
            className="w-10 h-10"
          />
        </button>
        
        <button
          onClick={() => handleShare("twitter")}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm border border-gray-200"
        >
          <img 
            src={TwitterIcon} 
            alt="Twitter" 
            className="w-10 h-10"
          />
        </button>
      </div>
    </div>
  );
}

export default InteractionButtons;
