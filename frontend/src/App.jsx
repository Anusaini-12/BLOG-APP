import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import AdminPanel from './pages/admin/AdminPanel';

const App = () => {
  
  return (
     <BrowserRouter>
        <Routes>
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

          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
     </BrowserRouter>
  )
}

export default App
