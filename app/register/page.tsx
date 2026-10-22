"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GridPageLayout } from "../components/GridPageLayout";
import { FeedbackButton } from "../components/FeedbackButton";
import { GridSection } from "../components/ui/grid-section";
import { PageHero } from "../components/ui/page-hero";
import { FeatureGrid, FeatureItem } from "../components/ui/feature-grid";
import { CheckList } from "../components/ui/check-list";
import {
  Field,
  FormPanel,
  fileInputClassName,
  inputClassName,
} from "../components/ui/form";
import { buttonClassName } from "../components/ui/button";
import { useTurnstile } from "../lib/use-turnstile";

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
  const {
    containerRef: turnstileRef,
    token: turnstileToken,
    reset: resetTurnstile,
  } = useTurnstile();

  // Update members array when member count changes
  useEffect(() => {
    const newMembers: TeamMember[] = [];
    for (let i = 0; i < memberCount; i++) {
      if (members[i]) {
        newMembers.push(members[i]);
      } else {
        newMembers.push({
          name: "",
          email: "",
          phone: "",
          document: null,
          documentType: "",
        });
      }
    }
    setMembers(newMembers);
  }, [memberCount, members]);

  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string | File,
  ) => {
    const updatedMembers = [...members];
    if (field === "document") {
      updatedMembers[index][field] = value as File;
    } else if (field === "documentType") {
      updatedMembers[index][field] = value as
        "id" | "citizenship" | "birthcertificate" | "";
    } else {
      updatedMembers[index][field] = value as string;
    }
    setMembers(updatedMembers);
  };

  const handleDocumentChange = (
    index: number,
    file: File | null,
    type: "id" | "citizenship" | "birthcertificate",
  ) => {
    const updatedMembers = [...members];
    updatedMembers[index].document = file;
    updatedMembers[index].documentType = type;
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      setIsSubmitting(false);
      return;
    }

    if (memberCount < 1 || memberCount > 4) {
      toast.error("Please select between 1 to 4 team members");
      setIsSubmitting(false);
      return;
    }

    for (let i = 0; i < memberCount; i++) {
      const member = members[i];
      if (!member.name.trim() || !member.email.trim() || !member.phone.trim()) {
        toast.error(`Please fill in all fields for team member ${i + 1}`);
        setIsSubmitting(false);
        return;
      }
      if (!member.document) {
        toast.error(`Please upload a document for team member ${i + 1}`);
        setIsSubmitting(false);
        return;
      }
    }

    // Validate payment screenshot
    if (!paymentScreenshot) {
      toast.error("Please upload payment screenshot");
      setIsSubmitting(false);
      return;
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      toast.error("Please complete the verification");
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
      toast.success(
        "Registration successful! We've received your team registration. You'll receive a confirmation email shortly.",
        {
          duration: 5000,
        },
      );

      // Reset form
      setTeamName("");
      setMemberCount(3);
      const emptyMembers: TeamMember[] = [];
      for (let i = 0; i < 4; i++) {
        emptyMembers.push({
          name: "",
          email: "",
          phone: "",
          document: null,
          documentType: "",
        });
      }
      setMembers(emptyMembers);
      setPaymentScreenshot(null);
      resetTurnstile();
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later.";
      toast.error(errorMessage);
    }
  };

  return (
    <GridPageLayout>
      <Toaster position="top-center" />
      <FeedbackButton />

      <PageHero
        align="center"
        icon={<UsersIcon className="size-10" />}
        title="Register Your Team"
        description={
          <p>
            Join Godawari Hacks! Register your team of 4 members and get ready
            for an amazing coding experience.
          </p>
        }
      />

      <FormPanel>
        <h2 className="font-display text-xl font-medium text-neutral-900">
          Team Registration
        </h2>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          We take your documents seriously. Submitted IDs and sensitive files
          are used only for verification, kept secure until the event, and then
          deleted.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <Field label="Team Name *" htmlFor="teamName">
            <input
              type="text"
              id="teamName"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className={inputClassName}
              placeholder="Enter your team name"
            />
          </Field>

          <Field
            label="Number of Team Members *"
            htmlFor="memberCount"
            hint="Select how many members will be in your team (1-4 members)"
          >
            <select
              id="memberCount"
              value={memberCount}
              onChange={(e) => setMemberCount(Number(e.target.value))}
              className={inputClassName}
            >
              <option value={1}>1 Member</option>
              <option value={2}>2 Members</option>
              <option value={3}>3 Members</option>
              <option value={4}>4 Members</option>
            </select>
          </Field>

          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900">
              Team Members ({memberCount} selected)
            </h3>

            {members.slice(0, memberCount).map((member, index) => (
              <div
                key={index}
                className="space-y-4 rounded-xl border border-neutral-200 p-5"
              >
                <h4 className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                  <span className="flex size-6 items-center justify-center rounded-full border border-neutral-300 font-mono text-xs text-neutral-600">
                    {index + 1}
                  </span>
                  Member {index + 1}
                </h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Full Name *" htmlFor={`member${index}_name`}>
                    <input
                      type="text"
                      id={`member${index}_name`}
                      required
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(index, "name", e.target.value)
                      }
                      className={inputClassName}
                      placeholder="Full name"
                    />
                  </Field>

                  <Field label="Email *" htmlFor={`member${index}_email`}>
                    <input
                      type="email"
                      id={`member${index}_email`}
                      required
                      value={member.email}
                      onChange={(e) =>
                        handleMemberChange(index, "email", e.target.value)
                      }
                      className={inputClassName}
                      placeholder="email@example.com"
                    />
                  </Field>

                  <Field
                    label="Phone Number *"
                    htmlFor={`member${index}_phone`}
                  >
                    <input
                      type="tel"
                      id={`member${index}_phone`}
                      required
                      value={member.phone}
                      onChange={(e) =>
                        handleMemberChange(index, "phone", e.target.value)
                      }
                      className={inputClassName}
                      placeholder="+977 98XXXXXXXX"
                    />
                  </Field>

                  <Field
                    label="Document Type *"
                    htmlFor={`member${index}_documentType`}
                  >
                    <select
                      id={`member${index}_documentType`}
                      required
                      value={member.documentType}
                      onChange={(e) => {
                        const type = e.target.value as
                          "id" | "citizenship" | "birthcertificate" | "";
                        handleMemberChange(index, "documentType", type);
                      }}
                      className={inputClassName}
                    >
                      <option value="">Select document type</option>
                      <option value="id">ID Card</option>
                      <option value="citizenship">Citizenship</option>
                      <option value="birthcertificate">
                        Birth Certificate
                      </option>
                    </select>
                  </Field>
                </div>

                <Field
                  label="Upload Document * (PDF, JPG, PNG - Max 5MB)"
                  htmlFor={`member${index}_document`}
                  hint={
                    member.document &&
                    `Selected: ${member.document.name} (${(member.document.size / 1024).toFixed(2)} KB)`
                  }
                >
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
                        handleDocumentChange(
                          index,
                          file,
                          member.documentType as
                            "id" | "citizenship" | "birthcertificate",
                        );
                      }
                    }}
                    className={fileInputClassName}
                  />
                </Field>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="flex flex-col items-start gap-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5 md:flex-row md:items-center">
            <div className="flex shrink-0 flex-col items-center">
              <h3 className="mb-3 text-sm font-medium text-neutral-900">
                Scan to Pay
              </h3>
              <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
                <Image
                  src="/ganesh-qr.jpg"
                  alt="Payment QR Code"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
              <p className="mt-3 text-center font-mono text-xs text-neutral-500">
                NPR 2500 per team
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-medium text-neutral-900">
                  Payment Instructions
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Scan the QR code with your phone to make the payment of NPR
                  2500 per team.
                </p>
              </div>
              <ol className="space-y-3">
                {PAYMENT_STEPS.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-black font-mono text-xs text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm text-neutral-600">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Payment proof */}
          <div className="space-y-4 rounded-xl border border-neutral-200 p-5">
            <div>
              <h3 className="font-medium text-neutral-900">Payment Proof</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Upload a screenshot or photo of your payment receipt (NPR 2500
                per team)
              </p>
            </div>
            <Field
              label="Payment Screenshot * (JPG, PNG - Max 5MB)"
              htmlFor="paymentScreenshot"
              hint={
                <>
                  {paymentScreenshot && (
                    <span className="block">
                      Selected: {paymentScreenshot.name} (
                      {(paymentScreenshot.size / 1024).toFixed(2)} KB)
                    </span>
                  )}
                  Please ensure the payment screenshot shows the transaction
                  details clearly, including amount and reference number.
                </>
              }
            >
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
                className={fileInputClassName}
              />
            </Field>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5 size-4 rounded border-neutral-300 accent-black"
              />
              <label htmlFor="terms" className="text-sm text-neutral-600">
                I agree to the terms and conditions of Godawari Hacks. I confirm
                that all information provided is accurate and I have the right
                to participate in this hackathon.
              </label>
            </div>
            <div ref={turnstileRef} id="cf-turnstile" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${buttonClassName()} disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:hover:ring-0`}
          >
            {isSubmitting ? "Submitting..." : "Register Team"}
          </button>
        </form>
      </FormPanel>

      <GridSection innerClassName="px-5 py-16">
        <h2 className="font-display text-3xl font-medium text-neutral-900">
          Registration Guidelines
        </h2>
        <FeatureGrid className="mt-10">
          {GUIDELINES.map(({ title, items }) => (
            <FeatureItem key={title} title={title}>
              <CheckList items={items} />
            </FeatureItem>
          ))}
        </FeatureGrid>
      </GridSection>
    </GridPageLayout>
  );
}

const PAYMENT_STEPS = [
  "Scan the QR code using Esewa, Fonepay or any Other Banking App.(Make sure to send Fee to Ganesh Sahau)",
  "Enter the amount NPR 2500 for your team",
  "Complete the payment and take a screenshot of the receipt",
  "Upload the payment receipt screenshot below",
];

const GUIDELINES = [
  {
    title: "Team Requirements",
    items: [
      {
        _key: "t1",
        text: "Teams can have 1 to 4 members (flexible team size)",
      },
      {
        _key: "t2",
        text: "All team members must provide valid identification",
      },
      {
        _key: "t3",
        text: "Each member must upload a valid document (ID Card, Citizenship, or Birth Certificate)",
      },
      { _key: "t4", text: "Solo participants are welcome!" },
    ],
  },
  {
    title: "Document Requirements",
    items: [
      { _key: "d1", text: "Accepted formats: PDF, JPG, JPEG, PNG" },
      { _key: "d2", text: "Maximum file size: 5MB per document" },
      { _key: "d3", text: "Documents must be clear and readable" },
      { _key: "d4", text: "Documents must be valid and not expired" },
    ],
  },
  {
    title: "Important Notes",
    items: [
      { _key: "n1", text: "Registration fee is NPR 2500 per team" },
      {
        _key: "n2",
        text: "You will receive a confirmation email after successful registration",
      },
      {
        _key: "n3",
        text: "Please ensure all information is accurate before submitting",
      },
      {
        _key: "n4",
        text: (
          <>
            Contact us if you have any questions:{" "}
            <a
              href="mailto:hack@godawari.edu.np"
              className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
            >
              hack@godawari.edu.np
            </a>
          </>
        ),
      },
    ],
  },
];

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
