import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { SessionProvider } from "./context/SessionContext";
import CartDrawer from "./components/CartDrawer";
import AuthModal from "./components/membership/AuthModal";
import MemberDashboard from "./components/membership/MemberDashboard";
import SessionPlayer from "./components/sessions/SessionPlayer";
import SessionMiniBar from "./components/sessions/SessionMiniBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Gateway from "./components/Gateway";
import Categories from "./components/Categories";
import HowItWorks from "./components/HowItWorks";
import Research from "./components/Research";
import AudioLibrary from "./components/AudioLibrary";
import SessionsSection from "./components/sessions/SessionsSection";
import ProductPage from "./components/ProductPage";
import ProductPageCelestial from "./components/ProductPageCelestial";
import AllProducts from "./components/AllProducts";
import ProductPageTemplate from "./components/ProductPageTemplate";
import PricingSection from "./components/membership/PricingSection";
import { bonusProduct } from "./data/products";
import AppPromo from "./components/AppPromo";
import Testimonials from "./components/Testimonials";
import Community from "./components/Community";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SessionProvider>
          <div className="min-h-screen bg-cosmic-900">
            <Header />
            <main>
              <Hero />
              <Stats />
              <Gateway />
              <Categories />
              <HowItWorks />
              <Research />
              <AudioLibrary />
              <SessionsSection />
              <ProductPage />
              <ProductPageCelestial />
              <AllProducts />
              <ProductPageTemplate product={bonusProduct} altBg={true} />
              <PricingSection />
              <AppPromo />
              <Testimonials />
              <Community />
              <FAQ />
              <FinalCTA />
            </main>
            <Footer />
            <CartDrawer />
            <AuthModal />
            <MemberDashboard />
            <SessionPlayer />
            <SessionMiniBar />
          </div>
        </SessionProvider>
      </CartProvider>
    </AuthProvider>
  );
}
