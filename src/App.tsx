import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";
import Index from "./pages/Index";
import PropertyDetails from "./pages/PropertyDetails";
import Search from "./pages/Search";
import Filters from "./pages/Filters";
import AddProperty from "./pages/AddProperty";
import MyProperties from "./pages/MyProperties";
import EditProperty from "./pages/EditProperty";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import EditAccount from "./pages/EditAccount";
import Wallet from "./pages/Wallet";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import ChatList from "./pages/ChatList";
import ChatRoom from "./pages/ChatRoom";
import BookVisit from "./pages/BookVisit";
import Bookings from "./pages/Bookings";
import Notifications from "./pages/Notifications";
import PropertyAlert from "./pages/PropertyAlert";
import ProSubscription from "./pages/ProSubscription";
import SponsoredAd from "./pages/SponsoredAd";
import RecentlyViewed from "./pages/RecentlyViewed";
import Companies from "./pages/Companies";
import Compare from "./pages/Compare";
import MapPage from "./pages/MapPage";
import Rewards from "./pages/Rewards";
import MyReviews from "./pages/MyReviews";
import Invite from "./pages/Invite";
import Language from "./pages/Language";
import Appearance from "./pages/Appearance";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";
import AllReviews from "./pages/AllReviews";
import NotFound from "./pages/NotFound";

import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminAds from "./pages/admin/AdminAds";
import AdminPro from "./pages/admin/AdminPro";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminVerifications from "./pages/admin/AdminVerifications";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminContent from "./pages/admin/AdminContent";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" dir="rtl" />
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OtpVerify />} />

          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/filters" element={<Filters />} />
          <Route path="/property/:id" element={<PropertyDetails />} />

          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/edit-property/:id" element={<EditProperty />} />

          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recently-viewed" element={<RecentlyViewed />} />

          <Route path="/account" element={<Account />} />
          <Route path="/edit-account" element={<EditAccount />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />

          <Route path="/chats" element={<ChatList />} />
          <Route path="/chat/:id" element={<ChatRoom />} />
          <Route path="/book-visit/:id?" element={<BookVisit />} />
          <Route path="/bookings" element={<Bookings />} />

          <Route path="/notifications" element={<Notifications />} />
          <Route path="/property-alert" element={<PropertyAlert />} />
          <Route path="/pro" element={<ProSubscription />} />
          <Route path="/sponsored" element={<SponsoredAd />} />

          {/* Extra app pages */}
          <Route path="/companies" element={<Companies />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/language" element={<Language />} />
          <Route path="/appearance" element={<Appearance />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/user/:id/reviews" element={<AllReviews />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="ads" element={<AdminAds />} />
            <Route path="pro" element={<AdminPro />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="verifications" element={<AdminVerifications />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
