import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The @idenflu/* workspace packages ship source-only TSX/CSS. As linked
// workspace deps, Vite serves them through its normal transform pipeline
// (esbuild for .tsx), which validates the source-only consumption model.
export default defineConfig({
  plugins: [react()],
  build: {
    // Never inline SVGs: the icon sprite must stay an external file so
    // `<use href="…icons.svg#icon-name">` resolves (browsers refuse
    // data-URL + fragment external references).
    assetsInlineLimit: (filePath) => (filePath.endsWith(".svg") ? false : undefined),
  },
});
