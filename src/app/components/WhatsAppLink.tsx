"use client";

type Props = {
  phone: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
};

export default function WhatsAppLink({ phone, text = "Hello", className, children, ariaLabel }: Props) {
  const formatPhone = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (digits.startsWith("0") && digits.length === 10) {
      return `213${digits.slice(1)}`;
    }
    if (digits.startsWith("213") && digits.length === 12) {
      return digits;
    }
    return digits;
  };

  const formatted = formatPhone(phone);
  const encoded = encodeURIComponent(text);
  const href = `https://wa.me/${formatted}?text=${encoded}`;

  return (
    <a href={href} className={className} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
