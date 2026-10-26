import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

type ScrollDemoProps = {
  initialLast?: boolean;
  showScrollButtons?: boolean;
  manual?: boolean;
  vertical?: boolean;
  rtl?: boolean;
  uncontrolled?: boolean;
  customScroll?: boolean;
  onCustomScroll?: () => void;
};

function ScrollDemo({
  initialLast = false,
  showScrollButtons = true,
  manual = false,
  vertical = false,
  rtl = false,
  uncontrolled = false,
  customScroll = false,
  onCustomScroll,
}: ScrollDemoProps) {
  const [items, setItems] = React.useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [value, setValue] = React.useState(initialLast ? "8" : "1");
  const [narrow, setNarrow] = React.useState(false);
  const [longLabel, setLongLabel] = React.useState(false);
  const [single, setSingle] = React.useState(false);
  const [overrideDisabled, setOverrideDisabled] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);
  const visibleItems = single ? [1] : items;

  return (
    <div style={{ display: "grid", gap: "var(--spacing-05)" }}>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-03)" }}
      >
        <Button onClick={() => setValue(String(items[items.length - 1]))}>
          마지막 탭 선택
        </Button>
        <Button onClick={() => setValue("3")}>세 번째 탭 선택</Button>
        <Button
          onClick={() => {
            const next = (items[items.length - 1] ?? 0) + 1;
            setItems([...items, next]);
            setValue(String(next));
          }}
        >
          탭 추가 후 선택
        </Button>
        <Button
          onClick={() => {
            const next = items.filter((item) => String(item) !== value);
            setItems(next);
            setValue(String(next[next.length - 1] ?? ""));
          }}
        >
          선택 탭 삭제
        </Button>
        <Button onClick={() => setNarrow((current) => !current)}>
          폭 전환
        </Button>
        <Button onClick={() => setLongLabel((current) => !current)}>
          라벨 길이 전환
        </Button>
        <Button
          onClick={() => {
            setSingle((current) => !current);
            setValue("1");
          }}
        >
          한 개 탭 전환
        </Button>
        <Button onClick={() => setOverrideDisabled((current) => !current)}>
          버튼 강제 비활성화
        </Button>
      </div>
      <Tabs
        {...(uncontrolled
          ? { defaultValue: initialLast ? "8" : "1" }
          : { value, onValueChange: setValue })}
        activationMode={manual ? "manual" : "automatic"}
        dir={rtl ? "rtl" : "ltr"}
        orientation={vertical ? "vertical" : "horizontal"}
        variant="scrollable"
        style={{
          inlineSize: narrow
            ? "calc(var(--spacing-13) * 2)"
            : "min(100%, calc(var(--spacing-13) * 3))",
        }}
      >
        <TabsList
          ref={listRef}
          aria-label="스크롤 동작 검증"
          showScrollButtons={showScrollButtons}
          style={
            vertical
              ? { maxBlockSize: "calc(var(--spacing-13) * 2)" }
              : undefined
          }
          startScrollButtonDisabled={overrideDisabled ? true : undefined}
          endScrollButtonDisabled={overrideDisabled ? true : undefined}
          onEndScrollButtonClick={customScroll ? onCustomScroll : undefined}
        >
          {visibleItems.map((item) => (
            <TabsTrigger key={item} value={String(item)} disabled={item === 4}>
              {longLabel && item < 3
                ? `업무 화면 ${item} 상세 설정`
                : `업무 ${item}`}
            </TabsTrigger>
          ))}
        </TabsList>
        {visibleItems.map((item) => (
          <TabsContent key={item} value={String(item)}>
            업무 {item} 콘텐츠
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const meta = {
  title: "Components/Tabs/Scroll",
  component: ScrollDemo,
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "스크롤 핸들러 없이 버튼 이동·선택 탭 노출·경계 상태를 검증합니다. 컨트롤로 선택, 추가/삭제, 폭, 라벨 길이를 변경할 수 있습니다. 탭 선택 및 닫기 정책은 호출부에서 결정합니다.",
      },
    },
  },
} satisfies Meta<typeof ScrollDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

// Geometry is checked in the browser; DOM visibility alone does not detect clipped tabs.
function scrollElements(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const list = canvas.getByRole("tablist", { name: "스크롤 동작 검증" });
  const scroller = list.parentElement;
  if (!scroller) throw new Error("Missing scroll container");
  return { canvas, list, scroller };
}

async function expectInView(
  tab: HTMLElement,
  scroller: HTMLElement,
  vertical = false,
) {
  await waitFor(() => {
    const rect = tab.getBoundingClientRect();
    const clip = scroller.getBoundingClientRect();
    expect(vertical ? rect.top : rect.left).toBeGreaterThanOrEqual(
      (vertical ? clip.top : clip.left) - 1,
    );
    expect(vertical ? rect.bottom : rect.right).toBeLessThanOrEqual(
      (vertical ? clip.bottom : clip.right) + 1,
    );
  });
}

async function expectAtRest(scroller: HTMLElement, offset: number) {
  // Give a mistakenly scheduled smooth scroll time to start before checking stability.
  await new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  );
  await expect(Math.abs(scroller.scrollLeft - offset)).toBeLessThanOrEqual(1);
}

export const AutomaticButtons: Story = {
  play: async ({ canvasElement, step }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    const previous = canvas.getByRole("button", { name: "이전 탭 보기" });
    const next = canvas.getByRole("button", { name: "다음 탭 보기" });
    await expect(previous).toBeDisabled();
    await expect(next).toBeEnabled();
    await step(
      "버튼은 선택과 포커스를 바꾸지 않고 75%씩 이동한다",
      async () => {
        await userEvent.click(next);
        const expected = scroller.clientWidth * 0.75;
        await waitFor(() =>
          expect(Math.abs(scroller.scrollLeft - expected)).toBeLessThanOrEqual(
            1,
          ),
        );
        await expect(next).toHaveFocus();
        await expect(
          canvas.getByRole("tab", { name: "업무 1" }),
        ).toHaveAttribute("aria-selected", "true");
      },
    );
    await step("끝까지 이동하면 다음 버튼이 비활성화된다", async () => {
      for (
        let count = 0;
        count < 6 && !next.hasAttribute("disabled");
        count++
      ) {
        const before = scroller.scrollLeft;
        await userEvent.click(next);
        await waitFor(() =>
          expect(scroller.scrollLeft).toBeGreaterThan(before + 1),
        );
        await waitFor(() =>
          expect(
            Math.abs(
              scroller.scrollLeft -
                Math.min(
                  before + scroller.clientWidth * 0.75,
                  scroller.scrollWidth - scroller.clientWidth,
                ),
            ),
          ).toBeLessThanOrEqual(1),
        );
      }
      await expect(next).toBeDisabled();
      await expect(previous).toBeEnabled();
      await userEvent.click(previous);
      await waitFor(() => expect(next).toBeEnabled());
    });
  },
};

export const InitialRestoredSelection: Story = {
  args: { initialLast: true },
  play: async ({ canvasElement }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    await expectInView(canvas.getByRole("tab", { name: "업무 8" }), scroller);
    await expect(
      canvas.getByRole("button", { name: "다음 탭 보기" }),
    ).toBeDisabled();
    await expect(canvas.getByRole("tab", { name: "업무 8" })).not.toHaveFocus();
  },
};

export const ExternalSelectionAndLayout: Story = {
  play: async ({ canvasElement, step }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    await step("외부 선택과 탭 추가/삭제", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "마지막 탭 선택" }),
      );
      await expectInView(canvas.getByRole("tab", { name: "업무 8" }), scroller);
      await userEvent.click(
        canvas.getByRole("button", { name: "탭 추가 후 선택" }),
      );
      await expectInView(canvas.getByRole("tab", { name: "업무 9" }), scroller);
      await userEvent.click(
        canvas.getByRole("button", { name: "선택 탭 삭제" }),
      );
      await expect(
        canvas.queryByRole("tab", { name: "업무 9" }),
      ).not.toBeInTheDocument();
      await expectInView(canvas.getByRole("tab", { name: "업무 8" }), scroller);
    });
    await step(
      "선택값이 같아도 폭과 라벨 변경 후 활성 탭을 노출한다",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "세 번째 탭 선택" }),
        );
        const tab = canvas.getByRole("tab", { name: "업무 3" });
        await expectInView(tab, scroller);
        await userEvent.click(canvas.getByRole("button", { name: "폭 전환" }));
        await expectInView(tab, scroller);
        await userEvent.click(
          canvas.getByRole("button", { name: "라벨 길이 전환" }),
        );
        await expectInView(tab, scroller);
      },
    );
    await step("overflow가 사라지면 양쪽 버튼을 비활성화한다", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "한 개 탭 전환" }),
      );
      await waitFor(() =>
        expect(
          canvas.getByRole("button", { name: "이전 탭 보기" }),
        ).toBeDisabled(),
      );
      await expect(
        canvas.getByRole("button", { name: "다음 탭 보기" }),
      ).toBeDisabled();
    });
  },
};

export const WithoutButtons: Story = {
  args: { showScrollButtons: false },
  play: async ({ canvasElement }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    await expect(
      canvas.queryByRole("button", { name: "다음 탭 보기" }),
    ).not.toBeInTheDocument();
    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    await userEvent.click(
      canvas.getByRole("button", { name: "마지막 탭 선택" }),
    );
    await expectInView(canvas.getByRole("tab", { name: "업무 8" }), scroller);
  },
};

export const ManualKeyboard: Story = {
  args: { manual: true },
  play: async ({ canvasElement }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "업무 1" }));
    await userEvent.keyboard("{End}");
    const last = canvas.getByRole("tab", { name: "업무 8" });
    await expect(last).toHaveFocus();
    await expect(last).toHaveAttribute("aria-selected", "false");
    await expectInView(last, scroller);
    await userEvent.keyboard("{Enter}");
    await expect(last).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Home}{ArrowRight}{ArrowRight}{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "업무 5" })).toHaveFocus();
    await expectInView(canvas.getByRole("tab", { name: "업무 5" }), scroller);
    await expect(last).toHaveAttribute("aria-selected", "true");
  },
};

export const UncontrolledKeyboard: Story = {
  args: { uncontrolled: true },
  play: async ({ canvasElement }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "업무 1" }));
    await userEvent.keyboard("{End}");
    const tab = canvas.getByRole("tab", { name: "업무 8" });
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expectInView(tab, scroller);
  },
};

export const Vertical: Story = {
  args: { vertical: true },
  play: async ({ canvasElement }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    const next = canvas.getByRole("button", { name: "다음 탭 보기" });
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    await userEvent.click(next);
    await waitFor(() => expect(scroller.scrollTop).toBeGreaterThan(1));
    await userEvent.click(
      canvas.getByRole("button", { name: "마지막 탭 선택" }),
    );
    await expectInView(
      canvas.getByRole("tab", { name: "업무 8" }),
      scroller,
      true,
    );
    await waitFor(() => expect(next).toBeDisabled());
  },
};

export const RightToLeft: Story = {
  args: { rtl: true },
  play: async ({ canvasElement }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "이전 탭 보기" }),
    ).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "다음 탭 보기" }));
    await waitFor(() => expect(scroller.scrollLeft).toBeLessThan(-1));
    await userEvent.click(
      canvas.getByRole("button", { name: "마지막 탭 선택" }),
    );
    await expectInView(canvas.getByRole("tab", { name: "업무 8" }), scroller);
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "다음 탭 보기" }),
      ).toBeDisabled(),
    );
  },
};

export const CustomButtonCompatibility: Story = {
  args: { customScroll: true, onCustomScroll: fn() },
  play: async ({ canvasElement, args }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "다음 탭 보기" }));
    await expect(args.onCustomScroll).toHaveBeenCalledTimes(1);
    await expectAtRest(scroller, 0);
    await userEvent.click(
      canvas.getByRole("button", { name: "버튼 강제 비활성화" }),
    );
    await expect(
      canvas.getByRole("button", { name: "이전 탭 보기" }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole("button", { name: "다음 탭 보기" }),
    ).toBeDisabled();
  },
};

export const ManualScrollIsPreserved: Story = {
  play: async ({ canvasElement }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    scroller.scrollTo({ left: scroller.scrollWidth, behavior: "instant" });
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "다음 탭 보기" }),
      ).toBeDisabled(),
    );
    const offset = scroller.scrollLeft;
    await expect(offset).toBeGreaterThan(1);
    // An unrelated parent render must not pull the viewport back to the active first tab.
    await userEvent.click(
      canvas.getByRole("button", { name: "버튼 강제 비활성화" }),
    );
    await expectAtRest(scroller, offset);
    await expect(canvas.getByRole("tab", { name: "업무 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

export const ReducedMotion: Story = {
  beforeEach: () => {
    const original = window.matchMedia;
    window.matchMedia = (query) => {
      const result = original.call(window, query);
      if (query === "(prefers-reduced-motion: reduce)") {
        Object.defineProperty(result, "matches", { value: true });
      }
      return result;
    };
    return () => {
      window.matchMedia = original;
    };
  },
  play: async ({ canvasElement }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "다음 탭 보기" }));
    // This intentionally has no waitFor: reduced motion must arrive immediately.
    await expect(
      Math.abs(scroller.scrollLeft - scroller.clientWidth * 0.75),
    ).toBeLessThanOrEqual(1);
    await userEvent.click(
      canvas.getByRole("button", { name: "마지막 탭 선택" }),
    );
    const tab = canvas.getByRole("tab", { name: "업무 8" });
    await expect(tab.getBoundingClientRect().right).toBeLessThanOrEqual(
      scroller.getBoundingClientRect().right + 1,
    );
  },
};

export const VerticalWithoutButtons: Story = {
  args: { vertical: true, showScrollButtons: false, initialLast: true },
  play: async ({ canvasElement }) => {
    const { canvas, scroller } = scrollElements(canvasElement);
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    await expectInView(
      canvas.getByRole("tab", { name: "업무 8" }),
      scroller,
      true,
    );
    await expect(
      canvas.queryByRole("button", { name: "다음 탭 보기" }),
    ).not.toBeInTheDocument();
  },
};
