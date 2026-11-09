import * as React from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { DataGrid, type DataGridColumn } from "./index";

type Row = { id: string; name: string; group: string; score: number };
const initial: Row[] = Array.from({ length: 50 }, (_, i) => ({ id: String(i), name: `사용자 ${i + 1}`, group: i % 2 ? "A" : "B", score: i }));
const columns: DataGridColumn<Row>[] = [
  { id: "name", header: "이름", accessor: row => row.name, flex: 2, minWidth: 180, maxWidth: 4096, sortable: true, filter: "text", editable: true, resizable: true },
  { id: "group", header: "그룹", accessor: row => row.group, flex: 1, minWidth: 120, maxWidth: 4096, sortable: true, filter: "select", filterOptions: [{value:"A",label:"A"},{value:"B",label:"B"}] },
  { id: "score", header: "점수", accessor: row => row.score, width: 140, sortable: true, filter: "number", align: "end" },
];
function Example({ virtualized = false }: { virtualized?: boolean }) {
  const [rows, setRows] = React.useState(initial);
  return <DataGrid label="사용자 목록" rows={rows} columns={columns} getRowId={row => row.id} searchable selectable showColumnFilterToggle showColumnVisibility showDensityToggle exportable exportFormats={["csv", "xlsx"]} virtualized={virtualized} pagination={!virtualized} maxHeight={virtualized ? 400 : undefined} onCellEdit={({rowId, columnId, value}) => setRows(current => current.map(row => row.id === rowId ? { ...row, [columnId]: value } : row))} />;
}
export default { title: "Components/DataGrid", component: DataGrid };
export const Default = { render: () => <Example /> };
export const Virtualized = { render: () => <Example virtualized /> };
export const Loading = { render: () => <DataGrid label="사용자 목록" rows={initial} columns={columns} getRowId={row => row.id} loading /> };
export const Error = { render: () => <DataGrid label="사용자 목록" rows={initial} columns={columns} getRowId={row => row.id} error="데이터를 불러오지 못했습니다." onRetry={() => {}} /> };
export const Empty = { render: () => <DataGrid label="사용자 목록" rows={[]} columns={columns} getRowId={row => row.id} /> };
export const MultiSelectFilter = { render: () => <DataGrid label="사용자 목록" rows={initial} columns={columns.map(column => column.id === "group" ? { ...column, filter: "multi-select" as const } : column)} getRowId={row => row.id} showColumnFilterToggle /> };

export const GridInteractions = {
  render: () => <Example />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole("searchbox", { name: "검색" });
    await userEvent.type(search, "사용자 12");
    await expect(canvas.getByText("사용자 12", { exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "검색 초기화" }));
    await userEvent.click(canvas.getByRole("button", { name: /^이름$/ }));
    await expect(canvas.getByRole("columnheader", { name: /이름/ })).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(canvas.getByRole("checkbox", { name: "0 선택" }));
    await expect(canvas.getByText("1개 선택됨")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "0 이름 편집" }));
    const editor = canvas.getByRole("textbox", { name: "이름" });
    await userEvent.clear(editor);
    await userEvent.type(editor, "사용자 1 수정");
    await userEvent.click(canvas.getByRole("button", { name: "이름 저장" }));
    await expect(canvas.getByText("사용자 1 수정", { exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "컬럼 필터" }));
    await userEvent.type(canvas.getByRole("textbox", { name: "이름 필터" }), "사용자 12");
    await expect(canvas.getByText("사용자 12", { exact: true })).toBeVisible();
  },
};

export const VirtualScrollbarInteraction = {
  render: () => <Example virtualized />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const scrollbar = await canvas.findByRole("scrollbar", { name: "사용자 목록 세로 스크롤" });
    scrollbar.focus();
    await userEvent.keyboard("{End}");
    await waitFor(() => expect(canvas.getByText("사용자 50", { exact: true })).toBeVisible());
  },
};

export const ToolbarSizes = {
  render: () => <div>{(["sm", "md", "lg"] as const).map(size => <DataGrid key={size} label={`크기 ${size}`} rows={initial.slice(0, 2)} columns={columns} getRowId={row => row.id} toolbarSize={size} />)}</div>,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    for (const [size, height] of [["sm", 30], ["md", 36], ["lg", 42]] as const) {
      const grid = canvas.getByRole("group", { name: `크기 ${size}` });
      const search = within(grid).getByRole("searchbox", { name: "검색" });
      const toolbar = grid.querySelector(".data-grid-tools");
      const button = within(grid).getByRole("button", { name: "촘촘한 행 간격" });
      if (!toolbar || !search.parentElement) throw new globalThis.Error("Missing toolbar controls");
      await expect(search.parentElement.getBoundingClientRect().height).toBeCloseTo(height, 0);
      await expect(button.getBoundingClientRect().height).toBeCloseTo(height, 0);
      await expect(getComputedStyle(toolbar).getPropertyValue("--control-height").trim()).toBeTruthy();
    }
  },
};

export const PinnedColumnInteraction = {
  render: () => <div style={{ width: 300 }}><DataGrid label="고정 열" rows={initial.slice(0, 3)} columns={columns.map((column, index) => ({ ...column, flex: undefined, width: 220, pinned: index === 0 ? "start" as const : undefined }))} getRowId={row => row.id} /></div>,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const resize = canvas.getByRole("separator", { name: "이름 열 너비" });
    const previous = Number(resize.getAttribute("aria-valuenow"));
    resize.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(Number(resize.getAttribute("aria-valuenow"))).toBe(previous + 10);
    const scrollbar = await canvas.findByRole("scrollbar", { name: "고정 열 가로 스크롤" });
    scrollbar.focus();
    await userEvent.keyboard("{End}");
    await waitFor(() => expect(Number(scrollbar.getAttribute("aria-valuenow"))).toBeGreaterThan(0));
  },
};

export const ResponsiveFill = {
  render: () => <div data-testid="grid-frame" style={{ width: "100%", maxWidth: 1000 }}><DataGrid label="반응형 표" rows={initial.slice(0, 3)} columns={columns} getRowId={row => row.id} selectable /></div>,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId("grid-frame");
    const scroll = canvas.getByRole("region", { name: "반응형 표 표" });
    const table = canvas.getByRole("table", { name: "반응형 표" });
    await waitFor(() => expect(Math.abs(table.getBoundingClientRect().width - scroll.clientWidth)).toBeLessThanOrEqual(1));
    await expect(scroll.scrollWidth).toBeLessThanOrEqual(scroll.clientWidth + 1);
    frame.style.width = "300px";
    await waitFor(() => expect(scroll.scrollWidth).toBeGreaterThan(scroll.clientWidth));
    frame.style.width = "100%";
    await waitFor(() => expect(Math.abs(table.getBoundingClientRect().width - scroll.clientWidth)).toBeLessThanOrEqual(1));
    await expect(scroll.scrollWidth).toBeLessThanOrEqual(scroll.clientWidth + 1);
    const resize = canvas.getByRole("separator", { name: "이름 열 너비" });
    const before = Number(resize.getAttribute("aria-valuenow"));
    resize.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(Number(resize.getAttribute("aria-valuenow"))).toBe(before + 10);
    await waitFor(() => expect(Math.abs(table.getBoundingClientRect().width - scroll.clientWidth)).toBeLessThanOrEqual(1));
  },
};
