import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input focus:ring-primary",
        error: "border border-destructive focus:ring-destructive",
      },
      inputSize: {
        default: "h-10 px-3",
        sm: "h-9 px-2",
        lg: "h-11 px-4",
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
    return <input className={inputVariants({ variant, inputSize, className })} ref={ref} {...props} />;
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
