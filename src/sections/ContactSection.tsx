import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useLayoutEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS) return;

    const heading = headingRef.current;
    const form = formRef.current;
    const image = imageRef.current;
    const footer = footerRef.current;
    if (!heading || !form || !image || !footer) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        heading,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Form reveal
      gsap.fromTo(
        form,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: form,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image parallax
      gsap.fromTo(
        image,
        { y: -12 },
        {
          y: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      );

      // Footer reveal
      gsap.fromTo(
        footer,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="section-flowing bg-luxury-black z-[90] py-24 lg:py-32"
        id="contact"
      >
        <div className="px-6 lg:px-[8vw]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left: Form */}
            <div className="w-full lg:w-1/2">
              {/* Heading */}
              <div ref={headingRef} className="mb-10 will-change-transform">
                <h2 className="headline-lg text-luxury-ivory mb-4">
                  READY TO{' '}
                  <span className="text-gold">DELEGATE THE BUSYWORK?</span>
                </h2>
                <p className="body-text text-luxury-ivory/70">
                  Tell us what you're solving. We'll reply within one business
                  day with next steps.
                </p>
              </div>

              {/* Form */}
              <div ref={formRef} className="will-change-transform">
                {submitted ? (
                  <div className="bg-luxury-charcoal/50 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={28} className="text-gold" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-luxury-ivory mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-luxury-ivory/60">
                      We'll get back to you within one business day.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-luxury-ivory/80">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-luxury-charcoal/50 border-border/30 text-luxury-ivory placeholder:text-luxury-ivory/40 focus:border-gold focus:ring-gold/20"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-luxury-ivory/80">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-luxury-charcoal/50 border-border/30 text-luxury-ivory placeholder:text-luxury-ivory/40 focus:border-gold focus:ring-gold/20"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-luxury-ivory/80">
                        Company
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="bg-luxury-charcoal/50 border-border/30 text-luxury-ivory placeholder:text-luxury-ivory/40 focus:border-gold focus:ring-gold/20"
                        placeholder="Your Company"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-luxury-ivory/80">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="bg-luxury-charcoal/50 border-border/30 text-luxury-ivory placeholder:text-luxury-ivory/40 focus:border-gold focus:ring-gold/20 resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}

                {/* Contact Info */}
                <div className="mt-12 pt-8 border-t border-border/20 space-y-4">
                  <div className="flex items-center gap-3 text-luxury-ivory/70">
                    <Mail size={18} className="text-gold" />
                    <span className="text-sm">info@goldenspark.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-luxury-ivory/70">
                    <MapPin size={18} className="text-gold" />
                    <span className="text-sm">
                      Based in Kingdom of Bahrain • Working with teams worldwide
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="hidden lg:block w-1/2">
              <div ref={imageRef} className="will-change-transform h-full">
                <img
                  src="/images/contact-portrait.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="bg-luxury-black border-t border-border/20 py-12 z-[90]"
      >
        <div className="px-6 lg:px-[8vw]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="font-heading font-black text-xl tracking-tight text-luxury-ivory">
              GOLDEN <span className="text-gold">SPARK</span>
            </div>

            {/* Nav Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
              <button
                onClick={() => scrollToSection('#services')}
                className="text-sm text-luxury-ivory/60 hover:text-gold transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('#industries')}
                className="text-sm text-luxury-ivory/60 hover:text-gold transition-colors"
              >
                Industries
              </button>
              <button
                onClick={() => scrollToSection('#clients')}
                className="text-sm text-luxury-ivory/60 hover:text-gold transition-colors"
              >
                Clients
              </button>
              <button
                onClick={() => scrollToSection('#process')}
                className="text-sm text-luxury-ivory/60 hover:text-gold transition-colors"
              >
                Process
              </button>
              <button
                onClick={() => scrollToSection('#contact')}
                className="text-sm text-luxury-ivory/60 hover:text-gold transition-colors"
              >
                Contact
              </button>
            </div>

            {/* Legal */}
            <div className="flex items-center gap-6 text-sm text-luxury-ivory/40">
              <button className="hover:text-luxury-ivory/60 transition-colors">
                Privacy
              </button>
              <button className="hover:text-luxury-ivory/60 transition-colors">
                Terms
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-8 border-t border-border/10 text-center">
            <p className="text-xs text-luxury-ivory/40">
              © {new Date().getFullYear()} Golden Spark. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactSection;
