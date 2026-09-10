import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      ".tmp-possibilities/**",
      "SciLoop_Demo_Package/**",
      "sciloop_first_launch/**",
      "docs/**",
      "server/**",
      "backend/reality-engine/**",
      "public/**/*.js",
      "deck-dom.html",
      "sciloop-*.js",
      "sciloopUnityBridge.js",
      "sciloop-experience.js",
      "sciloop-experience.css",
      "SciLoop - Live Scientific Discoveries.html",
      "SciLoop - Live Scientific Discoveries 80.html",
      "SciLoop - Live Scientific Discoveries_files/**",
      "*.png",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
];

export default config;
