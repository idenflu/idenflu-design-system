import { Badge } from "./Badge";
export default { title: "Components/Badge", component: Badge };
export const Default = { args: { children: "Badge" } };
export const Success = { args: { children: "Success", variant: "success" } };
export const Solid = { args: { children: "Warning", variant: "warning", appearance: "solid" } };
