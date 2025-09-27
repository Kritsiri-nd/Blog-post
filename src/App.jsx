import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import HeroSection from "./component/HeroSection";
import ArticleSection from "./component/ArticleSection";
import PostPage from "./component/PostPage";
import NotFoundPage from "./component/NotFoundPage";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <ArticleSection />
            </>
          } />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;