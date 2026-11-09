import { NumberField } from "./NumberField";
export default { title: "Components/NumberField", component: NumberField };
export const Default = { args: { label: "Amount", defaultValue: "100", grouping: true } };
export const Decimal = { args: { label: "Price", defaultValue: "12.50", decimals: 2, step: "0.01" } };
