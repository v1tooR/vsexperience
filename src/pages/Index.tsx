import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Positioning from "@/components/landing/Positioning";
import Services from "@/components/landing/Services";
import Differentials from "@/components/landing/Differentials";
import Process from "@/components/landing/Process";
import Cases from "@/components/landing/Cases";
import Testimonials from "@/components/landing/Testimonials";
import About from "@/components/landing/About";
import BlogCTA from "@/components/landing/BlogCTA";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Positioning />
        <Services />
        <Differentials />
        <Process />
        <Cases />
        <Testimonials />
        <About />
        <BlogCTA />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
