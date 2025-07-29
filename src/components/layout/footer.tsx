const Footer = () => {
  return (
    <footer className="py-8 px-4 md:px-6 bg-foreground text-background">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Get Speed. All rights reserved.</p>
        <p className="opacity-70 mt-2">A high-performance web experience, built for conversion.</p>
      </div>
    </footer>
  );
};

export default Footer;
