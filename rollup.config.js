import { defineConfig } from "rollup";
import path from "path";

import externals from "rollup-plugin-node-externals";
import replace from "@rollup/plugin-replace";
import resolve, {
  DEFAULTS as RESOLVE_DEFAULTS,
} from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";

import typescript from "rollup-plugin-typescript2";
import ts from "typescript";
import dts from "rollup-plugin-dts";

import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import sourceMaps from "rollup-plugin-sourcemaps";

import babel from "@rollup/plugin-babel";
import { DEFAULT_EXTENSIONS as DEFAULT_BABEL_EXTENSIONS } from "@babel/core";

import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";

import packageJSON from "./package.json";

const input = "./src/index.tsx";
const outDir = "dist";

const tsconfigPath = "./tsconfig.json";
const tsconfigJSON = ts.readConfigFile(tsconfigPath, ts.sys.readFile).config;
const tsCompilerOptions = ts.parseJsonConfigFileContent(
  tsconfigJSON,
  ts.sys,
  "./"
).options;

// 安全的包名称
const safePackageName = (name) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, "");

const pkgName = safePackageName(packageJSON.name);

// 数组元素去除重复
const uniq = (a) => [...new Set(a)];

// 输出的文件名
const outputName = ({
  outDir,
  name,
  format,
  env,
  shouldMinify,
  fileExtension,
}) =>
  [`${outDir}/${name}`, format, env, shouldMinify ? "min" : "", fileExtension]
    .filter(Boolean)
    .join(".");

const plugins = ({ env, isEsm, format, shouldMinify, writeMeta }) => [
  externals({ deps: true }),
  typeof env !== "undefined" &&
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify(env),
    }),
  json(),
  resolve({
    mainFields: ["module", "main"],
    extensions: uniq([
      ...RESOLVE_DEFAULTS.extensions,
      ".cjs",
      ".mjs",
      ".jsx",
      "ts",
      "tsx",
    ]),
  }),

  // CJS to ESM
  commonjs({
    //   // use a regex to make sure to include eventual hoisted packages
    //   include:
    //     //   opts.format === 'umd'
    //     //     ? /\/node_modules\//
    //     //     : /\/regenerator-runtime\//,
    //     /\/regenerator-runtime\//,
  }),

  typescript({
    typescript: ts,
    tsconfig: tsconfigPath,
    tsconfigDefaults: {
      exclude: [
        // all TS test files, regardless whether co-located or in test/ etc
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/*.spec.tsx",
        "**/*.test.tsx",
        "**/*.stories.tsx",

        // TS defaults below
        "node_modules",
        "bower_components",
        "jspm_packages",

        outDir,
      ],
      compilerOptions: {
        sourceMap: true,
        declaration: true,
        jsx: "react",
      },
    },
    tsconfigOverride: {
      compilerOptions: {
        // TS -> esnext, then leave the rest to babel-preset-env
        target: "esnext",
        // don't output declarations more than once
        ...(!writeMeta ? { declaration: false, declarationMap: false } : {}),
      },
    },
    check: writeMeta,
    useTsconfigDeclarationDir: writeMeta,
  }),
  !isEsm &&
    babel({
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            loose: true,
          },
        ],
        "@babel/preset-react",
      ],
      plugins: [
        ["babel-plugin-polyfill-regenerator", { method: "usage-pure" }],
      ],

      exclude: "node_modules/**",
      extensions: [...DEFAULT_BABEL_EXTENSIONS, ".ts", ".tsx"],
      passPerPreset: true,
      babelHelpers: "bundled",
    }),

  sourceMaps(),
  shouldMinify &&
    terser({
      output: { comments: false },
      compress: {
        keep_infinity: true,
        pure_getters: true,
        passes: 10,
      },
      ecma: 2020,
      module: isEsm,
      toplevel: true,
      warnings: true,
    }),

  postcss({
    extract: writeMeta && path.resolve(`${outDir}/${pkgName}.css`),
    inject: false,
    modules: { generateScopedName: "[local]___[hash:base64:5]" },
    minimize: true,
    plugins: [autoprefixer()],
  }),
];

const config = defineConfig([
  /**
   * 作用：
   *    清理 dist
   *    copy 模板文件
   * 注：需要放置在第一个
   */
  {
    input: "template/index.js.txt",
    output: { file: `${outDir}/index.js`, format: "cjs" },
    plugins: [
      del({ targets: outDir, hook: "buildStart" }),
      replace({
        preventAssignment: true,
        "process.env.__BUILD_CJS_PRODUCTION__": JSON.stringify(
          outputName({
            outDir: ".",
            name: pkgName,
            format: "cjs",
            env: "production",
            shouldMinify: true,
            fileExtension: "js",
          })
        ),
        "process.env.__BUILD_CJS_DEVELOPMENT__": JSON.stringify(
          outputName({
            outDir: ".",
            name: pkgName,
            format: "cjs",
            env: "development",
            shouldMinify: false,
            fileExtension: "js",
          })
        ),
      }),
    ],
  },
  /**
   * format: ”cjs”,
   * env: ”development”,
   */
  {
    input,
    treeshake: { propertyReadSideEffects: false },
    output: {
      file: outputName({
        outDir,
        name: pkgName,
        format: "cjs",
        env: "development",
        shouldMinify: false,
        fileExtension: "js",
      }),
      format: "cjs",
      freeze: false,
      esModule: Boolean(tsCompilerOptions?.esModuleInterop),
      name: pkgName,
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
    },
    plugins: plugins({
      env: "development",
      isEsm: false,
      format: "cjs",
      shouldMinify: false,
      writeMeta: false,
    }),
  },
  /**
   * format: “cjs“
   * env: “production“
   */
  {
    input,
    treeshake: { propertyReadSideEffects: false },
    output: {
      file: outputName({
        outDir,
        name: pkgName,
        format: "cjs",
        env: "production",
        shouldMinify: true,
        fileExtension: "js",
      }),
      format: "cjs",
      freeze: false,
      esModule: Boolean(tsCompilerOptions?.esModuleInterop),
      name: pkgName,
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
    },
    plugins: plugins({
      env: "production",
      isEsm: false,
      format: "cjs",
      shouldMinify: true,
      writeMeta: false,
    }),
  },
  /**
   * format: "esm"
   */
  {
    input,
    treeshake: { propertyReadSideEffects: false },
    output: {
      file: outputName({
        outDir,
        name: pkgName,
        format: "esm",
        env: undefined,
        shouldMinify: false,
        fileExtension: "js",
      }),
      format: "esm",
      freeze: false,
      esModule: Boolean(tsCompilerOptions?.esModuleInterop),
      name: pkgName,
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
    },
    plugins: plugins({
      env: undefined,
      isEsm: true,
      format: "esm",
      shouldMinify: false,
      writeMeta: true,
    }),
  },
  /**
   * 作用：
   *    汇总.d.ts文件到index.d.ts
   *    清理目录 $outDir/dts
   * 注：需要放置在最后一个
   */
  {
    input: `${outDir}/dts/index.d.ts`,
    output: { file: `${outDir}/index.d.ts`, format: "es" },
    plugins: [dts(), del({ targets: `${outDir}/dts`, hook: "buildEnd" })],
  },
]);

export default config;
