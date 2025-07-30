import InfiniteLogoScroller from './infinite-logo-scroller';

const TrustedBy = () => {
  return (
    <section className="bg-card py-12">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-6">
          Trusted by innovative brands worldwide
        </h3>
        <InfiniteLogoScroller
          speed={30}
          pauseOnHover={true}
          logoHeight="h-20"
          gap="gap-x-12"
          maskGradient={true}
          direction="left"
          grayscale={true}
        />
      </div>
    </section>
  );
};

export default TrustedBy;
