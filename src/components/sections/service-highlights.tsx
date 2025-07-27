import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Rocket, Gauge, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Rocket className="w-10 h-10 text-primary" />,
    title: "Blazing Fast Delivery",
    description: "Our optimizations ensure your website loads at lightning speed, improving user experience and SEO rankings.",
  },
  {
    icon: <Gauge className="w-10 h-10 text-primary" />,
    title: "In-Depth Performance Audits",
    description: "We provide comprehensive audits to identify bottlenecks and areas for improvement you never knew existed.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Reliable Optimization",
    description: "Our robust optimization techniques are stable, reliable, and designed to keep your site running smoothly.",
  },
];

const ServiceHighlights = () => {
  return (
    <section id="features" className="py-20 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            A Faster Website is a Better Website
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            We focus on three core areas to dramatically improve your site's performance and reliability.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-xl font-bold">{feature.title}</CardTitle>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
