const Footer = () => {
  return (
    <footer className="py-6 px-4 md:px-6 bg-muted/50">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} VelocityLab. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
