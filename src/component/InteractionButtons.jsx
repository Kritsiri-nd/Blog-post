import * as React from "react";
import { toast } from "sonner";
import FacebookIcon from "../assets/Facebook_ic.png";
import LinkedInIcon from "../assets/LinkedIN_ic.png";
import TwitterIcon from "../assets/Twitter_ic.png";
import LoginModal from "./LoginModal";

function InteractionButtons({ likes, postId }) {
  const [likeCount, setLikeCount] = React.useState(likes || 0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  
  // Simulate user not logged in (as per requirement)
  const isLoggedIn = false;

  const handleLike = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
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
      toast.success("Copied!", {
        description: "This article has been copied to your clipboard.",
      });
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/post/${postId}`;
    const title = document.title;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/share.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://www.twitter.com/share?&url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <>
    {/* Mobile Layout */}
    <div className="lg:hidden space-y-4">
      {/* Top Row: Like Button */}
      <div className="flex justify-start">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 px-8 py-4 rounded-lg border transition-colors w-full max-w-xs ${
            isLiked 
              ? 'bg-green-50 text-green-600 border-green-200' 
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="text-lg">😊</span>
          <span className="text-xs font-medium">{likeCount}</span>
        </button>
      </div>

      {/* Bottom Row: Copy Link and Social Media Buttons */}
      <div className="flex items-center justify-between gap-3">
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-gray-800 border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm">🔗</span>
          <span className="text-xs font-medium">Copy link</span>
        </button>

        {/* Social Media Share Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShare("facebook")}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105"
          >
            <img 
              src={FacebookIcon} 
              alt="Facebook" 
              className="w-6 h-6"
            />
          </button>
          
          <button
            onClick={() => handleShare("linkedin")}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105"
          >
            <img 
              src={LinkedInIcon} 
              alt="LinkedIn" 
              className="w-6 h-6"
            />
          </button>
          
          <button
            onClick={() => handleShare("twitter")}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105"
          >
            <img 
              src={TwitterIcon} 
              alt="Twitter" 
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>

    {/* Desktop Layout */}
    <div className="hidden lg:flex items-center gap-4 mb-8">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-8 py-4 rounded-full transition-colors ${
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
      <div className="flex items-center">
        <button
          onClick={() => handleShare("facebook")}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105 "
        >
          <img 
            src={FacebookIcon} 
            alt="Facebook" 
            className="w-10 h-10"
          />
        </button>
        
        <button
          onClick={() => handleShare("linkedin")}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105 "
        >
          <img 
            src={LinkedInIcon} 
            alt="LinkedIn" 
            className="w-10 h-10"
          />
        </button>
        
        <button
          onClick={() => handleShare("twitter")}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105 "
        >
          <img 
            src={TwitterIcon} 
            alt="Twitter" 
            className="w-10 h-10"
          />
        </button>
      </div>
    </div>

    {/* Login Modal */}
    <LoginModal 
      isOpen={showLoginModal} 
      onClose={() => setShowLoginModal(false)} 
    />
  </>
  );
}

export default InteractionButtons;
