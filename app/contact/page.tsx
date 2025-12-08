"use client";

import { GridWrapper } from "../components/GridWrapper";
import { AnimatedText } from "../components/AnimatedText";
import { MainSiteLayout } from "../components/MainSiteLayout";
import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const HEADING_DELAY = 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;

  // Load Cloudflare Turnstile script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Turnstile after script loads
      if (turnstileRef.current && typeof window !== "undefined" && (window as any).turnstile) {
        const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
        if (siteKey) {
          const widgetId = (window as any).turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            theme: "light",
            callback: (token: string) => {
              setTurnstileToken(token);
            },
            "error-callback": () => {
              setTurnstileToken(null);
            },
            "expired-callback": () => {
              setTurnstileToken(null);
            },
          });
          turnstileWidgetIdRef.current = widgetId;
        }
      }
    };

    return () => {
      // Cleanup: remove script and reset turnstile
      if (turnstileWidgetIdRef.current && typeof window !== "undefined" && (window as any).turnstile) {
        (window as any).turnstile.remove(turnstileWidgetIdRef.current);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate Turnstile token
    if (!turnstileToken) {
      toast.error("Please complete the verification");
      setIsSubmitting(false);
      return;
    }

    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (!accessKey) {
        throw new Error("Web3Forms access key not configured");
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitting(false);
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTurnstileToken(null);

        // Reset Turnstile widget
        if (turnstileWidgetIdRef.current && typeof window !== "undefined" && (window as any).turnstile) {
          (window as any).turnstile.reset(turnstileWidgetIdRef.current);
        }
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again later.";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <MainSiteLayout>
      <Toaster position="top-center" />
      <section className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16">
          <div
            className="absolute inset-0 opacity-[0.03] -z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23007cff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="relative text-balance">
            <AnimatedText
              as="h1"
              delay={HEADING_DELAY}
              className="mx-auto max-w-2xl text-center text-6xl font-bold leading-tight tracking-tighter text-[#084750] md:text-8xl md:leading-[78px]"
            >
              Get in Touch
            </AnimatedText>
            <div className="mt-4 text-center md:mt-8">
              <AnimatedText
                as="p"
                delay={PARAGRAPH_DELAY}
                className="leading-8 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
              >
                Have questions? Want to sponsor? Interested in volunteering? We&apos;d love to hear from you!
              </AnimatedText>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="relative space-y-10 md:space-y-16">
          <GridWrapper>
            <div className="space-y-6 py-8 md:py-12">
              <h2 className="text-[#084750] ml-4 text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
                Send us a Message
              </h2>
              <div className="px-4">
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                        placeholder="ramshyam@gmail.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-text-primary">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="sponsorship">Sponsorship</option>
                      <option value="volunteer">Volunteering</option>
                      <option value="media">Media & Press</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-text-primary">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  {/* Turnstile Verification */}
                  <div className="space-y-4 p-4 bg-blue-50/50 rounded-square border border-blue-200">
                    <div className="flex justify-center pt-2">
                      <div ref={turnstileRef} id="cf-turnstile"></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-[#084750] text-white font-semibold rounded-square hover:bg-[#084750]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </GridWrapper>
        </section>

        {/* Contact Information Section */}
        <section className="relative space-y-10 md:space-y-16">
          <GridWrapper className="before:hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative mx-auto max-w-5xl px-4 md:px-8 py-8 md:py-12">
              <div className="space-y-4 text-center md:text-left">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-lg font-semibold text-text-primary">Email</h3>
                <p className="text-text-secondary">
                  <a href="mailto:hack@godawari.edu.np" className="text-[#084750] hover:text-[#084750]/80 underline">
                    hack@godawari.edu.np
                  </a>
                </p>
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-lg font-semibold text-text-primary">Location</h3>
                <p className="text-text-secondary">
                  Sushma Godawari College, Hall<br />
                  Itahari-6, Sunsari, Nepal
                </p>
              </div>
              {/* <div className="space-y-4 text-center md:text-left">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-lg font-semibold text-text-primary">Social Media</h3>
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-[#084750] hover:text-[#084750]/80 underline text-text-secondary">
                  Twitter / X
                </a>
                <a href="#" className="text-[#084750] hover:text-[#084750]/80 underline text-text-secondary">
                  LinkedIn
                </a>
                <a href="#" className="text-[#084750] hover:text-[#084750]/80 underline text-text-secondary">
                  GitHub
                </a>
              </div>
            </div> */}
            </div>
          </GridWrapper>
        </section>

        {/* FAQ Section */}
        <section className="relative space-y-10 md:space-y-16">
          <GridWrapper>
            <div className="space-y-6 py-8 md:py-12">
              <h2 className="text-[#084750] ml-4 text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6 px-4 max-w-4xl">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-text-primary">Is the hackathon free to attend?</h3>
                  <p className="text-text-secondary leading-relaxed">
                    NO! Godawari Hack is not free to attend. There is a nominal registration fee of NRs. 2500 per Team to cover event costs and provide meals and swag.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-text-primary">Do I need to be an experienced developer?</h3>
                  <p className="text-text-secondary leading-relaxed">
                    Not at all! We welcome developers of all skill levels. Whether you&apos;re a beginner or an expert, you&apos;ll find value in participating.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-text-primary">Can I participate as an individual?</h3>
                  <p className="text-text-secondary leading-relaxed">
                    While we encourage team participation, individual participants are welcome. You can also form teams at the event during the team formation session.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-text-primary">What should I bring?</h3>
                  <p className="text-text-secondary leading-relaxed">
                    Bring your laptop, charger, and enthusiasm! We&apos;ll provide food, drinks, and a great environment for coding.
                  </p>
                </div>
              </div>
            </div>
          </GridWrapper>
        </section>
      </section>
    </MainSiteLayout>
  );
}

