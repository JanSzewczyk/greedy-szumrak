import { type Meta, type StoryObj } from "@storybook/react";
import RootLayout from "~/app/layout";
import Page from "~/app/page";

const meta = {
  title: "Greedy Szumrak",
  component: Page,
  parameters: {
    nextjs: {
      router: {
        pathname: "/"
      }
    }
  },
  decorators: [
    (Story) => (
      <RootLayout>
        <Story />
      </RootLayout>
    )
  ]
} satisfies Meta<typeof Page>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Home Page",
  tags: ["test-only"]
};
