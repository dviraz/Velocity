import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import InfiniteLogoScroller from '@/components/sections/infinite-logo-scroller';
import TrustedBy from '@/components/sections/trusted-by';
import BeforeAfter from '@/components/sections/before-after';
import ServiceHighlights from '@/components/sections/service-highlights';
import Testimonials from '@/components/sections/testimonials';
import ContactFormSection from '@/components/sections/contact-form-section';
import HowItWorks from '@/components/sections/how-it-works';
import Faq from '@/components/sections/faq';
import Pricing from '@/components/sections/pricing';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <BeforeAfter />
        <HowItWorks />
        <ServiceHighlights />
        <Pricing />
        <Testimonials />
        <Faq />
        <ContactFormSection />
      </main>
      <Footer />
    </div>
  );
}
