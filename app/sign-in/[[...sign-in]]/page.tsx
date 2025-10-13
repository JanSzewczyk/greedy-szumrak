import * as React from "react";

import { CircleDollarSignIcon, PieChart, Shield, TrendingUp, Wallet } from "lucide-react";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Card } from "@szum-tech/design-system";

const features = [
  { icon: Wallet, title: "Expense Control", desc: "Track where your money goes" },
  { icon: TrendingUp, title: "Investment Monitor", desc: "Watch your portfolio grow" },
  { icon: PieChart, title: "Smart Analytics", desc: "Get personalized reports" },
  { icon: Shield, title: "Security", desc: "Your data is safe with us" }
];

export default function SignInPage() {
  return (
    <main className="container flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 py-4 lg:flex-row lg:gap-12 lg:py-8">
        {/* Left Side - Marketing Content */}
        <div className="w-full max-w-3xl space-y-10 lg:flex-1 lg:pr-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="mb-10 flex items-center gap-3">
              <div>
                <CircleDollarSignIcon className="size-10 text-gray-100 sm:size-16" />
              </div>
              <h1 className="sm:text-heading-2 text-heading-4 text-nowrap text-gray-100">Greedy Szumrak</h1>
            </div>

            <h2 className="lg:text-heading-4 text-heading-5 text-gray-200">
              Your finances under control in the dark of night
            </h2>

            <p className="text-primary-300 text-subtitle-1 lg:text-heading-6">
              Don&#39;t let your money disappear into the darkness. Start tracking expenses and building wealth with an
              app that never sleeps.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <div className="flex flex-row gap-x-4 p-4">
                  <feature.icon className="text-primary-300 size-6 md:size-8" />
                  <div>
                    <h3 className="text-subtitle-1 md:text-heading-6 mb-1">{feature.title}</h3>
                    <p className="text-primary-300 text-body-2 md:text-body-1">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <Card>
            <div className="grid grid-cols-3 gap-4 p-4 text-center">
              <div>
                <div className="text-heading-5 text-primary-500">1+</div>
                <div className="text-subtitle-1 text-primary-100 mt-1">Users</div>
              </div>
              <div>
                <div className="text-heading-5 text-success-500">$10M+</div>
                <div className="text-subtitle-1 text-success-100 mt-1">Saved</div>
              </div>
              <div>
                <div className="text-heading-5 text-warning-500">24/7</div>
                <div className="text-subtitle-1 text-warning-100 mt-1">Monitoring</div>
              </div>
            </div>
          </Card>

          {/* CTA Text */}
          <div className="hidden lg:block">
            <p className="text-body-1 text-gray-300 italic">
              &#34;Since using Greedy Szumrak, I finally know exactly how much I spend and earn on investments. It&#39;s
              a game changer!&#34; - <span className="font-semibold text-gray-100">Jan R. S.</span>
            </p>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="flex w-full flex-col items-center justify-center lg:w-auto lg:shrink-0">
          <SignIn appearance={{ theme: dark }} />

          <div className="mt-6 text-center">
            <p className="text-caption text-gray-300">© {new Date().getFullYear()} Szum-Tech. All rights reserved.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
