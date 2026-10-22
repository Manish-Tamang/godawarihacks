"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GridPageLayout } from "../components/GridPageLayout";
import { FeedbackButton } from "../components/FeedbackButton";
import { GridSection } from "../components/ui/grid-section";
import { PageHero } from "../components/ui/page-hero";
import { SplitHeading } from "../components/ui/split-heading";
import { FeatureGrid, FeatureItem } from "../components/ui/feature-grid";
import { Field, FormPanel, inputClassName } from "../components/ui/form";
import { buttonClassName } from "../components/ui/button";
import {
  ChevronRightIcon,
  MailIcon,
  MapPinIcon,
} from "../components/icons/ui-icons";
import { FacebookIcon } from "../components/icons/social-icons";
import { useTurnstile } from "../lib/use-turnstile";

const CONTACT_EMAIL = "hack@godawari.edu.np";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

const FAQS = [
  {
    question: "Is the hackathon free to attend?",
    answer:
      "NO! Godawari Hacks is not free to attend. There is a nominal registration fee of NRs. 2500 per Team to cover event costs and provide meals and swag.",
  },
  {
    question: "Do I need to be an experienced developer?",
    answer:
      "Not at all! We welcome developers of all skill levels. Whether you're a beginner or an expert, you'll find value in participating.",
  },
  {
    question: "Can I participate as an individual?",
    answer:
      "While we encourage team participation, individual participants are welcome. You can also form teams at the event during the team formation session.",
  },
  {
    question: "What should I bring?",
    answer:
      "Bring your laptop, charger, and enthusiasm! We'll provide food, drinks, and a great environment for coding.",
  },
  {
    question: "What about food and accommodation?",
    answer: (
      <>
        Food, snacks, and sleeping management is on us! We&apos;ll provide
        delicious meals, refreshments, and a comfortable space for rest
        throughout the hackathon. Both{" "}
        <span className="underline decoration-neutral-400 decoration-wavy">
          vegetarian
        </span>{" "}
        and{" "}
        <span className="underline decoration-neutral-400 decoration-wavy">
          non-vegetarian
        </span>{" "}
        options will be available for all participants, so don&apos;t worry
        about your dietary preferences. Just focus on building your amazing
        projects!
      </>
    ),
  },
  {
    question: "Have more questions?",
    answer: (
      <>
        Feel free to ask any inquiry! Contact us at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
        >
          {CONTACT_EMAIL}
        </a>
        . We&apos;re here to help!
      </>
    ),
  },
];

const LINK =
  "font-medium text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand";

export default function ContactPage() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    containerRef: turnstileRef,
    token: turnstileToken,
    reset: resetTurnstile,
  } = useTurnstile();

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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, turnstileToken: turnstileToken }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitting(false);
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData(EMPTY_FORM);
        resetTurnstile();
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later.";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <GridPageLayout>
      <Toaster position="top-center" />
      <FeedbackButton />

      <PageHero
        align="center"
        icon={<MailIcon className="size-10" strokeWidth={1} />}
        title="Get in Touch"
        description={
          <p>
            Have questions? Want to sponsor? Interested in volunteering?
            We&apos;d love to hear from you!
          </p>
        }
      />

      <FormPanel>
        <h2 className="font-display text-xl font-medium text-neutral-900">
          Send us a Message
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Name *" htmlFor="name">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email *" htmlFor="email">
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClassName}
                placeholder="ramshyam@gmail.com"
              />
            </Field>
          </div>
          <Field label="Subject *" htmlFor="subject">
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className={inputClassName}
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="sponsorship">Sponsorship</option>
              <option value="volunteer">Volunteering</option>
              <option value="media">Media & Press</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Message *" htmlFor="message">
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className={`${inputClassName} resize-none`}
              placeholder="Tell us what's on your mind..."
            />
          </Field>

          {/* Turnstile verification */}
          <div ref={turnstileRef} id="cf-turnstile" />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${buttonClassName()} disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:hover:ring-0`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </FormPanel>

      <GridSection innerClassName="px-5 py-12 sm:py-16">
        <FeatureGrid className="mx-auto max-w-[800px]">
          <FeatureItem icon={<MailIcon className="size-4" />} title="Email">
            <p>
              <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </FeatureItem>
          <FeatureItem
            icon={<MapPinIcon className="size-4" />}
            title="Location"
          >
            <p>Sushma Godawari College, Hall</p>
            <p>Itahari-6, Sunsari, Nepal</p>
          </FeatureItem>
          <FeatureItem
            icon={<FacebookIcon className="size-4" />}
            title="Facebook page"
          >
            <p>
              <a
                href="https://www.facebook.com/profile.php?id=61586598928514"
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                @Godawari Hacks
              </a>
            </p>
            <p>Follow for updates</p>
          </FeatureItem>
        </FeatureGrid>
      </GridSection>

      <GridSection innerClassName="pt-10 sm:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-3 px-5">
          <h2 className="font-display text-3xl font-medium text-neutral-900 sm:text-4xl">
            Find us
          </h2>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=26.654076,87.274864"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-0.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Get directions
            <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
        <div className="mt-8 border-t border-grid-border bg-neutral-50 p-4 sm:p-8">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
            <iframe
              title="Sushma Godawari College on Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.825291823272!2d87.27486387599244!3d26.654075676802282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6c6ffd419ad7%3A0x3c19a0cb1869a764!2z4aSb4aSj4aSY4aSg4aSW4aSlIFN1c21hIEtvaXJhbGEgTWVtb3JpYWwgQ29sbGVnZQ!5e0!3m2!1sen!2snp!4v1792324739928!5m2!1sen!2snp"
              className="block h-[320px] w-full rounded-xl md:h-[420px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </GridSection>

      <GridSection innerClassName="px-5 py-16">
        <SplitHeading title="Frequently Asked Questions">
          <dl className="divide-y divide-grid-border border-y border-grid-border text-base">
            {FAQS.map(({ question, answer }) => (
              <div key={question} className="py-5">
                <dt className="font-medium text-neutral-900">{question}</dt>
                <dd className="mt-2 leading-relaxed text-neutral-500">
                  {answer}
                </dd>
              </div>
            ))}
          </dl>
        </SplitHeading>
      </GridSection>
    </GridPageLayout>
  );
}
