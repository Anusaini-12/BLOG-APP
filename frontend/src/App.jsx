import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Blogs from "./pages/blogs/Blogs";
import BlogDetails from './pages/blogs/BlogDetails';
import CreateBlog from './pages/blogs/CreateBlog';
import About from './pages/blogs/About';
import EditBlog from './pages/blogs/EditBlog';
import MyProfile from './pages/profile/MyProfile';
import UserProfile from './pages/profile/UserProfile';
import AdminProtected from './pages/admin/AdminProtected';
import AdminLayout from './pages/admin/AdminLayout';
import UsersPage from './pages/admin/UsersPage';
import BlogsPage from './pages/admin/BlogsPage';
import AdminDashboard from './pages/admin/AdminDashboard';

const App = () => {

  
  
  return (
     <BrowserRouter>
        <Routes>
        
        {/* Admin Protected Section */}
        <Route element={<AdminProtected />}>
          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="blogs" element={<BlogsPage />} />
         </Route>
        </Route>
 
          <Route path="/" element={<Home />} /> 
          <Route path="/about" element={<About />} /> 
          <Route path="/blogs" element={<Blogs />} />  
          <Route path="/blogs/:id" element={<BlogDetails />} />
          
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/profile/:id" element={<UserProfile />} />


          <Route path="/create" element={<CreateBlog />} />
          <Route path="/blogs/edit/:id" element={<EditBlog />} />

          <Route path="/register" element={<SignUp/>} />
          <Route path="/verify-otp" element={<VerifyOtp/>} />
          <Route path="/login" element={<Login />} />
         
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />    

          {/* <Route path="/admin" element={<AdminPanel />} /> */}
        </Routes>
     </BrowserRouter>
  )
}

export default App
