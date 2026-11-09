import * as React from "react";
import { Pagination } from "./Pagination";
export default { title: "Components/Pagination", component: Pagination };
export const Default = { render: () => { const [page, setPage] = React.useState(5); return <Pagination page={page} pageCount={10} onPageChange={setPage} />; } };
