import { DataState } from "./DataState";
export default { title: "Components/DataState", component: DataState };
export const Default = { render: () => <DataState initialItems={["Apple", "Pear"]} load={async () => ["Apple", "Pear"]} matches={(item, query) => item.toLowerCase().includes(query.toLowerCase())} getKey={(item) => item} renderItem={(item) => item} /> };
