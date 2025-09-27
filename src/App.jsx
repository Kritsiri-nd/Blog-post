import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import HeroSection from "./component/HeroSection";
import ArticleSection from "./component/ArticleSection";
import PostPage from "./component/PostPage";
import NotFoundPage from "./component/NotFoundPage";
import SignUp from "./component/SignUp";
import SignIn from "./component/SignIn";
import SignUpSuccess from "./component/SignUpSuccess";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <HeroSection />
            <ArticleSection />
            <Footer />
          </>
        } />
        <Route path="/post/:postId" element={
          <>
            <Navbar />
            <PostPage />
            <Footer />
          </>
        } />
        <Route path="/signup" element={
          <>
            <Navbar />
            <SignUp />
          </>
        } />
        <Route path="/signin" element={
          <>
            <Navbar />
            <SignIn />
          </>
        } />
        <Route path="/signup-success" element={
          <>
            <Navbar />
            <SignUpSuccess />
          </>
        } />
        <Route path="*" element={
          <>
            <Navbar />
            <NotFoundPage />
            <Footer />
          </>
        } />
        </Routes>
        <Toaster position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;