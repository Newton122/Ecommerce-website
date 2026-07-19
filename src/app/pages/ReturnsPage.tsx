"use client";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
export default function ReturnsPage() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-6" style={{ fontFamily: "Manrope, sans-serif" }}>Returns & Refund Policy</h1>
        <div className="space-y-6 text-white/70 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
          <p>We want you to love your Blacphics order. If something isn't right, you can request a return or exchange within 14 days of delivery.</p>
          <ul className="space-y-3 list-disc list-inside marker:text-primary">
            <li>Items must be unworn, unwashed, and in their original packaging.</li>
            <li>Custom-printed products can only be returned if there is a manufacturing defect or error on our part.</li>
            <li>Once we receive and inspect the returned item, approved refunds are issued to your original payment method within 7–10 business days.</li>
            <li>To start a return, email us at <a href="mailto:matikitibrighton6@gmail.com" className="text-primary hover:underline">matikitibrighton6@gmail.com</a> with your order number and a description of the issue.</li>
          </ul>
        </div>
        <Link href="/" className="inline-flex items-center gap-1 mt-8 text-primary hover:underline"><ArrowLeft size={14} /> Back to Home</Link>
      </div>
    </div>
  );
}
