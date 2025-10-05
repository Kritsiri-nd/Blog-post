import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import ArticleSection from "./components/ArticleSection";
import AdminLayout from "./components/AdminLayout";

// Pages
import PostPage from "./pages/PostPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SignUpSuccess from "./pages/SignUpSuccess";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import ArticleManagement from "./pages/ArticleManagement";
import CreateArticle from "./pages/CreateArticle";
import CategoryManagement from "./pages/CategoryManagement";
import CreateCategory from "./pages/CreateCategory";
import EditCategory from "./pages/EditCategory";
import AdminProfile from "./pages/AdminProfile";
import AdminNotification from "./pages/AdminNotification";
import AdminResetPassword from "./pages/AdminResetPassword";
import AdminLogin from "./pages/AdminLogin";

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
        <Route path="/profile" element={
          <>
            <Navbar />
            <Profile />
          </>
        } />
        <Route path="/reset-password" element={
          <>
            <Navbar />
            <ResetPassword />
          </>
        } />
        <Route path="/admin/articles" element={
          <AdminLayout>
            <ArticleManagement />
          </AdminLayout>
        } />
        <Route path="/admin/articles/create" element={
          <AdminLayout>
            <CreateArticle />
          </AdminLayout>
        } />
        <Route path="/admin/categories" element={
          <AdminLayout>
            <CategoryManagement />
          </AdminLayout>
        } />
        <Route path="/admin/categories/create" element={
          <AdminLayout>
            <CreateCategory />
          </AdminLayout>
        } />
        <Route path="/admin/categories/edit/:id" element={
          <AdminLayout>
            <EditCategory />
          </AdminLayout>
        } />
        <Route path="/admin/profile" element={
          <AdminLayout>
            <AdminProfile />
          </AdminLayout>
        } />
        <Route path="/admin/notifications" element={
          <AdminLayout>
            <AdminNotification />
          </AdminLayout>
        } />
        <Route path="/admin/reset-password" element={
          <AdminLayout>
            <AdminResetPassword />
          </AdminLayout>
        } />
        <Route path="/admin/login" element={<AdminLogin />} />
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