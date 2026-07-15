import React from "react";

export default function FAQ() {
  const faqs = [
    { q: "What sizes do you offer?", a: "We offer S, M, L, XL, XXL and custom sizes upon request." },
    { q: "How long does shipping take?", a: "Shipping within Algeria usually takes 3-7 business days." },
    { q: "Do you accept returns?", a: "Yes — returns accepted within 14 days for unworn items." },
  ];

  return (
    <div className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-white mb-6">FAQs</h1>
      <p className="text-white/60 mb-8">Answers to common questions about orders, sizes, and shipping.</p>

      <div className="grid gap-6">
        {faqs.map((f, idx) => (
          <details key={idx} className="p-6 rounded-2xl bg-card border border-white/[0.06]">
            <summary className="font-semibold text-white mb-2 cursor-pointer">{f.q}</summary>
            <p className="text-white/60 mt-3">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
