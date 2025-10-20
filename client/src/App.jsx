import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/authentication.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";
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
import EditArticle from "./pages/EditArticle";
import CategoryManagement from "./pages/CategoryManagement";
import CreateCategory from "./pages/CreateCategory";
import EditCategory from "./pages/EditCategory";
import AdminProfile from "./pages/AdminProfile";
import AdminNotification from "./pages/AdminNotification";
import AdminResetPassword from "./pages/AdminResetPassword";
import AdminLogin from "./pages/AdminLogin";

// AppRoutes component ที่ใช้ useAuth hook
function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Routes>
      {/* เส้นทางสาธารณะที่ทุกคนเข้าถึงได้ */}
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

      {/* เส้นทางที่เฉพาะผู้ที่ยังไม่ล็อกอินเข้าถึงได้ */}
      <Route path="/signup" element={
        <AuthenticationRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
        >
          <>
            <Navbar />
            <SignUp />
          </>
        </AuthenticationRoute>
      } />
      <Route path="/signin" element={
        <AuthenticationRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
        >
          <>
            <Navbar />
            <SignIn />
          </>
        </AuthenticationRoute>
      } />
      <Route path="/signup-success" element={
        <AuthenticationRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
        >
          <>
            <Navbar />
            <SignUpSuccess />
          </>
        </AuthenticationRoute>
      } />

      {/* เส้นทางที่เฉพาะผู้ใช้ทั่วไปที่ล็อกอินแล้วเข้าถึงได้ */}
      <Route path="/profile" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="user"
        >
          <>
            <Navbar />
            <Profile />
          </>
        </ProtectedRoute>
      } />
      <Route path="/reset-password" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="user"
        >
          <>
            <Navbar />
            <ResetPassword />
          </>
        </ProtectedRoute>
      } />

      {/* เส้นทางที่เฉพาะผู้ดูแลระบบ (admin) เข้าถึงได้ */}
      <Route path="/admin" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <AdminProfile />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/articles" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <ArticleManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/articles/create" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <CreateArticle />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/articles/edit/:postId" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <EditArticle />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/categories" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <CategoryManagement />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/categories/create" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <CreateCategory />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/categories/edit/:id" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <EditCategory />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <AdminProfile />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <AdminNotification />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/reset-password" element={
        <ProtectedRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          requiredRole="admin"
        >
          <AdminLayout>
            <AdminResetPassword />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Admin Login - เฉพาะผู้ที่ยังไม่ล็อกอิน */}
      <Route path="/admin/login" element={
        <AuthenticationRoute
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
        >
          <AdminLogin />
        </AuthenticationRoute>
      } />

      {/* 404 Page */}
      <Route path="*" element={
        <>
          <Navbar />
          <NotFoundPage />
          <Footer />
        </>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}

export default App;