const TrustedBy = () => {
  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-6">
          Trusted by innovative brands worldwide
        </h3>
        <div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-4 md:gap-x-12">
          <img 
            src="https://placehold.co/120x40/374151/E5E7EB?text=BrandA" 
            alt="Client Logo" 
            className="logo-grayscale h-8"
          />
          <img 
            src="https://placehold.co/120x40/374151/E5E7EB?text=StartupX" 
            alt="Client Logo" 
            className="logo-grayscale h-8"
          />
          <img 
            src="https://placehold.co/120x40/374151/E5E7EB?text=InnovateCo" 
            alt="Client Logo" 
            className="logo-grayscale h-8"
          />
          <img 
            src="https://placehold.co/120x40/374151/E5E7EB?text=Future Inc" 
            alt="Client Logo" 
            className="logo-grayscale h-8"
          />
          <img 
            src="https://placehold.co/120x40/374151/E5E7EB?text=E-Corp" 
            alt="Client Logo" 
            className="logo-grayscale h-8"
          />
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
