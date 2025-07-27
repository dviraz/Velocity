import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import ServiceHighlights from '@/components/sections/service-highlights';
import Testimonials from '@/components/sections/testimonials';
import ContactFormSection from '@/components/sections/contact-form-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServiceHighlights />
        <Testimonials />
        <ContactFormSection />
      </main>
      <Footer />
    </div>
  );
}
