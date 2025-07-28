import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const faqs = [
  {
    question: "How long does the optimization process take?",
    answer:
      "Most optimizations are completed within 5-7 business days. After our initial analysis, we'll provide a more precise timeline based on the complexity of the issues found on your site.",
  },
  {
    question: "Will this work with my website platform (e.g., WordPress, Shopify)?",
    answer:
      "Absolutely. Our optimization techniques are platform-agnostic. We work with everything from custom-coded sites to popular CMS and e-commerce platforms like WordPress, Shopify, Webflow, and more.",
  },
  {
    question: "Do you offer ongoing support or is this a one-time service?",
    answer:
      "We offer both! Most clients start with a one-time optimization package to get immediate results. We also offer monthly retainers for ongoing performance monitoring and optimization to ensure your site stays fast as you add new content and features.",
  },
  {
    question: "What kind of results can I realistically expect?",
    answer:
      "While results vary, our clients typically see a 50-80% reduction in load times, a significant boost in their Google PageSpeed Insights score (often 90+ on mobile), and improved Core Web Vitals, which can positively impact SEO rankings.",
  },
  {
    question: "Is there any risk of the optimizations breaking my site?",
    answer:
      "We take every precaution to ensure a smooth process. We work in a staging environment and perform rigorous testing before deploying any changes to your live site. We also take a full backup before we begin, so we can revert at any time.",
  },
];

const Faq = () => {
  return (
    <section id="faq" className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground mt-4">
            Have questions? We have answers. Here are some common things our clients ask.
          </p>
        </div>
        <Card className="shadow-2xl rounded-xl">
            <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left font-bold text-lg hover:no-underline">
                        {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground pt-2">
                        {faq.answer}
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Faq;
