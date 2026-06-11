import StyleDictionary from "style-dictionary";

const BASE_SOURCE = [
  "spacing/tokens.json",
  "typography/tokens.json",
  "layout/tokens.json",
  "border-radius/tokens.json",
];

const themes = [
  {
    id: "light",
    source: [...BASE_SOURCE, "theme/light.tokens.json"],
    destination: "_variables-light.css",
    selector: ":root",
  },
  {
    id: "dark",
    source: [...BASE_SOURCE, "theme/dark.tokens.json"],
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
        buildPath: "src/css/",
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
