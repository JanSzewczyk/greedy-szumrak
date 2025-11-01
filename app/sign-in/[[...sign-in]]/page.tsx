import * as React from "react";

import { ChevronRightIcon, CircleDollarSignIcon, PieChart, Shield, TrendingUp, Wallet } from "lucide-react";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Card, Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@szum-tech/design-system";

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
                <CircleDollarSignIcon className="size-10 sm:size-16" />
              </div>
              <h1 className="typography-heading-1 text-nowrap">Greedy Szumrak</h1>
            </div>

            <h2 className="typography-heading-2">Your finances under control in the dark of night</h2>

            <p className="typography-lead">
              Don&#39;t let your money disappear into the darkness. Start tracking expenses and building wealth with an
              app that never sleeps.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
            {features.map((feature, index) => (
              <Item variant="outline" key={index}>
                <ItemMedia>
                  <feature.icon className="size-6" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{feature.title}</ItemTitle>
                  <ItemDescription>{feature.desc}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>

          {/* Stats Section */}
          <Card>
            <div className="grid grid-cols-3 gap-4 p-4 text-center">
              <div>
                <div className="text-heading-5 text-primary">1+</div>
                <div className="typography-large text-primary-foreground mt-1">Users</div>
              </div>
              <div>
                <div className="text-heading-5 text-success">$10M+</div>
                <div className="typography-large text-success-foreground mt-1">Saved</div>
              </div>
              <div>
                <div className="text-heading-5 text-warning">24/7</div>
                <div className="typography-large text-warning-foreground mt-1">Monitoring</div>
              </div>
            </div>
          </Card>

          {/* CTA Text */}
          <div className="hidden lg:block">
            <p className="typography-blockquote">
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
