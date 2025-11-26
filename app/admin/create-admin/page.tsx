"use client";

import { BgGradient } from "../../components/BgGradient";
import { GridWrapper } from "../../components/GridWrapper";
import { AnimatedText } from "../../components/AnimatedText";
import { useState } from "react";

export default function CreateAdminPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "admin" as "admin" | "super_admin",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const HEADING_DELAY = 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin user");
      }

      setSubmitStatus("success");
      setFormData({
        email: "",
        password: "",
        fullName: "",
        role: "admin",
      });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16">
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
            className="mx-auto max-w-2xl text-center text-6xl font-bold leading-tight tracking-tighter text-blue-600 md:text-8xl md:leading-[78px]"
          >
            Create Admin User
          </AnimatedText>
          <div className="mt-4 text-center md:mt-8">
            <AnimatedText
              as="p"
              delay={PARAGRAPH_DELAY}
              className="leading-8 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
            >
              ⚠️ Temporary page - Delete after creating your admin user
            </AnimatedText>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative space-y-10 md:space-y-16">
        <GridWrapper>
          <div className="flex items-center justify-center py-8 md:py-12 min-h-[400px]">
            <div className="w-full max-w-md px-4">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold text-text-primary">
                    Create New Admin
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Fill in the details to create an admin user
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-text-primary">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                      placeholder="Admin User"
                    />
                  </div>

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
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                      placeholder="admin@hacksushma.xyz"
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
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                      placeholder="Minimum 6 characters"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="role" className="block text-sm font-medium text-text-primary">
                      Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>

                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-square text-green-800 text-sm">
                      ✅ Admin user created successfully! You can now sign in at /admin/signin
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-square text-red-800 text-sm">
                      ❌ {errorMessage || "Failed to create admin user. Please try again."}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-blue-600 text-white font-semibold rounded-square hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : "Create Admin User"}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-xs text-text-tertiary">
                    ⚠️ Remember to delete this page after creating your admin user
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

