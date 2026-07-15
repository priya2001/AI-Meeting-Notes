import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-white px-4 py-2 text-slate-950 hover:bg-cyan-100",
    secondary: "bg-white/10 px-4 py-2 text-white hover:bg-white/15",
    outline: "border border-white/15 bg-transparent px-4 py-2 text-white hover:bg-white/5"
  } as const;

  return <button className={cn(base, variants[variant], className)} {...props} />;
}