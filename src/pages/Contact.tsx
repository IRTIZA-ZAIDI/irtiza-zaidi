import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });

    setIsSubmitting(false);

    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-black selection:text-white">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          {/* Header */}
          <div className="mb-24 text-left">
            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-8 italic">
              Contact
            </h1>
            <div className="border-t border-secondary/30 w-12 mb-8"></div>
            <p className="text-xl md:text-2xl font-serif text-secondary max-w-2xl leading-relaxed">
              Always open to discussions on AI interpretability, LLM fine-tuning, and impactful ML solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Contact Form */}
            <div>
              <h2 className="font-mono text-sm uppercase tracking-widest text-foreground mb-8">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-secondary">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-none border-x-0 border-t-0 border-b border-foreground/20 focus:border-foreground bg-transparent px-0 py-2 focus:ring-0 shadow-none transition-colors placeholder:text-muted-foreground/50"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-secondary">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-none border-x-0 border-t-0 border-b border-foreground/20 focus:border-foreground bg-transparent px-0 py-2 focus:ring-0 shadow-none transition-colors placeholder:text-muted-foreground/50"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-mono text-xs uppercase tracking-wider text-secondary">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="w-full rounded-none border-x-0 border-t-0 border-b border-foreground/20 focus:border-foreground bg-transparent px-0 py-2 focus:ring-0 shadow-none transition-colors placeholder:text-muted-foreground/50"
                    placeholder="What would you like to discuss?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="font-mono text-xs uppercase tracking-wider text-secondary">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full rounded-none border border-foreground/20 focus:border-foreground bg-transparent p-4 focus:ring-0 shadow-none resize-none transition-colors placeholder:text-muted-foreground/50"
                    placeholder="Tell me about your project, question, or just say hello..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono uppercase tracking-widest h-12"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="font-mono text-sm uppercase tracking-widest text-foreground mb-8">
                  Connect
                </h2>

                <div className="space-y-8">
                  {/* Email */}
                  <div className="group">
                    <h3 className="font-serif text-xl text-foreground mb-1 group-hover:italic transition-all">Email</h3>
                    <a
                      href="mailto:zirtiza110@gmail.com"
                      className="text-secondary hover:text-foreground font-mono text-sm transition-colors"
                    >
                      zirtiza110@gmail.com
                    </a>
                  </div>

                  {/* LinkedIn */}
                  <div className="group">
                    <h3 className="font-serif text-xl text-foreground mb-1 group-hover:italic transition-all">LinkedIn</h3>
                    <a
                      href="https://www.linkedin.com/in/zirtiza/"
                      className="text-secondary hover:text-foreground font-mono text-sm transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @zirtiza
                    </a>
                  </div>

                  {/* GitHub */}
                  <div className="group">
                    <h3 className="font-serif text-xl text-foreground mb-1 group-hover:italic transition-all">GitHub</h3>
                    <a
                      href="https://github.com/IRTIZA-ZAIDI"
                      className="text-secondary hover:text-foreground font-mono text-sm transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @IRTIZA-ZAIDI
                    </a>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="pt-8 border-t border-foreground/10">
                <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Response Time</h3>
                <p className="font-serif text-lg text-foreground/80 leading-relaxed">
                  I typically respond to emails within 24-48 hours. For urgent matters, please mention that in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;