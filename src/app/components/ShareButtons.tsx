import React from "react";
import { toast } from "sonner";

export default function ShareButtons({ title, text, url }: { title: string; text?: string; url?: string }) {
  const shareUrl = url || window.location.href;

  const onShare = async () => {
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title, text, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      toast.error("Failed to share. Please try again.");
    }
  };

  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + " - " + (text || ""))}&url=${encodeURIComponent(shareUrl)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + shareUrl)}`;

  return (
    <div className="flex items-center gap-3 mt-4">
      <button onClick={onShare} className="px-3 py-2 bg-white/6 rounded-xl text-white hover:bg-white/10 hover:shadow-sm transition-all duration-200">Share</button>
      <a href={twitter} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white/6 rounded-xl text-white hover:bg-white/10 hover:shadow-sm transition-all duration-200">Twitter</a>
      <a href={fb} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white/6 rounded-xl text-white hover:bg-white/10 hover:shadow-sm transition-all duration-200">Facebook</a>
      <a href={whatsapp} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white/6 rounded-xl text-white hover:bg-white/10 hover:shadow-sm transition-all duration-200">WhatsApp</a>
    </div>
  );
}
