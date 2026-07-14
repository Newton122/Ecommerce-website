"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-6" style={{ fontFamily: "Manrope, sans-serif" }}>Terms of Service</h1>
        <div className="space-y-6 text-white/70 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
          <p>By using Blackphics, you agree to these terms. All content, designs, and artwork displayed on this site are the property of Blackphics and may not be reproduced without written permission.</p>
          <ul className="space-y-3 list-disc list-inside marker:text-primary">
            <li>Orders placed through our store are subject to acceptance and product availability. We reserve the right to refuse or cancel any order at our discretion.</li>
            <li>Prices are listed in Algerian Dinar (DZD) and may change without notice.</li>
            <li>Custom designs remain the intellectual property of Blackphics unless otherwise agreed in writing.</li>
            <li>These terms may be updated from time to time. Continued use of the site constitutes acceptance of the current terms.</li>
          </ul>
        </div>
        <Link href="/" className="inline-flex items-center gap-1 mt-8 text-primary hover:underline"><ArrowLeft size={14} /> Back to Home</Link>
      </div>
    </div>
  );
}
