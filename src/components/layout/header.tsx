import { Rocket } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="py-4 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">
            VelocityLab
          </span>
        </Link>
        <nav className="hidden md:flex gap-4">
          {/* Future navigation links can go here */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
