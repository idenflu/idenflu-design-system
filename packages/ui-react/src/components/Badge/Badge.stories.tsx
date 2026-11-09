import { expect, within } from "storybook/test";
import { Icon } from "../Icon";
import { Badge } from "./Badge";
export default { title: "Components/Badge", component: Badge };
export const Default = { args: { children: "Badge" } };
export const Success = { args: { children: "Success", variant: "success" } };
export const Solid = { args: { children: "Warning", variant: "warning", appearance: "solid" } };

export const SizeAndIcon = {
  render: () => (
    <div>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Badge key={size} size={size} variant="success" data-testid={`badge-${size}`}>
          <Icon name="check-circle" />완료
        </Badge>
      ))}
      <div data-size="sm">
        <Badge variant="success" data-testid="badge-inherited"><Icon name="check-circle" />상속</Badge>
        <Badge size="lg" variant="success" data-testid="badge-override"><Icon name="check-circle" />지정</Badge>
      </div>
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    for (const [size, height, iconWidth] of [["sm", 20, 12], ["md", 24, 14], ["lg", 28, 16]] as const) {
      const badge = canvas.getByTestId(`badge-${size}`);
      await expect(badge.getBoundingClientRect().height).toBeCloseTo(height, 0);
      await expect(badge.querySelector("svg")?.getBoundingClientRect().width).toBeCloseTo(iconWidth, 0);
    }
    await expect(canvas.getByTestId("badge-inherited").querySelector("svg")?.getBoundingClientRect().width).toBeCloseTo(12, 0);
    await expect(canvas.getByTestId("badge-override").querySelector("svg")?.getBoundingClientRect().width).toBeCloseTo(16, 0);
  },
};
