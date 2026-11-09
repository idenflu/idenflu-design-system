import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import { Button } from "../Button/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  type DropdownMenuPosition,
  type DropdownMenuSize,
  DropdownMenuTrigger,
} from "./DropdownMenu";

const positions: DropdownMenuPosition[] = [
  "top-start",
  "top",
  "top-end",
  "right-start",
  "right",
  "right-end",
  "bottom-start",
  "bottom",
  "bottom-end",
  "left-start",
  "left",
  "left-end",
];

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "calc(var(--space-unit) * 6)",
    padding: "calc(var(--space-unit) * 16)",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "calc(var(--space-unit) * 3)",
  },
  heading: {
    color: "var(--text-secondary)",
    font: "var(--font-weight-regular) var(--font-size-caption)/var(--line-height-caption) var(--font-family-body)",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  row: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "calc(var(--space-unit) * 8)",
  },
  note: {
    color: "var(--text-secondary)",
    font: "var(--font-weight-regular) var(--font-size-body)/var(--line-height-body) var(--font-family-body)",
    margin: 0,
    maxWidth: "720px",
  },
};

function OverviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={overviewStyles.section}>
      <h3 style={overviewStyles.heading}>{title}</h3>
      {children}
    </section>
  );
}

function MenuItems({ endIcon = false }: { endIcon?: boolean }) {
  const icon = endIcon ? <Icon name="star" size={16} /> : undefined;

  return (
    <>
      <DropdownMenuItem endIcon={icon} onSelect={fn()}>
        Menu Item
      </DropdownMenuItem>
      <DropdownMenuItem endIcon={icon} onSelect={fn()}>
        Menu Item
      </DropdownMenuItem>
      <DropdownMenuItem endIcon={icon} onSelect={fn()}>
        Menu Item
      </DropdownMenuItem>
      <DropdownMenuItem endIcon={icon} onSelect={fn()}>
        Menu Item
      </DropdownMenuItem>
    </>
  );
}

function DropdownMenuExample({
  endIcon = false,
  size = "md",
  triggerLabel,
}: {
  endIcon?: boolean;
  size?: DropdownMenuSize;
  triggerLabel: string;
}) {
  const iconSize = size;

  return (
    <DropdownMenu size={size}>
      <DropdownMenuTrigger asChild>
        <IconButton
          color="primary"
          icon={<Icon name="star" />}
          label={triggerLabel}
          size={iconSize}
          variant="ghost"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <MenuItems endIcon={endIcon} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type PlaygroundArgs = {
  disabled: boolean;
  position: DropdownMenuPosition;
  showStartIcon: boolean;
  showEndIcon: boolean;
  showSeparator: boolean;
  size: DropdownMenuSize;
  triggerLabel: string;
};

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "메뉴나 액션을 펼치는 compound DropdownMenu입니다. Radix DropdownMenu Menu를 기반으로 키보드 탐색, typeahead, focus 관리를 제공합니다.\n\n" +
          "- **`DropdownMenuTrigger asChild`**: Radix Slot 패턴으로, Trigger가 자체 `<button>`을 만들지 않고 자식 요소(예: `IconButton`, `Button`)에 메뉴 열기 동작·ARIA 속성을 합칩니다.\n" +
          "- **`DropdownMenuGroup`**: 관련 항목을 묶고 `DropdownMenuLabel`로 섹션 제목을 붙입니다. 그룹 사이에는 `DropdownMenuSeparator`로 시각적·의미적 경계를 둡니다.",
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: positions,
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"] satisfies DropdownMenuSize[],
    },
    showStartIcon: { control: "boolean" },
    showEndIcon: { control: "boolean" },
    showSeparator: { control: "boolean" },
    disabled: { control: "boolean" },
    triggerLabel: { control: "text" },
  },
  args: {
    disabled: false,
    position: "bottom-start",
    showStartIcon: true,
    showEndIcon: false,
    showSeparator: true,
    size: "md",
    triggerLabel: "Open menu",
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Overview: Story = {
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: () => (
    <div style={overviewStyles.root}>
      <OverviewSection title="Sizes">
        <div style={overviewStyles.row}>
          <DropdownMenuExample size="sm" triggerLabel="Small menu" />
          <DropdownMenuExample size="md" triggerLabel="Medium menu" />
          <DropdownMenuExample endIcon size="lg" triggerLabel="Large menu" />
        </div>
      </OverviewSection>

      <OverviewSection title="Trigger with asChild">
        <p style={overviewStyles.note}>
          `DropdownMenuTrigger`에 `asChild`를 주면 Trigger wrapper 버튼 없이 자식
          컴포넌트 하나가 메뉴 트리거가 됩니다. Radix Slot이 자식에
          `aria-haspopup`, `aria-expanded`, 클릭·키보드 핸들러를 병합하므로
          `IconButton`·`Button`의 스타일·접근성 이름을 그대로 유지할 수
          있습니다. 자식은 반드시 단일 React 요소이며, ref를 전달할 수 있어야
          합니다.
        </p>
        <div style={overviewStyles.row}>
          <DropdownMenu size="md">
            <DropdownMenuTrigger asChild>
              <IconButton
                color="primary"
                icon={<Icon name="star" />}
                label="Icon trigger"
                size="md"
                variant="ghost"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu size="md">
            <DropdownMenuTrigger asChild>
              <Button
                endIcon={<Icon name="keyboard-arrow-down" />}
                variant="outlined"
              >
                Text trigger
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </OverviewSection>

      <OverviewSection title="Grouped actions">
        <p style={overviewStyles.note}>
          `DropdownMenuGroup`은 연관된 `DropdownMenuItem`을 하나의 논리 단위로 묶습니다.
          `DropdownMenuLabel`의 id를 그룹의 aria-labelledby에 연결하면 그룹 제목을
          스크린 리더에 전달합니다. 그룹 간 `DropdownMenuSeparator`는 `Divider`를
          사용해 시각·의미적 경계를 표시합니다. 한 메뉴 안에서 계정 설정·위험
          액션처럼 역할이 다른 항목을 구분할 때 사용합니다.
        </p>
        <DropdownMenu size="md">
          <DropdownMenuTrigger asChild>
            <IconButton
              color="primary"
              icon={<Icon name="star" />}
              label="Grouped menu"
              size="md"
              variant="outlined"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup aria-labelledby="dropdown-account-label">
              <DropdownMenuLabel id="dropdown-account-label">Account</DropdownMenuLabel>
              <DropdownMenuItem onSelect={fn()}>Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={fn()}>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator fullWidth={false} />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={fn()}>Sign out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Arrow keys로 항목을 이동하고 Enter 또는 Space로 선택합니다. Escape로
          메뉴를 닫고 트리거로 포커스를 돌려줍니다. 열린 메뉴 안에서는 Tab
          이동이 차단됩니다. Trigger는 `aria-haspopup="menu"`와
          `aria-expanded`를 제공합니다.
        </p>
        <DropdownMenu size="md">
          <DropdownMenuTrigger asChild>
            <IconButton
              color="primary"
              icon={<Icon name="star" size={16} />}
              label="Keyboard menu"
              size="md"
              variant="ghost"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={fn()}>First action</DropdownMenuItem>
            <DropdownMenuItem disabled onSelect={fn()}>
              Disabled action
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={fn()}>Last action</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  render: ({
    disabled,
    position,
    showStartIcon,
    showEndIcon,
    showSeparator,
    size,
    triggerLabel,
  }) => {
    const startIcon = showStartIcon ? (
      <Icon name="star" size={16} />
    ) : undefined;
    const endIcon = showEndIcon ? <Icon name="star" size={16} /> : undefined;
    const iconSize = size;

    return (
      <DropdownMenu size={size}>
        <DropdownMenuTrigger asChild>
          <IconButton
            color="primary"
            disabled={disabled}
            icon={<Icon name="star" size={16} />}
            label={triggerLabel}
            size={iconSize}
            variant="ghost"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent position={position}>
          <DropdownMenuItem startIcon={startIcon} endIcon={endIcon} onSelect={fn()}>
            Menu Item
          </DropdownMenuItem>
          <DropdownMenuItem startIcon={startIcon} endIcon={endIcon} onSelect={fn()}>
            Menu Item
          </DropdownMenuItem>
          {showSeparator ? <DropdownMenuSeparator /> : null}
          <DropdownMenuItem onSelect={fn()}>Menu Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const LinkItem: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Link menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild endIcon={<Icon name="star" />}>
          <a
            href="#dropdown-profile"
            onClick={(event) => event.preventDefault()}
          >
            Profile link
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Link menu" }));
    const item = await page.findByRole("menuitem", { name: "Profile link" });
    await expect(item.tagName).toBe("A");
    await expect(item).toHaveAttribute("href", "#dropdown-profile");
    await userEvent.click(item);
    await expect(page.getByRole("menu")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(page.queryByRole("menu")).not.toBeInTheDocument(),
    );
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Keyboard actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup aria-labelledby="keyboard-actions-label">
          <DropdownMenuLabel id="keyboard-actions-label">
            Account actions
          </DropdownMenuLabel>
          <DropdownMenuItem startIcon={<Icon name="star" />}>Alpha</DropdownMenuItem>
          <DropdownMenuItem disabled>Bravo</DropdownMenuItem>
          <DropdownMenuItem>Charlie</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Keyboard actions" });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(
      await page.findByRole("menuitem", { name: "Alpha" }),
    ).toHaveFocus();
    await expect(
      page.getByRole("group", { name: "Account actions" }),
    ).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}");
    await expect(page.getByRole("menuitem", { name: "Charlie" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(page.getByRole("menuitem", { name: "Alpha" })).toHaveFocus();
    await userEvent.keyboard("c");
    await expect(page.getByRole("menuitem", { name: "Charlie" })).toHaveFocus();
    await userEvent.tab();
    await expect(page.getByRole("menuitem", { name: "Charlie" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(page.queryByRole("menu")).not.toBeInTheDocument(),
    );
    await expect(trigger).toHaveFocus();
  },
};

const onAction = fn();
const onOpenChange = fn();
function ControlledExample() {
  const [open, setOpen] = React.useState(false);
  const [selection, setSelection] = React.useState("None");
  return (
    <>
      <DropdownMenu
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button>Controlled actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled onSelect={onAction}>
            Unavailable
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onAction();
              setSelection("Saved");
            }}
          >
            Save
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <output aria-label="Selection">{selection}</output>
    </>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    onAction.mockClear();
    onOpenChange.mockClear();
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Controlled actions" });
    await userEvent.click(trigger);
    await expect(onOpenChange).toHaveBeenLastCalledWith(true);
    const disabledItem = await page.findByRole("menuitem", {
      name: "Unavailable",
    });
    await expect(disabledItem).toHaveAttribute("aria-disabled", "true");
    // Dispatch directly because pointer interaction is intentionally blocked by CSS.
    disabledItem.click();
    await expect(onAction).not.toHaveBeenCalled();
    await expect(page.getByRole("menu")).toBeInTheDocument();
    await userEvent.keyboard("{Home}{Enter}");
    await expect(onAction).toHaveBeenCalledTimes(1);
    await expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() =>
      expect(page.queryByRole("menu")).not.toBeInTheDocument(),
    );
    await expect(
      canvas.getByRole("status", { name: "Selection" }),
    ).toHaveTextContent("Saved");
    await expect(trigger).toHaveFocus();
  },
};

export const DisabledTrigger: Story = {
  args: { disabled: true },
  render: Playground.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open menu" });
    await expect(trigger).toBeDisabled();
    trigger.click();
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    await expect(
      within(canvasElement.ownerDocument.body).queryByRole("menu"),
    ).not.toBeInTheDocument();
  },
};

export const LongMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Long menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Array.from({ length: 50 }, (_, index) => (
          <DropdownMenuItem
            key={index}
            startIcon={<Icon name="star" />}
            endIcon={<Icon name="star" />}
          >
            {`Action ${index + 1}: A long label that should truncate on a narrow screen`}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole("button", {
      name: "Long menu",
    });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    const menu = await page.findByRole("menu");
    await expect(menu.scrollHeight).toBeGreaterThan(menu.clientHeight);
    const style = getComputedStyle(menu);
    await expect(style.paddingBlockStart).toBe("4px");
    await expect(style.paddingBlockEnd).toBe("4px");
    await userEvent.keyboard("{End}");
    const last = page.getByRole("menuitem", { name: /^Action 50:/ });
    await expect(last).toHaveFocus();
    await expect(menu.scrollTop).toBeGreaterThan(0);
    const menuRect = menu.getBoundingClientRect();
    const itemRect = last.getBoundingClientRect();
    await expect(itemRect.bottom).toBeLessThanOrEqual(menuRect.bottom + 1);
    await expect(menuRect.right).toBeLessThanOrEqual(window.innerWidth + 1);
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(page.queryByRole("menu")).not.toBeInTheDocument(),
    );
  },
};
