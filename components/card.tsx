import * as React from "react";

type CardProps = {
  children: React.ReactNode;
};

export function Card({ children }: CardProps) {
  return <div className="h-full rounded border border-gray-400 bg-app-primary px-6 py-10">{children}</div>;
}
