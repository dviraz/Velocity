import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Rocket, Gauge, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Rocket className="w-10 h-10 text-primary" />,
    title: "Slash Load Times",
    description: "We slash load times by up to 80%, boosting your user experience and Core Web Vitals for better SEO.",
  },
  {
    icon: <Gauge className="w-10 h-10 text-primary" />,
    title: "AI-Powered Audits",
    description: "Our AI-powered audits dig deep to find every performance bottleneck, from unoptimized images to code-level issues.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Lasting Results",
    description: "Get lasting results with stable, best-practice optimizations that won't break your site with the next update.",
  },
];

const ServiceHighlights = () => {
  return (
    <section id="features" className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            A Faster Website is a Better Business
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            We don't just make sites faster, we make them more effective. Our approach focuses on three core areas to dramatically improve your bottom line.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardHeader className="p-8">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-xl font-bold">{feature.title}</CardTitle>
                <CardDescription className="pt-2 text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
