"use client";

import * as React from "react";

import { CheckCircle2, CircleDollarSignIcon, SparklesIcon } from "lucide-react";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Badge, Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@szum-tech/design-system";

const benefits = [
  "Free account with no hidden fees",
  "Unlimited number of transactions",
  "Automatic expense categorization",
  "Bank account synchronization",
  "Personalized reports and charts",
  "Upcoming payment notifications"
];

const steps = [
  { number: "1", title: "Create account", desc: "Fill out a simple registration form" },
  { number: "2", title: "Add transactions", desc: "Start tracking your expenses" },
  { number: "3", title: "Analyze data", desc: "Discover where you can save" }
];

export default function SignUpPage() {
  return (
    <main className="container flex min-h-screen flex-col pb-6">
      {/* Header */}
      <div className="py-4 lg:py-6">
        <div className="flex items-center gap-3">
          <div>
            <CircleDollarSignIcon className="size-6 sm:size-8" />
          </div>
          <span className="typography-heading-3">Greedy Szumrak</span>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-1 items-center justify-center py-4 lg:py-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
          {/* Left Side - Registration Form */}
          <div className="order-2 mx-auto lg:order-1">
            <SignUp appearance={{ theme: dark }} />
          </div>

          {/* Right Side - Benefits & Steps */}
          <div className="order-1 space-y-8 lg:order-2">
            {/* Hero Text */}
            <div className="space-y-4">
              {/* Badge */}
              <Badge>
                <SparklesIcon className="size-4" />
                100% free, unlimited
              </Badge>

              <h1 className="typography-heading-2">Take control of your finances today</h1>

              <p className="text-primary-100 typography-heading-4 text-muted-foreground">
                Join thousands of users who save an average of $500 per month with Greedy Szumrak
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-3">
              <h3 className="typography-large mb-4">What do you get?</h3>
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-success mt-0.5 size-6 shrink-0" />
                  <span className="text-success-foreground typography-small">{benefit}</span>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="space-y-4">
              <h3 className="typography-large">How it works?</h3>
              <ItemGroup>
                {steps.map((step, idx) => (
                  <Item key={idx} size="sm">
                    <ItemMedia variant="icon">{step.number}</ItemMedia>
                    <ItemContent>
                      <ItemTitle>{step.title}</ItemTitle>
                      <ItemDescription>{step.desc}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="typography-muted">© {new Date().getFullYear()} Szum-Tech. All rights reserved.</p>
      </div>
    </main>
  );
}
