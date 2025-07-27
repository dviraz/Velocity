import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const Header = () => {
  return (
    <header className="py-4 px-4 md:px-6 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">
            VelocityLab
          </span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
            Testimonials
          </Link>
          <Button asChild>
             <Link href="#contact">Talk to an Expert</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
