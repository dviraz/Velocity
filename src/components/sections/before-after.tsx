import Image from 'next/image';

const BeforeAfter = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            From Slow & Clunky to Fast & Sleek
          </h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Our optimizations don't just make your site faster—they transform the user experience.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <Image
            src="/before-after.png"
            alt="Before and after website optimization"
            width={1200}
            height={675}
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;