"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-6" style={{ fontFamily: "Manrope, sans-serif" }}>Privacy Policy</h1>
        <div className="space-y-6 text-white/70 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
          <p>At Blackphics, we respect your privacy. We collect only the information necessary to process your orders, such as your name, email, shipping address, and phone number.</p>
          <ul className="space-y-3 list-disc list-inside marker:text-primary">
            <li>Your payment information is processed securely by our payment partners and is never stored on our servers in plain text.</li>
            <li>We do not sell your personal data to third parties.</li>
            <li>We may use your email to send order updates and occasional promotional content, which you can opt out of at any time.</li>
            <li>If you have any questions about your data, contact us at <a href="mailto:matikitibrighton6@gmail.com" className="text-primary hover:underline">matikitibrighton6@gmail.com</a>.</li>
          </ul>
        </div>
        <Link href="/" className="inline-flex items-center gap-1 mt-8 text-primary hover:underline"><ArrowLeft size={14} /> Back to Home</Link>
      </div>
    </div>
  );
}
