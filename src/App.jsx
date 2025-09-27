import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import HeroSection from "./component/HeroSection";
import ArticleSection from "./component/ArticleSection";
import PostPage from "./component/PostPage";

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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;