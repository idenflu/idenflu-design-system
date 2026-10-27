import * as React from "react";

type SvgShape = {
  tag: string;
  attributes: Record<string, string>;
  children: SvgShape[];
};

function jsxAttribute(name: string): string {
  if (name.startsWith("aria-") || name.startsWith("data-")) return name;
  if (name === "class") return "className";
  return name.replace(/[:-]([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

function readShape(element: Element): SvgShape {
  return {
    tag: element.localName,
    attributes: Object.fromEntries(
      Array.from(element.attributes, (attribute) => [
        jsxAttribute(attribute.name),
        attribute.value,
      ]),
    ),
    children: Array.from(element.children, readShape),
  };
}

export function readIconDrawings(source: string): Map<string, SvgShape[]> {
  const document = new DOMParser().parseFromString(source, "image/svg+xml");
  if (document.querySelector("parsererror")) {
    throw new Error("The icon sprite could not be parsed.");
  }
  return new Map(
    Array.from(document.querySelectorAll("symbol"), (symbol) => [
      symbol.id,
      Array.from(symbol.children, readShape),
    ]),
  );
}

function renderShape(shape: SvgShape, index: number): React.ReactNode {
  return React.createElement(
    shape.tag,
    { ...shape.attributes, key: index },
    ...shape.children.map(renderShape),
  );
}

function shapeJsx(shape: SvgShape, depth = 1): string {
  const indent = "  ".repeat(depth);
  const attributes = Object.entries(shape.attributes)
    .map(([name, value]) => `${name}={${JSON.stringify(value)}}`)
    .join(" ");
  const opening = `${indent}<${shape.tag}${attributes ? ` ${attributes}` : ""}`;
  if (!shape.children.length) return `${opening} />`;
  return `${opening}>\n${shape.children.map((child) => shapeJsx(child, depth + 1)).join("\n")}\n${indent}</${shape.tag}>`;
}

export function iconJsx(
  shapes: SvgShape[],
  size: number,
  strokeWidth: number,
): string {
  return [
    "<svg",
    `  width={${size}}`,
    `  height={${size}}`,
    '  viewBox="0 0 24 24"',
    '  fill="none"',
    '  stroke="currentColor"',
    `  strokeWidth={${strokeWidth}}`,
    '  strokeLinecap="square"',
    '  strokeLinejoin="miter"',
    '  aria-hidden="true"',
    '  focusable="false"',
    ">",
    ...shapes.map((shape) => shapeJsx(shape)),
    "</svg>",
  ].join("\n");
}

export function IconDrawing({
  shapes,
  size,
  strokeWidth,
  grid = false,
  name,
}: {
  shapes: SvgShape[];
  size: number;
  strokeWidth: number;
  grid?: boolean;
  name?: string;
}) {
  const gridId = `icon-grid-${React.useId().replace(/:/g, "")}`;
  return (
    <svg
      width={grid ? "100%" : size}
      height={grid ? "100%" : size}
      viewBox="0 0 24 24"
      role={grid ? "img" : undefined}
      aria-label={grid ? `${name} on a 24 by 24 grid` : undefined}
      aria-hidden={grid ? undefined : true}
      focusable="false"
    >
      {grid && (
        <>
          <defs>
            <pattern
              id={gridId}
              width="1"
              height="1"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M1 0H0V1"
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="0.08"
              />
            </pattern>
          </defs>
          <rect width="24" height="24" fill={`url(#${gridId})`} />
          <path
            d="M12 0v24M0 12h24"
            stroke="var(--border-strong)"
            strokeWidth="0.16"
          />
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            fill="none"
            stroke="var(--border-brand)"
            strokeWidth="0.15"
            strokeDasharray="0.5 0.5"
          />
        </>
      )}
      {/* Inline paths let the preview vary weight without changing sprite defaults. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        {shapes.map(renderShape)}
      </g>
    </svg>
  );
}
