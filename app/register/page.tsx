"use client";

import { GridWrapper } from "../components/GridWrapper";
import { AnimatedText } from "../components/AnimatedText";
import { MainSiteLayout } from "../components/MainSiteLayout";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  document: File | null;
  documentType: "id" | "citizenship" | "birthcertificate" | "";
}

export default function RegisterPage() {
  const [teamName, setTeamName] = useState("");
  const [memberCount, setMemberCount] = useState<number>(3);
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "", email: "", phone: "", document: null, documentType: "" },
    { name: "", email: "", phone: "", document: null, documentType: "" },
    { name: "", email: "", phone: "", document: null, documentType: "" },
    { name: "", email: "", phone: "", document: null, documentType: "" },
  ]);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const HEADING_DELAY = 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;

  // Update members array when member count changes
  useEffect(() => {
    const newMembers: TeamMember[] = [];
    for (let i = 0; i < memberCount; i++) {
      if (members[i]) {
        newMembers.push(members[i]);
      } else {
        newMembers.push({ name: "", email: "", phone: "", document: null, documentType: "" });
      }
    }
    setMembers(newMembers);
  }, [memberCount]);

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

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string | File) => {
    const updatedMembers = [...members];
    if (field === "document") {
      updatedMembers[index][field] = value as File;
    } else if (field === "documentType") {
      updatedMembers[index][field] = value as "id" | "citizenship" | "birthcertificate" | "";
    } else {
      updatedMembers[index][field] = value as string;
    }
    setMembers(updatedMembers);
  };

  const handleDocumentChange = (index: number, file: File | null, type: "id" | "citizenship" | "birthcertificate") => {
    const updatedMembers = [...members];
    updatedMembers[index].document = file;
    updatedMembers[index].documentType = type;
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Validate form
    if (!teamName.trim()) {
      alert("Please enter a team name");
      setIsSubmitting(false);
      return;
    }

    if (memberCount < 1 || memberCount > 4) {
      alert("Please select between 1 to 4 team members");
      setIsSubmitting(false);
      return;
    }

    for (let i = 0; i < memberCount; i++) {
      const member = members[i];
      if (!member.name.trim() || !member.email.trim() || !member.phone.trim()) {
        alert(`Please fill in all fields for team member ${i + 1}`);
        setIsSubmitting(false);
        return;
      }
      if (!member.document) {
        alert(`Please upload a document for team member ${i + 1}`);
        setIsSubmitting(false);
        return;
      }
    }

    // Validate payment screenshot
    if (!paymentScreenshot) {
      alert("Please upload payment screenshot");
      setIsSubmitting(false);
      return;
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      alert("Please complete the verification");
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission (replace with actual API call)
    const formData = new FormData();
    formData.append("teamName", teamName);
    formData.append("memberCount", memberCount.toString());
    formData.append("turnstileToken", turnstileToken);
    formData.append("paymentScreenshot", paymentScreenshot);

    members.slice(0, memberCount).forEach((member, index) => {
      formData.append(`member${index + 1}_name`, member.name);
      formData.append(`member${index + 1}_email`, member.email);
      formData.append(`member${index + 1}_phone`, member.phone);
      formData.append(`member${index + 1}_documentType`, member.documentType);
      if (member.document) {
        formData.append(`member${index + 1}_document`, member.document);
      }
    });

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setIsSubmitting(false);
      setSubmitStatus("success");

      // Reset form
      setTeamName("");
      setMemberCount(3);
      const emptyMembers: TeamMember[] = [];
      for (let i = 0; i < 4; i++) {
        emptyMembers.push({ name: "", email: "", phone: "", document: null, documentType: "" });
      }
      setMembers(emptyMembers);
      setPaymentScreenshot(null);
      setTurnstileToken(null);

      // Reset Turnstile widget
      if (turnstileWidgetIdRef.current && typeof window !== "undefined" && (window as any).turnstile) {
        (window as any).turnstile.reset(turnstileWidgetIdRef.current);
      }

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus("error");
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again later.";
      alert(errorMessage);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <MainSiteLayout>
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
              Register Your Team
            </AnimatedText>
            <div className="mt-4 text-center md:mt-8">
              <AnimatedText
                as="p"
                delay={PARAGRAPH_DELAY}
                className="leading-8 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
              >
                Join Godawari Hack! Register your team of 4 members and get ready for an amazing coding experience.
              </AnimatedText>
            </div>
          </div>
        </section>

        {/* Registration Form Section */}
        <section className="relative space-y-10 md:space-y-16">
          <GridWrapper>
            <div className="space-y-6 py-8 md:py-12">
              <h2 className="text-[#084750] ml-4 text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
                Team Registration
              </h2>
              <div className="px-4">
                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                  <div className="space-y-2">
                    <label htmlFor="teamName" className="block text-sm font-medium text-text-primary">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      id="teamName"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                      placeholder="Enter your team name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="memberCount" className="block text-sm font-medium text-text-primary">
                      Number of Team Members *
                    </label>
                    <select
                      id="memberCount"
                      value={memberCount}
                      onChange={(e) => setMemberCount(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                    >
                      <option value={1}>1 Member</option>
                      <option value={2}>2 Members</option>
                      <option value={3}>3 Members</option>
                      <option value={4}>4 Members</option>
                    </select>
                    <p className="text-sm text-text-secondary mt-1">
                      Select how many members will be in your team (1-4 members)
                    </p>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-text-primary">
                      Team Members ({memberCount} selected)
                    </h3>

                    {members.slice(0, memberCount).map((member, index) => (
                      <div key={index} className="border border-border-primary/50 rounded-square p-6 space-y-4">
                        <h4 className="text-lg font-semibold text-text-primary">Member {index + 1}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor={`member${index}_name`} className="block text-sm font-medium text-text-primary">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              id={`member${index}_name`}
                              required
                              value={member.name}
                              onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                              className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                              placeholder="Full name"
                            />
                          </div>

                          <div className="space-y-2">
                            <label htmlFor={`member${index}_email`} className="block text-sm font-medium text-text-primary">
                              Email *
                            </label>
                            <input
                              type="email"
                              id={`member${index}_email`}
                              required
                              value={member.email}
                              onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                              className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                              placeholder="email@example.com"
                            />
                          </div>

                          <div className="space-y-2">
                            <label htmlFor={`member${index}_phone`} className="block text-sm font-medium text-text-primary">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              id={`member${index}_phone`}
                              required
                              value={member.phone}
                              onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                              className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                              placeholder="+977 98XXXXXXXX"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">
                              Document Type *
                            </label>
                            <select
                              required
                              value={member.documentType}
                              onChange={(e) => {
                                const type = e.target.value as "id" | "citizenship" | "birthcertificate" | "";
                                handleMemberChange(index, "documentType", type);
                              }}
                              className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                            >
                              <option value="">Select document type</option>
                              <option value="id">ID Card</option>
                              <option value="citizenship">Citizenship</option>
                              <option value="birthcertificate">Birth Certificate</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor={`member${index}_document`} className="block text-sm font-medium text-text-primary">
                            Upload Document * (PDF, JPG, PNG - Max 5MB)
                          </label>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              id={`member${index}_document`}
                              required
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    alert("File size must be less than 5MB");
                                    return;
                                  }
                                  handleDocumentChange(index, file, member.documentType as "id" | "citizenship" | "birthcertificate");
                                }
                              }}
                              className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-square file:border-0 file:text-sm file:font-semibold file:bg-[#084750] file:text-white hover:file:bg-[#084750]/80"
                            />
                          </div>
                          {member.document && (
                            <p className="text-sm text-text-secondary mt-2">
                              Selected: {member.document.name} ({(member.document.size / 1024).toFixed(2)} KB)
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Section */}
                  <div className="space-y-6 border border-[#084750]/30 rounded-square p-6 bg-gradient-to-br from-[#084750]/5 to-transparent">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      {/* QR Code */}
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Scan to Pay</h3>
                        <div className="bg-white p-4 rounded-lg border-2 border-[#084750]/20 shadow-md">
                          <Image
                            src="/qr.jpg"
                            alt="Payment QR Code"
                            width={200}
                            height={200}
                            className="rounded-md"
                          />
                        </div>
                        <p className="text-xs text-text-secondary mt-3 text-center">
                          NPR 2500 per team
                        </p>
                      </div>

                      {/* Payment Instructions */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary mb-2">Payment Instructions</h3>
                          <p className="text-sm text-text-secondary mb-3">
                            Scan the QR code with your phone to make the payment of NPR 2500 per team.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#084750] text-white flex items-center justify-center text-xs font-bold">1</span>
                            <p className="text-sm text-text-secondary">Scan the QR code using Esewa, Fonepay or any Other Banking App.(Make sure to send Fee to Di****** Sahau)</p>
                          </div>
                          <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#084750] text-white flex items-center justify-center text-xs font-bold">2</span>
                            <p className="text-sm text-text-secondary">Enter the amount NPR 2500 for your team</p>
                          </div>
                          <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#084750] text-white flex items-center justify-center text-xs font-bold">3</span>
                            <p className="text-sm text-text-secondary">Complete the payment and take a screenshot of the receipt</p>
                          </div>
                          <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#084750] text-white flex items-center justify-center text-xs font-bold">4</span>
                            <p className="text-sm text-text-secondary">Upload the payment receipt screenshot below</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Screenshot Upload */}
                  <div className="space-y-2 border border-border-primary/50 rounded-square p-6">
                    <h3 className="text-lg font-semibold text-text-primary">Payment Proof</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Upload a screenshot or photo of your payment receipt (NPR 2500 per team)
                    </p>
                    <label htmlFor="paymentScreenshot" className="block text-sm font-medium text-text-primary">
                      Payment Screenshot * (JPG, PNG - Max 5MB)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        id="paymentScreenshot"
                        required
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("File size must be less than 5MB");
                              e.target.value = "";
                              return;
                            }
                            setPaymentScreenshot(file);
                          }
                        }}
                        className="w-full px-4 py-3 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-square file:border-0 file:text-sm file:font-semibold file:bg-[#084750] file:text-white hover:file:bg-[#084750]/80"
                      />
                    </div>
                    {paymentScreenshot && (
                      <p className="text-sm text-text-secondary mt-2">
                        Selected: {paymentScreenshot.name} ({(paymentScreenshot.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                    <p className="text-xs text-text-secondary mt-2">
                      Please ensure the payment screenshot shows the transaction details clearly, including amount and reference number.
                    </p>
                  </div>

                  <div className="space-y-4 p-4 bg-blue-50/50 rounded-square border border-blue-200">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1 w-4 h-4 text-[#084750] border-border-primary rounded focus:ring-[#084750]"
                      />
                      <label htmlFor="terms" className="text-sm text-text-secondary">
                        I agree to the terms and conditions of Godawari Hack. I confirm that all information provided is accurate and I have the right to participate in this hackathon.
                      </label>
                    </div>
                    <div className="flex justify-center pt-2">
                      <div ref={turnstileRef} id="cf-turnstile"></div>
                    </div>
                  </div>
                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-square text-green-800">
                      Registration successful! We&apos;ve received your team registration. You&apos;ll receive a confirmation email shortly.
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-square text-red-800">
                      Something went wrong. Please try again later.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-[#084750] text-white font-semibold rounded-square hover:bg-[#084750]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Register Team"}
                  </button>
                </form>
              </div>
            </div>
          </GridWrapper>
        </section>
        {/* Information Section */}
        <section className="relative space-y-10 md:space-y-16">
          <GridWrapper className="before:hidden">
            <div className="space-y-6 py-8 md:py-12">
              <h2 className="text-[#084750] ml-4 text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
                Registration Guidelines
              </h2>
              <div className="space-y-4 px-4 max-w-4xl">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-text-primary">Team Requirements</h3>
                  <ul className="space-y-1 text-text-secondary list-disc list-inside">
                    <li>Teams can have 1 to 4 members (flexible team size)</li>
                    <li>All team members must provide valid identification</li>
                    <li>Each member must upload a valid document (ID Card, Citizenship, or Birth Certificate)</li>
                    <li>Solo participants are welcome!</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-text-primary">Document Requirements</h3>
                  <ul className="space-y-1 text-text-secondary list-disc list-inside">
                    <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
                    <li>Maximum file size: 5MB per document</li>
                    <li>Documents must be clear and readable</li>
                    <li>Documents must be valid and not expired</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-text-primary">Important Notes</h3>
                  <ul className="space-y-1 text-text-secondary list-disc list-inside">
                    <li>Registration fee is NPR 2500 per team</li>
                    <li>You will receive a confirmation email after successful registration</li>
                    <li>Please ensure all information is accurate before submitting</li>
                    <li>Contact us if you have any questions about the registration process</li>
                  </ul>
                </div>
              </div>
            </div>
          </GridWrapper>
        </section>
      </section>
    </MainSiteLayout>
  );
}

