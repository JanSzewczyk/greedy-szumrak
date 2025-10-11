"use client";

import * as React from "react";

import { CheckCircle2, CircleDollarSignIcon, Sparkles } from "lucide-react";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Badge } from "@szum-tech/design-system";

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
        <div className="flex items-center gap-3 text-gray-100">
          <div>
            <CircleDollarSignIcon className="size-6 text-gray-100 sm:size-8" />
          </div>
          <span className="text-heading-5">Greedy Szumrak</span>
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
                <Sparkles className="size-4" />
                100% free, unlimited
              </Badge>

              <h1 className="lg:text-heading-2 sm:text-heading-3 text-heading-4 text-gray-100">
                Take control of your finances today
              </h1>

              <p className="text-primary-100 text-heading-5">
                Join thousands of users who save an average of $500 per month with Greedy Szumrak
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-3">
              <h3 className="text-heading-6 mb-4 text-gray-100">What do you get?</h3>
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="text-success-400 mt-0.5 size-6 flex-shrink-0" />
                  <span className="text-success-100">{benefit}</span>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="space-y-4">
              <h3 className="text-heading-6 text-gray-100">How it works?</h3>
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="bg-primary-500 flex size-10 flex-shrink-0 items-center justify-center rounded-full">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="text-heading-6">{step.title}</h4>
                      <p className="text-primary-200 text-body-2">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-caption text-gray-300">© {new Date().getFullYear()} Szum-Tech. All rights reserved.</p>
      </div>
    </main>
  );
}
