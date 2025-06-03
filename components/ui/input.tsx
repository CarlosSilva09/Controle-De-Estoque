import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input focus:ring-primary",
        error: "border border-destructive focus:ring-destructive",
      },
      inputSize: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  inputSize?: "default" | "sm" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, ...props }, ref) => {
    const hasCustomPadding = className?.includes('pl-') || className?.includes('pr-');
    const basePadding = hasCustomPadding ? '' : 'px-3';
    return <input className={`${inputVariants({ variant, inputSize })} ${basePadding} ${className || ''}`} ref={ref} {...props} />;
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
