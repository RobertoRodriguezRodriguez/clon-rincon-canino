import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// import BookPage from "./pages/book-page";
// import ContactPage from "./pages/contact-page";

import PhotosPage from "./pages/photos-page";
import ProfileUserPage from "./pages/profile-user-page";
import ProfileAdminPage from "./pages/profile-admin-page";

import LoginPage from "./pages/login-page";
import SignUpPage from "./pages/sign-up-page";
import NotFoundPage from "./pages/not-found-page";
import ChangePasswordPage from "./pages/change-password-page";

import CalendarPage from "./pages/calendar-page";

function App() {
  return (
    <div className="bg-zinc-100 sm:flex flex-col min-h-screen h-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/profile-user" element={<ProfileUserPage />} />
          <Route path="/profile-admin" element={<ProfileAdminPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="*" element={<NotFoundPage />} />
          {/* <Route path="/contact" element={<ContactPage />} /> */}
          {/* <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
