"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CustomDesign from "./pages/CustomDesign";
import Mockup from "./pages/Mockup";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FAQ from "./pages/FAQ";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ReturnsPage from "./pages/ReturnsPage";
import { useAuth } from "./context/AuthContext";
import { useAnalytics } from "./context/AnalyticsContext";

export default function AppRouter() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { track } = useAnalytics();

  useEffect(() => {
    track("page_view", { path: pathname });
  }, [pathname, track]);

  if (!loading) {
    if ((pathname === "/login" || pathname === "/signup") && user) {
      window.location.replace("/");
      return null;
    }
    if (pathname.startsWith("/admin") && (!user || user.role !== "admin")) {
      window.location.replace("/");
      return null;
    }
  }

  if (pathname === "/shop") {
    return <Shop />;
  }

  if (pathname.startsWith("/shop/")) {
    return <ProductDetail />;
  }

  if (pathname === "/collections") {
    return <Collections />;
  }

  if (pathname.startsWith("/collections/")) {
    return <CollectionDetail />;
  }

  if (pathname === "/about") {
    return <About />;
  }

  if (pathname === "/contact") {
    return <Contact />;
  }

  if (pathname === "/custom") {
    return <CustomDesign />;
  }

  if (pathname === "/mockup") {
    return <Mockup />;
  }

  if (pathname === "/login") {
    return <Login />;
  }

  if (pathname === "/signup") {
    return <Signup />;
  }

  if (pathname === "/services") {
    return <Services />;
  }

  if (pathname === "/cart") {
    return <Cart />;
  }

  if (pathname === "/checkout") {
    return <Checkout />;
  }

  if (pathname === "/faq") {
    return <FAQ />;
  }

  if (pathname === "/account/orders") {
    return <OrdersPage />;
  }

  if (pathname === "/account/profile") {
    return <ProfilePage />;
  }

  if (pathname === "/admin") {
    return <AdminDashboard />;
  }

  if (pathname === "/admin/products") {
    return <AdminProducts />;
  }

  if (pathname === "/admin/products/new") {
    return <AdminProductForm />;
  }

  if (pathname.startsWith("/admin/products/") && pathname.endsWith("/edit")) {
    return <AdminProductForm />;
  }

  if (pathname === "/admin/orders") {
    return <AdminOrders />;
  }

  if (pathname === "/admin/users") {
    return <AdminUsers />;
  }

  if (pathname === "/admin/analytics") {
    return <AdminAnalytics />;
  }

  if (pathname === "/terms") {
    return <TermsPage />;
  }

  if (pathname === "/privacy") {
    return <PrivacyPage />;
  }

  if (pathname === "/returns") {
    return <ReturnsPage />;
  }

  return <Home />;
}
