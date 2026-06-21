import { Phone } from "lucide-react";
import { getMaskedPhone } from "@/lib/phone";

interface MaskedPhoneLinkProps {
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function MaskedPhoneLink({ label, className, showIcon = true }: MaskedPhoneLinkProps) {
  const phone = getMaskedPhone();

  if (!phone.isConfigured || !phone.tel) {
    return (
      <p className={className}>
        {showIcon && <Phone className="mb-1 inline h-4 w-4 text-accent-red" />}{" "}
        <span className="font-mono text-steel-light">{phone.display}</span>
        <span className="ms-2 text-xs text-steel">(configure in env)</span>
      </p>
    );
  }

  return (
    <a
      href={`tel:${phone.tel}`}
      className={className}
    >
      {showIcon && <Phone className="mb-1 inline h-4 w-4 text-accent-red" />}{" "}
      {label && <span className="text-steel-light">{label} </span>}
      <span className="font-semibold text-accent-red hover:underline">{phone.display}</span>
    </a>
  );
}
