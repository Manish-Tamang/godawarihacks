"use client";

import { BgGradient } from "../../components/BgGradient";
import { GridWrapper } from "../../components/GridWrapper";
import { AnimatedText } from "../../components/AnimatedText";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const HEADING_DELAY = 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show detailed error message if available
        const errorMsg = data.error || "Invalid credentials. Please try again.";
        const details = data.details ? `\n\nDetails: ${data.details}` : "";
        setError(errorMsg + details);
        return;
      }

      // Redirect to admin dashboard on success
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0 min-h-screen flex flex-col">
      <section className="relative py-12 md:py-16 -mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/30 to-transparent -z-10"></div>
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
            Admin Panel
          </AnimatedText>
          <div className="mt-4 text-center md:mt-8">
            <AnimatedText
              as="p"
              delay={PARAGRAPH_DELAY}
              className="leading-8 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
            >
              Sign in to access the Hack Sushma admin dashboard
            </AnimatedText>
          </div>
        </div>
      </section>
      <section className="relative space-y-10 md:space-y-16 flex-1">
        <GridWrapper>
          <div className="flex items-center justify-center py-8 md:py-12 min-h-[400px]">
            <div className="w-full max-w-md px-4">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold text-text-primary">
                    Sign In
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Enter your credentials to continue
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                      placeholder="lede@gula.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="w-4 h-4 text-[#084750] border-border-primary rounded focus:ring-[#084750]"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-[#084750] hover:text-[#06635a]">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-square text-red-800 text-sm whitespace-pre-line">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-[#084750] text-white font-semibold rounded-square hover:bg-[#06635a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-text-secondary">
                    Need help?{" "}
                    <a href="https://manishtamang.com/contact" className="font-medium text-[#084750] hover:text-[#06635a]">
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GridWrapper>
      </section>
    </section>
  );
}

