import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "gold"
    | "success"
    | "warning"
    | "destructive"
    | "glass";
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-[#1F3A2E] text-white border-transparent",
  primary: "bg-[#1F3A2E] text-white border-transparent",
  secondary: "bg-[#F0F4F1] text-[#1F3A2E] border-[#DDE3DD]",
  outline: "text-[#1A1A1A] border-[#DDE3DD] bg-white/80",
  gold: "bg-[#FBF6EC] text-[#8A6D3B] border-[#E8D7B5]",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  destructive: "bg-rose-50 text-rose-800 border-rose-200",
  glass: "bg-white/70 backdrop-blur-md text-[#1F3A2E] border-white/80 shadow-2xs",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-hidden",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
