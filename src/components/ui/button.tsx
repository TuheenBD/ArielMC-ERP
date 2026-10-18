import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "gold"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "glass"
    | "glassPrimary";
  size?: "default" | "sm" | "lg" | "xs" | "icon";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-[#1F3A2E] text-white shadow-xs hover:bg-[#2C5240] hover:shadow-md hover:shadow-[#1F3A2E]/20 hover:backdrop-blur-md active:scale-[0.985] border border-white/10",
  primary:
    "bg-[#1F3A2E] text-white shadow-xs hover:bg-[#2C5240] hover:shadow-md hover:shadow-[#1F3A2E]/20 hover:backdrop-blur-md active:scale-[0.985] border border-white/10",
  gold:
    "bg-[#C9A86A] text-[#1F3A2E] font-bold shadow-xs hover:bg-[#D8B97D] hover:shadow-md hover:shadow-[#C9A86A]/30 active:scale-[0.985] border border-white/25",
  destructive:
    "bg-rose-600 text-white shadow-xs hover:bg-rose-700 hover:shadow-md hover:shadow-rose-600/25 active:scale-[0.985] border border-white/10",
  outline:
    "border border-[#DDE3DD] bg-white/80 backdrop-blur-xs text-[#1A1A1A] shadow-2xs hover:bg-white hover:border-[#1F3A2E]/30 hover:shadow-sm active:scale-[0.985]",
  secondary:
    "bg-[#F0F4F1] text-[#1F3A2E] shadow-2xs hover:bg-[#E4ECE6] hover:shadow-xs active:scale-[0.985] border border-[#DDE3DD]/60",
  ghost:
    "text-[#1A1A1A] hover:bg-black/5 hover:backdrop-blur-xs active:scale-[0.985]",
  link:
    "text-[#1F3A2E] underline-offset-4 hover:underline",
  glass:
    "bg-white/70 backdrop-blur-md border border-white/80 text-[#1A1A1A] shadow-xs hover:bg-white/95 hover:border-white hover:shadow-md hover:shadow-black/5 active:scale-[0.985]",
  glassPrimary:
    "bg-[#1F3A2E]/90 backdrop-blur-md border border-white/20 text-white shadow-sm hover:bg-[#1F3A2E] hover:border-white/35 hover:shadow-lg hover:shadow-[#1F3A2E]/25 active:scale-[0.985]",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-9 px-4 py-2 text-xs",
  sm: "h-8 px-3 text-xs",
  lg: "h-10 px-6 text-sm",
  xs: "h-7 px-2.5 text-[11px]",
  icon: "h-8 w-8 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 ease-out select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1F3A2E]/40 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer relative overflow-hidden group",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
