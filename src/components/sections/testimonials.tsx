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
    quote: "VelocityLab transformed our user experience. Our bounce rate dropped by 30% almost overnight!",
    avatar: "SL",
    image: "https://placehold.co/100x100.png",
    metric: "70% Load Time Reduction",
    dataAiHint: "woman portrait"
  },
  {
    name: "Mike Chen",
    title: "Founder, DailyGrind",
    quote: "The speed increase was incredible. Our mobile conversion rates have doubled since we worked with VelocityLab.",
    avatar: "MC",
    image: "https://placehold.co/100x100.png",
    metric: "2x Mobile Conversions",
    dataAiHint: "man portrait"
  },
  {
    name: "Isabella Rossi",
    title: "Marketing Director, Moda",
    quote: "I was skeptical at first, but the results speak for themselves. Our site is faster than ever and our customers have noticed.",
    avatar: "IR",
    image: "https://placehold.co/100x100.png",
    metric: "98/100 Performance Score",
    dataAiHint: "woman smiling"
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
            Don't just take our word for it. Here's what our clients have to say.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col justify-between shadow-lg bg-card">
                    <CardContent className="p-6 flex flex-col items-start gap-4">
                      <div className="bg-accent text-accent-foreground font-bold py-1 px-3 rounded-full text-sm">
                        {testimonial.metric}
                      </div>
                      <p className="text-base text-foreground/80 italic">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="flex items-center gap-4 pt-4">
                        <Avatar>
                          <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
