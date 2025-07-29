import { ScanLine, Wrench, BarChart } from "lucide-react";

const steps = [
  {
    icon: <ScanLine className="w-10 h-10 text-primary" />,
    title: "1. Free AI Analysis",
    description: "Submit your website URL and our AI, Get Speed AI, performs a deep analysis, identifying key performance bottlenecks.",
  },
  {
    icon: <Wrench className="w-10 h-10 text-primary" />,
    title: "2. Expert Optimization",
    description: "Our team of performance engineers implements targeted optimizations to fix the issues uncovered in the analysis.",
  },
  {
    icon: <BarChart className="w-10 h-10 text-primary" />,
    title: "3. See the Results",
    description: "We provide a follow-up report showing the dramatic improvements in speed, user experience, and SEO scores.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            A Simple Path to Blazing Speed
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our process is transparent, straightforward, and designed for maximum impact with minimal effort from your side.
          </p>
        </div>
        <div className="relative">
            <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-border -translate-x-1/2 hidden md:block" aria-hidden="true" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
                <div key={index} className="text-center">
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4 border-8 border-background relative z-10">
                        {step.icon}
                    </div>
                    <h3 className="font-headline text-xl font-bold">{step.title}</h3>
                    <p className="pt-2 text-muted-foreground">{step.description}</p>
                </div>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
