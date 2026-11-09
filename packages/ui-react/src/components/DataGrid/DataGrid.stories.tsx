import * as React from "react";
import { DataGrid, type DataGridColumn } from "./index";

type Row = { id: string; name: string; group: string; score: number };
const initial: Row[] = Array.from({ length: 50 }, (_, i) => ({ id: String(i), name: `사용자 ${i + 1}`, group: i % 2 ? "A" : "B", score: i }));
const columns: DataGridColumn<Row>[] = [
  { id: "name", header: "이름", accessor: row => row.name, sortable: true, filter: "text", editable: true, resizable: true },
  { id: "group", header: "그룹", accessor: row => row.group, sortable: true, filter: "select", filterOptions: [{value:"A",label:"A"},{value:"B",label:"B"}] },
  { id: "score", header: "점수", accessor: row => row.score, sortable: true, filter: "number", align: "end" },
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
