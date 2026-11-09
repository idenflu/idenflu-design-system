import { FileUpload } from "./FileUpload";
export default { title: "Components/FileUpload", component: FileUpload };
export const Default = {};
export const Restricted = { args: { accept: "image/*", maxSizeBytes: 1048576, multiple: true } };
