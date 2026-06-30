import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, type AvatarSize } from "./Avatar";

const sizes: AvatarSize[] = ["sm", "md", "lg"];
const demoAvatarSrc = "https://github.com/shadcn.png";

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    gap: "40px",
    fontFamily: "var(--if-font-family, Inter, system-ui, sans-serif)",
    padding: "0 120px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  heading: {
    fontSize: "14px",
    font: "var(--title-md)",
    fontWeight: 500,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
    color: "var(--text-secondary)",
  },
  row: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "40px",
  },
  item: {
    alignItems: "center",
    color: "var(--text-secondary)",
    flexDirection: "column" as const,
    display: "inline-flex",
    font: "var(--label-md)",
    gap: "var(--spacing-03)",
  },
  scenario: {
    alignItems: "center",
    color: "var(--text-secondary)",
    display: "inline-flex",
    flexDirection: "column" as const,
    font: "var(--label-md)",
    gap: "var(--spacing-03)",
  },
};

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          "Represents a user in a compact visual form. The API keeps MUI's simple image props " +
          "and shadcn/Radix's explicit fallback pattern: `children` is rendered as fallback content, " +
          "images use `alt`, and failed image loads fall back to `children` or the first character of `alt`.",
      },
    },
  },
  argTypes: {
    alt: { control: "text" },
    children: { control: "text" },
    size: { control: "select", options: sizes },
    src: { control: "text" },
    srcSet: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Overview: Story = {
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: () => (
    <div style={overviewStyles.root}>
      <section style={overviewStyles.section}>
        <h3 style={overviewStyles.heading}>Sizes</h3>
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <span key={size} style={overviewStyles.item}>
              <Avatar alt="Nova User" size={size}>
                NU
              </Avatar>
              {size}
            </span>
          ))}
        </div>
      </section>

      <section style={overviewStyles.section}>
        <h3 style={overviewStyles.heading}>Rendering scenarios</h3>
        <div style={overviewStyles.row}>
          <span style={overviewStyles.scenario}>
            <Avatar alt="Image user" src={demoAvatarSrc}>
              IU
            </Avatar>
            src + children
          </span>
          <span style={overviewStyles.scenario}>
            <Avatar alt="Jane Doe">JD</Avatar>
            children only
          </span>
          <span style={overviewStyles.scenario}>
            <Avatar alt="Broken image user" src="/broken-avatar.png">
              BI
            </Avatar>
            broken src + children
          </span>
          <span style={overviewStyles.scenario}>
            <Avatar alt="Nova User" src="/missing-avatar.png" />
            broken src + alt only
          </span>
        </div>
      </section>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  args: {
    alt: "Nova User",
    children: "NU",
    size: "md",
    src: "",
  },
};
