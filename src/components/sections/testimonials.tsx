'use client';

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah L.",
    title: "CEO, TechBloom",
    quote: "Get Speed transformed our user experience. Our bounce rate dropped by 30% almost overnight!",
    avatar: "SL",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
    metric: "70% Load Time Reduction",
    dataAiHint: "woman portrait"
  },
  {
    name: "Mike Chen",
    title: "Founder, DailyGrind",
    quote: "The speed increase was incredible. Our mobile conversion rates have doubled since we worked with Get Speed.",
    avatar: "MC",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
    metric: "2x Mobile Conversions",
    dataAiHint: "man portrait"
  },
  {
    name: "Isabella Rossi",
    title: "Marketing Director, Moda",
    quote: "I was skeptical at first, but the results speak for themselves. Our site is faster than ever and our customers have noticed.",
    avatar: "IR",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
    metric: "98/100 Performance Score",
    dataAiHint: "woman smiling"
  },
   {
    name: "David Kim",
    title: "CTO, QuantumLeap",
    quote: "The team's technical expertise is top-notch. They identified and fixed complex issues our previous developers missed.",
    avatar: "DK",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
    metric: "50+ Core Web Vitals",
    dataAiHint: "man smiling"
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            Loved by Fast-Growing Companies
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about their new-found speed.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col justify-between shadow-lg bg-card rounded-xl">
                    <CardContent className="p-6 flex flex-col items-start gap-4">
                      <div className="bg-accent text-accent-foreground font-bold py-1.5 px-4 rounded-full text-sm">
                        {testimonial.metric}
                      </div>
                      <p className="text-base text-foreground/90 italic flex-1">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="flex items-center gap-4 pt-4">
                        <Avatar className="w-12 h-12 border-2 border-primary/50">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-foreground text-base">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden xl:flex -left-12" />
          <CarouselNext className="hidden xl:flex -right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
