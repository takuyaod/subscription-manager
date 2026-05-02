import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-mono font-bold tracking-[0.05em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-35 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-[#3dd68c] border border-[#1f6b46] hover:bg-[#3dd68c18]",
        destructive:
          "bg-transparent text-[#ff4d4f] border border-[#ff4d4f55] hover:bg-[#ff4d4f14]",
        outline:
          "bg-transparent text-[#8b9499] border border-[#2a2f32] hover:bg-[#1c2123]",
        secondary:
          "bg-transparent text-[#8b9499] border border-[#2a2f32] hover:bg-[#1c2123]",
        ghost:
          "bg-transparent text-[#8b9499] border border-transparent hover:bg-[#1c2123]",
        link: "text-[#3dd68c] underline-offset-4 hover:underline border-none",
      },
      size: {
        default: "h-8 px-4 py-[7px] text-[12px]",
        sm: "h-7 px-[11px] py-1 text-[11px]",
        lg: "h-9 px-8 text-[12px]",
        icon: "h-7 w-7 text-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
