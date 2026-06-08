import StyleDictionary from "style-dictionary";

const BASE_SOURCE = ["tokens/base/**/*.json"];

const themes = [
  {
    id: "light",
    source: [...BASE_SOURCE, "tokens/themes/light.tokens.json"],
    destination: "_variables-light.css",
    selector: ":root",
  },
  {
    id: "dark",
    source: [...BASE_SOURCE, "tokens/themes/dark.tokens.json"],
    destination: "_variables-dark.css",
    selector: ".dark",
  },
];

for (const theme of themes) {
  const sd = new StyleDictionary({
    source: theme.source,
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: "build/css/",
        files: [
          {
            destination: theme.destination,
            format: "css/variables",
            options: {
              outputReferences: true,
              selector: theme.selector,
            },
          },
        ],
      },
    },
  });

  await sd.buildPlatform("css");
}
