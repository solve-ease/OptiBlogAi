"use client";
import React from "react";
import { cn } from "@/app/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "xl";
}

const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  padding = "md",
  className,
  ...props
}) => {
  const baseStyles =
    "bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200";

  const hoverStyles = hover
    ? "hover:shadow-lg hover:border-gray-300 hover:-translate-y-1"
    : "";

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  return (
    <div
      className={cn(baseStyles, hoverStyles, paddingStyles[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("mb-4", className)} {...props}>
    {children}
  </div>
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3
    className={cn("text-xl font-semibold text-gray-900", className)}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={cn("text-gray-600 mt-2", className)} {...props}>
    {children}
  </p>
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn("mt-4 pt-4 border-t border-gray-200", className)}
    {...props}
  >
    {children}
  </div>
);

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
