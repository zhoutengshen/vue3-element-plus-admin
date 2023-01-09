// config/vite.config.dev.ts
import { defineConfig as defineConfig2, mergeConfig } from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/vite/dist/node/index.js";

// config/vite.config.base.ts
import { fileURLToPath, URL } from "node:url";
import DefineOptions from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/unplugin-vue-define-options/dist/vite.mjs";
import { defineConfig } from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import Icons from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/unplugin-icons/dist/resolver.mjs";

// vite-plugin/router-helper/index.ts
import "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/vite/dist/node/index.js";

// vite-plugin/router-helper/utils.ts
import { ts as ts2 } from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/ts-morph/dist/ts-morph.js";
import fs from "node:fs";

// vite-plugin/router-helper/core.ts
import { Project, ts } from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/ts-morph/dist/ts-morph.js";
import { parse, compileScript } from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
var vueSFCIndex = 1;
var getPageParamNameFromSFC = (filePath) => {
  const checkHasExportPageParams = (arr = []) => {
    return arr.some((item) => {
      var _a, _b;
      const isScriptExport = item.type === "ExportNamedDeclaration" && ((_b = (_a = item == null ? void 0 : item.declaration) == null ? void 0 : _a.id) == null ? void 0 : _b.name) === "PageParams";
      return isScriptExport;
    });
  };
  const file = readFileSync(filePath, "utf-8");
  const parseResult = parse(file);
  if (!parseResult.descriptor.script && !parseResult.descriptor.scriptSetup) {
    return;
  }
  const script = compileScript(parseResult.descriptor, { id: `test_${vueSFCIndex}` });
  const hasExportPageParams = checkHasExportPageParams([...script.scriptAst || [], ...script.scriptSetupAst || []]);
  return hasExportPageParams ? `PageParam_${vueSFCIndex}` : void 0;
};
var Transform = class {
  constructor(option) {
    this.option = option;
    this.init(option);
  }
  _resultsMap = {};
  _project;
  _cacheMethodNames = {};
  _transformingFilePath;
  init(ops) {
    this._project = new Project({
      tsConfigFilePath: ops.tsConfigJsonPath
    });
    this._project.addSourceFilesAtPaths(ops.sourceFiles);
  }
  transform(path) {
    this._transformingFilePath = path;
    const sourceFile = this._project.getSourceFile(path);
    if (sourceFile) {
      const value = this.transform4One(sourceFile);
      this.dealWithResult(value);
    }
  }
  getResultList(path) {
    if (path) {
      const fileResultMap = this._resultsMap[path];
      return fileResultMap ? Object.values(fileResultMap) : [];
    }
    return Object.values(this._resultsMap).reduce((preList, nextObj) => {
      preList.push(...Object.values(nextObj));
      return preList;
    }, Array());
  }
  transform4One(routeSourceFile) {
    const resultList = [];
    const classCtx = this;
    transformWidthState(routeSourceFile, {
      init: () => ({ paths: [], navHandleName: "" }),
      visiting: {
        ObjectLiteralExpression(node, state) {
          var _a;
          if (!ts.isObjectLiteralExpression(node)) {
            return;
          }
          const pathProNode = node.properties.find((item) => {
            var _a2;
            return ((_a2 = item.name) == null ? void 0 : _a2.getText()) === "path";
          });
          if (!pathProNode || !ts.isPropertyAssignment(pathProNode)) {
            return;
          }
          const exprValue = pathProNode.initializer.getText();
          const result = {
            paths: [...state.paths, exprValue],
            navHandleName: ""
          };
          const handleNameProNode = node.properties.find((item) => {
            var _a2;
            return ((_a2 = item.name) == null ? void 0 : _a2.getText()) === "navHandleName";
          });
          if (!handleNameProNode) {
            result.navHandleName = classCtx.getRealMethodName(void 0, result.paths);
          }
          if (handleNameProNode && ts.isPropertyAssignment(handleNameProNode) && ts.isStringLiteral(handleNameProNode.initializer)) {
            const handleName = handleNameProNode.initializer.getText();
            result.navHandleName = classCtx.getRealMethodName(handleName, result.paths);
          }
          const compNode = node.properties.find((item) => {
            var _a2;
            return ((_a2 = item.name) == null ? void 0 : _a2.getText()) === "component";
          });
          if (compNode) {
            const importText = compNode.getText();
            const matchImportPathReg = /import\((.+?)\)/;
            const importPath = (_a = importText.match(matchImportPathReg)) == null ? void 0 : _a[1];
            if (importPath) {
              classCtx.getPageParamName(importPath.replace(quotesWrapReg, "$1"));
            }
          }
          resultList.push(result);
          return {
            node,
            state: result
          };
        }
      }
    });
    return resultList;
  }
  dealWithResult(newList) {
    if (!this._transformingFilePath) {
      return;
    }
    const pathResultMap = newList.reduce((pre, next) => {
      const result = this.mapState2Result(next);
      pre[result.path] = result;
      return pre;
    }, {});
    this._resultsMap[this._transformingFilePath] = pathResultMap;
  }
  getRealMethodName(originName, paths) {
    if (!originName) {
      if (paths == null ? void 0 : paths.length) {
        const isAllLiteralStr = !paths.some((item) => !isQuotesWrap(item));
        if (isAllLiteralStr) {
          originName = paths.map((item) => convertTitleCase(item.replace("/", "").replace(quotesWrapReg, "$1"))).join("");
        }
      }
    }
    if (!originName) {
      originName = `handleNavToPage_${Math.abs(Math.random() * Number.MAX_SAFE_INTEGER)}`;
    }
    originName = originName.replace(quotesWrapReg, "$1").trim();
    const count = this._cacheMethodNames[originName];
    if (count !== void 0) {
      this._cacheMethodNames[originName] = count + 1;
      return `${originName}${count + 1}`;
    }
    return originName;
  }
  mapState2Result(state) {
    return {
      path: this.dealWithPath(state.paths),
      navHandleName: state.navHandleName
    };
  }
  dealWithPath(paths) {
    const isAllLiteralStr = !paths.some((item) => !isQuotesWrap(item));
    if (isAllLiteralStr) {
      const value = paths.map((item) => item.replace(quotesWrapReg, "$1").trim()).join("/").replace(/\\+/, "\\");
      return `"${value}"`;
    }
    return paths.join(" + ");
  }
  getPageParamName(filePath) {
    const realFilePath = join(this.option.baseUrl, filePath.replace("@", "./src/"));
    console.log(">>>>>>>>>>>");
    if (!checkSourceFilesExist([realFilePath])) {
      return;
    }
    const pageParamsName = getPageParamNameFromSFC(filePath);
    console.log(realFilePath);
  }
};

// vite-plugin/router-helper/utils.ts
import { normalizePath } from "file:///C:/Users/17248/Desktop/vue3-admin/node_modules/vite/dist/node/index.js";
var isKindVisiting = (target) => {
  if (typeof target === "object") {
    return true;
  }
  target = target;
  return !Object.values(target).some((item) => typeof item !== "function");
};
var transformWidthState = (sourceFile, options) => {
  if (!sourceFile) {
    return;
  }
  const execVisiting = (node, state, visitingOps) => {
    let visitingFunc;
    let eachVisitingFunc;
    if (isKindVisiting(visitingOps)) {
      eachVisitingFunc = visitingOps["each"];
      const kindName = ts2.SyntaxKind[node.kind];
      visitingFunc = visitingOps[kindName];
    } else {
      visitingFunc = visitingOps;
    }
    let result;
    if (eachVisitingFunc) {
      result = eachVisitingFunc(node, state);
    }
    if (visitingFunc) {
      result = visitingFunc(node, (result == null ? void 0 : result.state) || state);
    }
    return result;
  };
  const { init, visited = () => void 0, visiting = (node, state) => ({ node, state }) } = options;
  const stateQueue = [];
  sourceFile.transform((ttc) => {
    const fatherState = stateQueue[stateQueue.length - 1] || init();
    const result = execVisiting(ttc.currentNode, fatherState, visiting);
    if ((result == null ? void 0 : result.behavior) === "stop") {
      return ttc.currentNode;
    }
    if ((result == null ? void 0 : result.behavior) === "replace") {
      return result.node;
    }
    stateQueue.push((result == null ? void 0 : result.state) || fatherState);
    const oneNode = ttc.visitChildren();
    stateQueue.pop();
    visited(oneNode, fatherState);
    return oneNode;
  });
};
var checkSourceFilesExist = (filePaths) => {
  const result = filePaths.find((filePath) => {
    return !fs.existsSync(filePath);
  });
  if (result) {
    console.error(`\u6587\u4EF6 ${result} \u4E0D\u5B58\u5728`);
  }
  return !result;
};
var dealWithPluginOption = (ops) => {
  return {
    ...ops,
    sourceFiles: ops.sourceFiles.map((item) => normalizePath(item))
  };
};
var quotesWrapReg = /^["'`](.+?)["'`]$/;
var isQuotesWrap = (target) => {
  if (!target) {
    return false;
  }
  return quotesWrapReg.test(target);
};
var convertTitleCase = (str) => {
  if (!str) {
    return str;
  }
  const firstChar = str[0].toUpperCase();
  if (str.length === 1) {
    return firstChar;
  }
  return `${firstChar}${str.substring(1)}`;
  return str;
};

// vite-plugin/router-helper/index.ts
var VITE_PLUGIN_NAME = "vite:router-helper";
var router_helper_default = (ops) => {
  ops = dealWithPluginOption(ops);
  if (!checkSourceFilesExist(ops.sourceFiles)) {
    return {
      name: VITE_PLUGIN_NAME
    };
  }
  const transform = new Transform(ops);
  return {
    name: VITE_PLUGIN_NAME,
    config() {
    },
    configResolved() {
    },
    transform(code, id) {
      if (ops.sourceFiles.includes(id)) {
        transform.transform(id);
      }
    },
    watchChange() {
    },
    closeBundle() {
      console.log(transform.getResultList());
    }
  };
};

// config/vite.config.base.ts
import { join as join2, resolve } from "node:path";
var __vite_injected_original_import_meta_url = "file:///C:/Users/17248/Desktop/vue3-admin/config/vite.config.base.ts";
var rootDir = fileURLToPath(new URL("..", __vite_injected_original_import_meta_url));
var vite_config_base_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    DefineOptions(),
    AutoImport({
      resolvers: [ElementPlusResolver(), IconsResolver({ prefix: "Icon" })],
      dts: resolve("@types", "auto-imports.d.ts")
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver({ enabledCollections: ["ep"] })],
      dts: resolve("@types", "components.d.ts")
    }),
    Icons({
      autoInstall: true
    }),
    router_helper_default({
      tsConfigJsonPath: join2(rootDir, "tsconfig.json"),
      baseUrl: rootDir,
      sourceFiles: [
        join2(rootDir, "src/router/routes/modules/user.ts"),
        join2(rootDir, "src/router/routes/modules/dashboard.ts")
      ]
    })
  ],
  resolve: {
    alias: {
      "@": resolve(rootDir, "src"),
      stores: resolve(rootDir, "src/stores")
    }
  },
  define: {
    "process.env": {}
  }
});

// config/vite.config.dev.ts
var vite_config_dev_default = mergeConfig(
  defineConfig2({
    mode: "development",
    root: process.cwd(),
    server: {
      open: false,
      fs: {
        strict: true
      }
    }
  }),
  vite_config_base_default
);
export {
  vite_config_dev_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29uZmlnL3ZpdGUuY29uZmlnLmRldi50cyIsICJjb25maWcvdml0ZS5jb25maWcuYmFzZS50cyIsICJ2aXRlLXBsdWdpbi9yb3V0ZXItaGVscGVyL2luZGV4LnRzIiwgInZpdGUtcGx1Z2luL3JvdXRlci1oZWxwZXIvdXRpbHMudHMiLCAidml0ZS1wbHVnaW4vcm91dGVyLWhlbHBlci9jb3JlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcMTcyNDhcXFxcRGVza3RvcFxcXFx2dWUzLWFkbWluXFxcXGNvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcMTcyNDhcXFxcRGVza3RvcFxcXFx2dWUzLWFkbWluXFxcXGNvbmZpZ1xcXFx2aXRlLmNvbmZpZy5kZXYudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLzE3MjQ4L0Rlc2t0b3AvdnVlMy1hZG1pbi9jb25maWcvdml0ZS5jb25maWcuZGV2LnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBtZXJnZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdml0ZUJhc2VDb25maWcgZnJvbSAnLi92aXRlLmNvbmZpZy5iYXNlJ1xuXG5leHBvcnQgZGVmYXVsdCBtZXJnZUNvbmZpZyhcbiAgZGVmaW5lQ29uZmlnKHtcbiAgICBtb2RlOiAnZGV2ZWxvcG1lbnQnLFxuICAgIHJvb3Q6IHByb2Nlc3MuY3dkKCksXG4gICAgc2VydmVyOiB7XG4gICAgICBvcGVuOiBmYWxzZSxcbiAgICAgIGZzOiB7XG4gICAgICAgIHN0cmljdDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSksXG4gIHZpdGVCYXNlQ29uZmlnLFxuKVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxNzI0OFxcXFxEZXNrdG9wXFxcXHZ1ZTMtYWRtaW5cXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxNzI0OFxcXFxEZXNrdG9wXFxcXHZ1ZTMtYWRtaW5cXFxcY29uZmlnXFxcXHZpdGUuY29uZmlnLmJhc2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLzE3MjQ4L0Rlc2t0b3AvdnVlMy1hZG1pbi9jb25maWcvdml0ZS5jb25maWcuYmFzZS50c1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0IERlZmluZU9wdGlvbnMgZnJvbSAndW5wbHVnaW4tdnVlLWRlZmluZS1vcHRpb25zL3ZpdGUnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSdcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xuaW1wb3J0IHJvdXRlckhlbHBlclBsdWdpbiBmcm9tICcuLi92aXRlLXBsdWdpbi9yb3V0ZXItaGVscGVyL2luZGV4J1xuaW1wb3J0IHsgam9pbiwgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCdcblxuY29uc3Qgcm9vdERpciA9IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi4nLCBpbXBvcnQubWV0YS51cmwpKVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIHZ1ZUpzeCgpLFxuICAgIERlZmluZU9wdGlvbnMoKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKSwgSWNvbnNSZXNvbHZlcih7IHByZWZpeDogJ0ljb24nIH0pXSxcbiAgICAgIGR0czogcmVzb2x2ZSgnQHR5cGVzJywgJ2F1dG8taW1wb3J0cy5kLnRzJyksXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCksIEljb25zUmVzb2x2ZXIoeyBlbmFibGVkQ29sbGVjdGlvbnM6IFsnZXAnXSB9KV0sXG4gICAgICBkdHM6IHJlc29sdmUoJ0B0eXBlcycsICdjb21wb25lbnRzLmQudHMnKSxcbiAgICB9KSxcbiAgICBJY29ucyh7XG4gICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcbiAgICB9KSxcbiAgICByb3V0ZXJIZWxwZXJQbHVnaW4oe1xuICAgICAgdHNDb25maWdKc29uUGF0aDogam9pbihyb290RGlyLCAndHNjb25maWcuanNvbicpLFxuICAgICAgYmFzZVVybDogcm9vdERpcixcbiAgICAgIHNvdXJjZUZpbGVzOiBbXG4gICAgICAgIGpvaW4ocm9vdERpciwgJ3NyYy9yb3V0ZXIvcm91dGVzL21vZHVsZXMvdXNlci50cycpLFxuICAgICAgICBqb2luKHJvb3REaXIsICdzcmMvcm91dGVyL3JvdXRlcy9tb2R1bGVzL2Rhc2hib2FyZC50cycpLFxuICAgICAgXSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUocm9vdERpciwgJ3NyYycpLFxuICAgICAgc3RvcmVzOiByZXNvbHZlKHJvb3REaXIsICdzcmMvc3RvcmVzJyksXG4gICAgfSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52Jzoge30sXG4gIH0sXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxNzI0OFxcXFxEZXNrdG9wXFxcXHZ1ZTMtYWRtaW5cXFxcdml0ZS1wbHVnaW5cXFxccm91dGVyLWhlbHBlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcMTcyNDhcXFxcRGVza3RvcFxcXFx2dWUzLWFkbWluXFxcXHZpdGUtcGx1Z2luXFxcXHJvdXRlci1oZWxwZXJcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzLzE3MjQ4L0Rlc2t0b3AvdnVlMy1hZG1pbi92aXRlLXBsdWdpbi9yb3V0ZXItaGVscGVyL2luZGV4LnRzXCI7aW1wb3J0IHsgUGx1Z2luIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGNoZWNrU291cmNlRmlsZXNFeGlzdCwgZGVhbFdpdGhQbHVnaW5PcHRpb24gfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IHsgUm91dGVySGVscGVyUGx1Z2luT3B0aW9uLCBUcmFuc2Zvcm0gfSBmcm9tICcuL2NvcmUnXG5cbmNvbnN0IFZJVEVfUExVR0lOX05BTUUgPSAndml0ZTpyb3V0ZXItaGVscGVyJ1xuXG5leHBvcnQgZGVmYXVsdCAob3BzOiBSb3V0ZXJIZWxwZXJQbHVnaW5PcHRpb24pOiBQbHVnaW4gPT4ge1xuICAvLyBcdTY4MzlcdTYzNkVcdTdDRkJcdTdFREZcdTUyMDdcdTYzNjJcdTRFM0FcdTRFMDBcdTgxRjRcdTc2ODRcdThERUZcdTVGODRcbiAgb3BzID0gZGVhbFdpdGhQbHVnaW5PcHRpb24ob3BzKVxuICBpZiAoIWNoZWNrU291cmNlRmlsZXNFeGlzdChvcHMuc291cmNlRmlsZXMpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFZJVEVfUExVR0lOX05BTUUsXG4gICAgfVxuICB9XG4gIGNvbnN0IHRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0ob3BzKVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogVklURV9QTFVHSU5fTkFNRSxcbiAgICBjb25maWcoKSB7fSxcbiAgICBjb25maWdSZXNvbHZlZCgpIHt9LFxuICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xuICAgICAgaWYgKG9wcy5zb3VyY2VGaWxlcy5pbmNsdWRlcyhpZCkpIHtcbiAgICAgICAgdHJhbnNmb3JtLnRyYW5zZm9ybShpZClcbiAgICAgIH1cbiAgICB9LFxuICAgIHdhdGNoQ2hhbmdlKCkge30sXG4gICAgY2xvc2VCdW5kbGUoKSB7XG4gICAgICBjb25zb2xlLmxvZyh0cmFuc2Zvcm0uZ2V0UmVzdWx0TGlzdCgpKVxuICAgIH0sXG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcMTcyNDhcXFxcRGVza3RvcFxcXFx2dWUzLWFkbWluXFxcXHZpdGUtcGx1Z2luXFxcXHJvdXRlci1oZWxwZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDE3MjQ4XFxcXERlc2t0b3BcXFxcdnVlMy1hZG1pblxcXFx2aXRlLXBsdWdpblxcXFxyb3V0ZXItaGVscGVyXFxcXHV0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8xNzI0OC9EZXNrdG9wL3Z1ZTMtYWRtaW4vdml0ZS1wbHVnaW4vcm91dGVyLWhlbHBlci91dGlscy50c1wiO2ltcG9ydCB7IHRzLCBOb2RlIH0gZnJvbSAndHMtbW9ycGgnXG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcydcbmltcG9ydCB7IFJvdXRlckhlbHBlclBsdWdpbk9wdGlvbiB9IGZyb20gJy4vY29yZSdcbmltcG9ydCB7IG5vcm1hbGl6ZVBhdGggfSBmcm9tICd2aXRlJ1xuXG50eXBlIFZpc2l0aW5nRnVuYzxULCBOIGV4dGVuZHMgdHMuTm9kZSA9IHRzLk5vZGU+ID0gKFxuICBub2RlOiBOLFxuICBtaWRTdGF0ZTogVCxcbikgPT4geyBub2RlOiBOOyBiZWhhdmlvcj86ICdzdG9wJyB8ICdyZXBsYWNlJzsgc3RhdGU6IFQgfSB8IHVuZGVmaW5lZCB8IHZvaWRcbnR5cGUgS2luZFZpc2l0aW5nS2V5ID0ga2V5b2YgdHlwZW9mIHRzLlN5bnRheEtpbmQgfCAnZWFjaCdcbnR5cGUgS2luZFZpc2l0aW5nUmVjb3JkPFQ+ID0ge1xuICBbUCBpbiBLaW5kVmlzaXRpbmdLZXldPzogVmlzaXRpbmdGdW5jPFQ+XG59XG5cbnR5cGUgVHJhbnNmb3JtV2lkdGhTdGF0ZU9wdGlvbjxUPiA9IHtcbiAgaW5pdDogKCkgPT4gVFxuICB2aXNpdGluZz86IFZpc2l0aW5nRnVuYzxUPiB8IEtpbmRWaXNpdGluZ1JlY29yZDxUPlxuICB2aXNpdGVkPzogVmlzaXRpbmdGdW5jPFQ+XG59XG5cbmV4cG9ydCBjb25zdCBpc0V4cG9ydERlZmF1bHQgPSAobm9kZTogdHMuTm9kZSk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gdHMuaXNFeHBvcnRBc3NpZ25tZW50KG5vZGUpICYmICFub2RlLmlzRXhwb3J0RXF1YWxzXG59XG5cbmNvbnN0IGlzS2luZFZpc2l0aW5nID0gPFQgZXh0ZW5kcyBhbnkgPSBhbnk+KHRhcmdldDogYW55KTogdGFyZ2V0IGlzIEtpbmRWaXNpdGluZ1JlY29yZDxUPiA9PiB7XG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgdGFyZ2V0ID0gdGFyZ2V0IGFzIEtpbmRWaXNpdGluZ1JlY29yZDxUPlxuICByZXR1cm4gIU9iamVjdC52YWx1ZXModGFyZ2V0KS5zb21lKChpdGVtKSA9PiB0eXBlb2YgaXRlbSAhPT0gJ2Z1bmN0aW9uJylcbn1cblxuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybVdpZHRoU3RhdGUgPSA8VCBleHRlbmRzIHVua25vd24gPSB1bmRlZmluZWQ+KFxuICBzb3VyY2VGaWxlOiBOb2RlIHwgdW5kZWZpbmVkLFxuICBvcHRpb25zOiBUcmFuc2Zvcm1XaWR0aFN0YXRlT3B0aW9uPFQ+LFxuKSA9PiB7XG4gIGlmICghc291cmNlRmlsZSkge1xuICAgIHJldHVyblxuICB9XG4gIGNvbnN0IGV4ZWNWaXNpdGluZyA9IChcbiAgICBub2RlOiB0cy5Ob2RlLFxuICAgIHN0YXRlOiBULFxuICAgIHZpc2l0aW5nT3BzOiBLaW5kVmlzaXRpbmdSZWNvcmQ8VD4gfCBWaXNpdGluZ0Z1bmM8VD4sXG4gICk6IFJldHVyblR5cGU8VmlzaXRpbmdGdW5jPFQ+PiA9PiB7XG4gICAgbGV0IHZpc2l0aW5nRnVuYzogVmlzaXRpbmdGdW5jPFQ+IHwgdW5kZWZpbmVkXG4gICAgbGV0IGVhY2hWaXNpdGluZ0Z1bmM6IFZpc2l0aW5nRnVuYzxUPiB8IHVuZGVmaW5lZFxuICAgIGlmIChpc0tpbmRWaXNpdGluZzxUPih2aXNpdGluZ09wcykpIHtcbiAgICAgIGVhY2hWaXNpdGluZ0Z1bmMgPSB2aXNpdGluZ09wc1snZWFjaCddXG4gICAgICBjb25zdCBraW5kTmFtZSA9IHRzLlN5bnRheEtpbmRbbm9kZS5raW5kXSBhcyBLaW5kVmlzaXRpbmdLZXlcbiAgICAgIHZpc2l0aW5nRnVuYyA9IHZpc2l0aW5nT3BzW2tpbmROYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICB2aXNpdGluZ0Z1bmMgPSB2aXNpdGluZ09wc1xuICAgIH1cbiAgICBsZXQgcmVzdWx0OiBSZXR1cm5UeXBlPFZpc2l0aW5nRnVuYzxUPj5cbiAgICBpZiAoZWFjaFZpc2l0aW5nRnVuYykge1xuICAgICAgcmVzdWx0ID0gZWFjaFZpc2l0aW5nRnVuYyhub2RlLCBzdGF0ZSlcbiAgICB9XG4gICAgaWYgKHZpc2l0aW5nRnVuYykge1xuICAgICAgcmVzdWx0ID0gdmlzaXRpbmdGdW5jKG5vZGUsIHJlc3VsdD8uc3RhdGUgfHwgc3RhdGUpXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICBjb25zdCB7IGluaXQsIHZpc2l0ZWQgPSAoKSA9PiB1bmRlZmluZWQsIHZpc2l0aW5nID0gKG5vZGUsIHN0YXRlKSA9PiAoeyBub2RlLCBzdGF0ZSB9KSB9ID0gb3B0aW9uc1xuICBjb25zdCBzdGF0ZVF1ZXVlOiAoVCB8IHVuZGVmaW5lZClbXSA9IFtdXG5cbiAgc291cmNlRmlsZS50cmFuc2Zvcm0oKHR0YykgPT4ge1xuICAgIGNvbnN0IGZhdGhlclN0YXRlID0gc3RhdGVRdWV1ZVtzdGF0ZVF1ZXVlLmxlbmd0aCAtIDFdIHx8IGluaXQoKVxuICAgIGNvbnN0IHJlc3VsdCA9IGV4ZWNWaXNpdGluZyh0dGMuY3VycmVudE5vZGUsIGZhdGhlclN0YXRlLCB2aXNpdGluZylcbiAgICBpZiAocmVzdWx0Py5iZWhhdmlvciA9PT0gJ3N0b3AnKSB7XG4gICAgICByZXR1cm4gdHRjLmN1cnJlbnROb2RlXG4gICAgfVxuICAgIGlmIChyZXN1bHQ/LmJlaGF2aW9yID09PSAncmVwbGFjZScpIHtcbiAgICAgIHJldHVybiByZXN1bHQubm9kZVxuICAgIH1cbiAgICAvLyBcdTcyQjZcdTYwMDFcdTRGMjBcdTkwMTJcdUZGMENcdTU5ODJcdTY3OUNcdTZDQTFcdTY3MDlcdThGRDRcdTU2REVcdTcyQjZcdTYwMDFcdUZGMENcdTdFRTdcdTYyN0ZcdTc5NTZcdTUxNDhcdTc2ODRcdTcyQjZcdTYwMDFcbiAgICBzdGF0ZVF1ZXVlLnB1c2gocmVzdWx0Py5zdGF0ZSB8fCBmYXRoZXJTdGF0ZSlcbiAgICBjb25zdCBvbmVOb2RlID0gdHRjLnZpc2l0Q2hpbGRyZW4oKVxuICAgIHN0YXRlUXVldWUucG9wKClcbiAgICB2aXNpdGVkKG9uZU5vZGUsIGZhdGhlclN0YXRlKVxuICAgIHJldHVybiBvbmVOb2RlXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCBjaGVja1NvdXJjZUZpbGVzRXhpc3QgPSAoZmlsZVBhdGhzOiBzdHJpbmdbXSkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBmaWxlUGF0aHMuZmluZCgoZmlsZVBhdGgpID0+IHtcbiAgICByZXR1cm4gIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpXG4gIH0pXG4gIGlmIChyZXN1bHQpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcdTY1ODdcdTRFRjYgJHtyZXN1bHR9IFx1NEUwRFx1NUI1OFx1NTcyOGApXG4gIH1cbiAgcmV0dXJuICFyZXN1bHRcbn1cblxuZXhwb3J0IGNvbnN0IGRlYWxXaXRoUGx1Z2luT3B0aW9uID0gKG9wczogUm91dGVySGVscGVyUGx1Z2luT3B0aW9uKTogUm91dGVySGVscGVyUGx1Z2luT3B0aW9uID0+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5vcHMsXG4gICAgc291cmNlRmlsZXM6IG9wcy5zb3VyY2VGaWxlcy5tYXAoKGl0ZW0pID0+IG5vcm1hbGl6ZVBhdGgoaXRlbSkpLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBxdW90ZXNXcmFwUmVnID0gL15bXCInYF0oLis/KVtcIidgXSQvXG4vLyBcdTVCNTdcdTdCMjZcdTRFMzJcdTY2MkZcdTU0MjZcdTRGN0ZcdTc1MjhcdTVGMTVcdTUzRjdcdTUzMDVcdThENzdcdTY3NjVcbmV4cG9ydCBjb25zdCBpc1F1b3Rlc1dyYXAgPSAodGFyZ2V0OiBzdHJpbmcgfCB1bmRlZmluZWQpOiBib29sZWFuID0+IHtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gcXVvdGVzV3JhcFJlZy50ZXN0KHRhcmdldClcbn1cblxuLy8gXHU5OTk2XHU1QjU3XHU2QkNEXHU1OTI3XHU1MTk5XG5leHBvcnQgY29uc3QgY29udmVydFRpdGxlQ2FzZSA9IChzdHI6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwpOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsID0+IHtcbiAgaWYgKCFzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gIH1cbiAgY29uc3QgZmlyc3RDaGFyID0gc3RyWzBdLnRvVXBwZXJDYXNlKClcbiAgaWYgKHN0ci5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gZmlyc3RDaGFyXG4gIH1cbiAgcmV0dXJuIGAke2ZpcnN0Q2hhcn0ke3N0ci5zdWJzdHJpbmcoMSl9YFxuICByZXR1cm4gc3RyXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDE3MjQ4XFxcXERlc2t0b3BcXFxcdnVlMy1hZG1pblxcXFx2aXRlLXBsdWdpblxcXFxyb3V0ZXItaGVscGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxNzI0OFxcXFxEZXNrdG9wXFxcXHZ1ZTMtYWRtaW5cXFxcdml0ZS1wbHVnaW5cXFxccm91dGVyLWhlbHBlclxcXFxjb3JlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8xNzI0OC9EZXNrdG9wL3Z1ZTMtYWRtaW4vdml0ZS1wbHVnaW4vcm91dGVyLWhlbHBlci9jb3JlLnRzXCI7aW1wb3J0IHsgUHJvamVjdCwgdHMsIFNvdXJjZUZpbGUgfSBmcm9tICd0cy1tb3JwaCdcbmltcG9ydCB7IGNoZWNrU291cmNlRmlsZXNFeGlzdCwgY29udmVydFRpdGxlQ2FzZSwgaXNRdW90ZXNXcmFwLCBxdW90ZXNXcmFwUmVnLCB0cmFuc2Zvcm1XaWR0aFN0YXRlIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7IFNGQ1NjcmlwdEJsb2NrLCBwYXJzZSwgY29tcGlsZVNjcmlwdCB9IGZyb20gJ0B2dWUvY29tcGlsZXItc2ZjJ1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnbm9kZTpmcydcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdub2RlOnBhdGgnXG5cbnR5cGUgU0ZDU3RhdGVtZW50cyA9IFNGQ1NjcmlwdEJsb2NrWydzY3JpcHRBc3QnXVxuXG5pbnRlcmZhY2UgUGx1Z2luT3B0aW9uIHtcbiAgdHNDb25maWdKc29uUGF0aDogc3RyaW5nXG4gIHNvdXJjZUZpbGVzOiBzdHJpbmdbXVxuICBiYXNlVXJsOiBzdHJpbmdcbn1cbi8vIGV4cG9ydCBbUGx1Z2luT3B0aW9uXSBhbGlhc1xuZXhwb3J0IHR5cGUgUm91dGVySGVscGVyUGx1Z2luT3B0aW9uID0gUGx1Z2luT3B0aW9uXG5cbi8vIFx1OTA0RFx1NTM4Nlx1NjVGNlx1NzY4NFx1NEUyRFx1OTVGNFx1NzJCNlx1NjAwMSBcdTYyMTZcdTgwMDVcdTdFRDNcdTY3OUNcbnR5cGUgVHJhbnNmb3JtTWlkU3RhdGUgPSB7XG4gIHBhdGhzOiBzdHJpbmdbXVxuICBuYXZIYW5kbGVOYW1lOiBzdHJpbmdcbiAgY3BtUGF0aD86IHN0cmluZ1xufVxuXG5pbnRlcmZhY2UgUmVzdWx0IHtcbiAgcGF0aDogc3RyaW5nXG4gIG5hdkhhbmRsZU5hbWU6IHN0cmluZ1xuICBwYWdlUGFyYW1OYW1lPzogc3RyaW5nXG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIG9iak1hcCBmb3Igc2ltcGxlIHNlYXJjaFxuICovXG50eXBlIEZpbGVTb3VyY2VSZXN1bHQgPSBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBSZXN1bHQ+PlxuXG5jb25zdCB2dWVTRkNJbmRleCA9IDFcbmNvbnN0IGdldFBhZ2VQYXJhbU5hbWVGcm9tU0ZDID0gKGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgY2hlY2tIYXNFeHBvcnRQYWdlUGFyYW1zID0gKGFycjogU0ZDU3RhdGVtZW50cyA9IFtdKSA9PiB7XG4gICAgcmV0dXJuIGFyci5zb21lKChpdGVtKSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBpc1NjcmlwdEV4cG9ydCA9IGl0ZW0udHlwZSA9PT0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nICYmIGl0ZW0/LmRlY2xhcmF0aW9uPy5pZD8ubmFtZSA9PT0gJ1BhZ2VQYXJhbXMnXG4gICAgICByZXR1cm4gaXNTY3JpcHRFeHBvcnRcbiAgICB9KVxuICB9XG4gIGNvbnN0IGZpbGUgPSByZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGYtOCcpXG4gIGNvbnN0IHBhcnNlUmVzdWx0ID0gcGFyc2UoZmlsZSlcblxuICBpZiAoIXBhcnNlUmVzdWx0LmRlc2NyaXB0b3Iuc2NyaXB0ICYmICFwYXJzZVJlc3VsdC5kZXNjcmlwdG9yLnNjcmlwdFNldHVwKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgY29uc3Qgc2NyaXB0ID0gY29tcGlsZVNjcmlwdChwYXJzZVJlc3VsdC5kZXNjcmlwdG9yLCB7IGlkOiBgdGVzdF8ke3Z1ZVNGQ0luZGV4fWAgfSlcbiAgY29uc3QgaGFzRXhwb3J0UGFnZVBhcmFtcyA9IGNoZWNrSGFzRXhwb3J0UGFnZVBhcmFtcyhbLi4uKHNjcmlwdC5zY3JpcHRBc3QgfHwgW10pLCAuLi4oc2NyaXB0LnNjcmlwdFNldHVwQXN0IHx8IFtdKV0pXG4gIHJldHVybiBoYXNFeHBvcnRQYWdlUGFyYW1zID8gYFBhZ2VQYXJhbV8ke3Z1ZVNGQ0luZGV4fWAgOiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XG4gIHByaXZhdGVcbiAgLyoqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYFxuICAgKiB7XG4gICAqICAgIGZpbGVQYXRoOiB7XG4gICAqICAgICAgICBzb21Sb3V0ZVBhdGg6IHtcbiAgICogICAgICAgIHJvdXRlUGF0aDogc29tUm91dGVQYXRoLFxuICAgKiAgICAgICAgbmF2SGFuZGxlTmFtZTogc29tZUhhbmRsZU5hbWUsXG4gICAqICAgICAgfVxuICAgKiAgICB9XG4gICAqIH1cbiAgICogYGBgXG4gICAqL1xuICBwcml2YXRlIF9yZXN1bHRzTWFwOiBGaWxlU291cmNlUmVzdWx0ID0ge31cbiAgcHJpdmF0ZSBfcHJvamVjdDogUHJvamVjdFxuICBwcml2YXRlIF9jYWNoZU1ldGhvZE5hbWVzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge31cbiAgLyoqIFx1NUY1M1x1NTI0RFx1NkI2M1x1NTcyOFx1NTA1QVx1OEY2Q1x1NjM2Mlx1NzY4NFx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NCAqL1xuICBwcml2YXRlIF90cmFuc2Zvcm1pbmdGaWxlUGF0aD86IHN0cmluZ1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uOiBQbHVnaW5PcHRpb24pIHtcbiAgICB0aGlzLmluaXQob3B0aW9uKVxuICB9XG4gIHByaXZhdGUgaW5pdChvcHM6IFBsdWdpbk9wdGlvbikge1xuICAgIHRoaXMuX3Byb2plY3QgPSBuZXcgUHJvamVjdCh7XG4gICAgICB0c0NvbmZpZ0ZpbGVQYXRoOiBvcHMudHNDb25maWdKc29uUGF0aCxcbiAgICB9KVxuICAgIHRoaXMuX3Byb2plY3QuYWRkU291cmNlRmlsZXNBdFBhdGhzKG9wcy5zb3VyY2VGaWxlcylcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc2Zvcm0ocGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHJhbnNmb3JtaW5nRmlsZVBhdGggPSBwYXRoXG4gICAgY29uc3Qgc291cmNlRmlsZSA9IHRoaXMuX3Byb2plY3QuZ2V0U291cmNlRmlsZShwYXRoKVxuICAgIGlmIChzb3VyY2VGaWxlKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudHJhbnNmb3JtNE9uZShzb3VyY2VGaWxlKVxuICAgICAgdGhpcy5kZWFsV2l0aFJlc3VsdCh2YWx1ZSlcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0UmVzdWx0TGlzdChwYXRoPzogc3RyaW5nKTogUmVzdWx0W10ge1xuICAgIGlmIChwYXRoKSB7XG4gICAgICBjb25zdCBmaWxlUmVzdWx0TWFwID0gdGhpcy5fcmVzdWx0c01hcFtwYXRoXVxuICAgICAgcmV0dXJuIGZpbGVSZXN1bHRNYXAgPyBPYmplY3QudmFsdWVzKGZpbGVSZXN1bHRNYXApIDogW11cbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fcmVzdWx0c01hcCkucmVkdWNlKChwcmVMaXN0LCBuZXh0T2JqKSA9PiB7XG4gICAgICBwcmVMaXN0LnB1c2goLi4uT2JqZWN0LnZhbHVlcyhuZXh0T2JqKSlcbiAgICAgIHJldHVybiBwcmVMaXN0XG4gICAgfSwgQXJyYXk8UmVzdWx0PigpKVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2Zvcm00T25lKHJvdXRlU291cmNlRmlsZTogU291cmNlRmlsZSk6IFRyYW5zZm9ybU1pZFN0YXRlW10ge1xuICAgIGNvbnN0IHJlc3VsdExpc3Q6IFRyYW5zZm9ybU1pZFN0YXRlW10gPSBbXVxuICAgIGNvbnN0IGNsYXNzQ3R4ID0gdGhpc1xuICAgIHRyYW5zZm9ybVdpZHRoU3RhdGU8VHJhbnNmb3JtTWlkU3RhdGU+KHJvdXRlU291cmNlRmlsZSwge1xuICAgICAgaW5pdDogKCkgPT4gKHsgcGF0aHM6IFtdLCBuYXZIYW5kbGVOYW1lOiAnJyB9KSxcbiAgICAgIHZpc2l0aW5nOiB7XG4gICAgICAgIE9iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUsIHN0YXRlKSB7XG4gICAgICAgICAgaWYgKCF0cy5pc09iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZ2V0IHJvdXRQYXRoXG4gICAgICAgICAgY29uc3QgcGF0aFByb05vZGUgPSBub2RlLnByb3BlcnRpZXMuZmluZCgoaXRlbSkgPT4gaXRlbS5uYW1lPy5nZXRUZXh0KCkgPT09ICdwYXRoJylcbiAgICAgICAgICBpZiAoIXBhdGhQcm9Ob2RlIHx8ICF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwYXRoUHJvTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBleHByVmFsdWUgPSBwYXRoUHJvTm9kZS5pbml0aWFsaXplci5nZXRUZXh0KClcbiAgICAgICAgICBjb25zdCByZXN1bHQ6IFRyYW5zZm9ybU1pZFN0YXRlID0ge1xuICAgICAgICAgICAgcGF0aHM6IFsuLi5zdGF0ZS5wYXRocywgZXhwclZhbHVlXSxcbiAgICAgICAgICAgIG5hdkhhbmRsZU5hbWU6ICcnLFxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBnZXQgcm91dGVIYW5kbGVOYW1lXG4gICAgICAgICAgY29uc3QgaGFuZGxlTmFtZVByb05vZGUgPSBub2RlLnByb3BlcnRpZXMuZmluZCgoaXRlbSkgPT4gaXRlbS5uYW1lPy5nZXRUZXh0KCkgPT09ICduYXZIYW5kbGVOYW1lJylcbiAgICAgICAgICBpZiAoIWhhbmRsZU5hbWVQcm9Ob2RlKSB7XG4gICAgICAgICAgICByZXN1bHQubmF2SGFuZGxlTmFtZSA9IGNsYXNzQ3R4LmdldFJlYWxNZXRob2ROYW1lKHVuZGVmaW5lZCwgcmVzdWx0LnBhdGhzKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBoYW5kbGVOYW1lUHJvTm9kZSAmJlxuICAgICAgICAgICAgdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQoaGFuZGxlTmFtZVByb05vZGUpICYmXG4gICAgICAgICAgICB0cy5pc1N0cmluZ0xpdGVyYWwoaGFuZGxlTmFtZVByb05vZGUuaW5pdGlhbGl6ZXIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVOYW1lID0gaGFuZGxlTmFtZVByb05vZGUuaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpXG4gICAgICAgICAgICByZXN1bHQubmF2SGFuZGxlTmFtZSA9IGNsYXNzQ3R4LmdldFJlYWxNZXRob2ROYW1lKGhhbmRsZU5hbWUsIHJlc3VsdC5wYXRocylcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZ2V0IHJvdXRlIGNvbXBvbmVudCBwYXRoXG4gICAgICAgICAgY29uc3QgY29tcE5vZGUgPSBub2RlLnByb3BlcnRpZXMuZmluZCgoaXRlbSkgPT4gaXRlbS5uYW1lPy5nZXRUZXh0KCkgPT09ICdjb21wb25lbnQnKVxuICAgICAgICAgIGlmIChjb21wTm9kZSkge1xuICAgICAgICAgICAgY29uc3QgaW1wb3J0VGV4dCA9IGNvbXBOb2RlLmdldFRleHQoKVxuICAgICAgICAgICAgY29uc3QgbWF0Y2hJbXBvcnRQYXRoUmVnID0gL2ltcG9ydFxcKCguKz8pXFwpL1xuICAgICAgICAgICAgY29uc3QgaW1wb3J0UGF0aCA9IGltcG9ydFRleHQubWF0Y2gobWF0Y2hJbXBvcnRQYXRoUmVnKT8uWzFdXG4gICAgICAgICAgICBpZiAoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgICBjbGFzc0N0eC5nZXRQYWdlUGFyYW1OYW1lKGltcG9ydFBhdGgucmVwbGFjZShxdW90ZXNXcmFwUmVnLCAnJDEnKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0TGlzdC5wdXNoKHJlc3VsdClcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICAgIHN0YXRlOiByZXN1bHQsXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICAgIHJldHVybiByZXN1bHRMaXN0XG4gIH1cblxuICBwcml2YXRlIGRlYWxXaXRoUmVzdWx0KG5ld0xpc3Q6IFRyYW5zZm9ybU1pZFN0YXRlW10pIHtcbiAgICBpZiAoIXRoaXMuX3RyYW5zZm9ybWluZ0ZpbGVQYXRoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcGF0aFJlc3VsdE1hcCA9IG5ld0xpc3QucmVkdWNlKChwcmUsIG5leHQpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubWFwU3RhdGUyUmVzdWx0KG5leHQpXG4gICAgICBwcmVbcmVzdWx0LnBhdGhdID0gcmVzdWx0XG4gICAgICByZXR1cm4gcHJlXG4gICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgUmVzdWx0PilcbiAgICB0aGlzLl9yZXN1bHRzTWFwW3RoaXMuX3RyYW5zZm9ybWluZ0ZpbGVQYXRoXSA9IHBhdGhSZXN1bHRNYXBcbiAgfVxuXG4gIC8qKiBUT0RPOiBuZWVkIHRvIGJlIHNpbXBsZSAqL1xuICBwcml2YXRlIGdldFJlYWxNZXRob2ROYW1lKG9yaWdpbk5hbWU/OiBzdHJpbmcsIHBhdGhzPzogc3RyaW5nW10pIHtcbiAgICBpZiAoIW9yaWdpbk5hbWUpIHtcbiAgICAgIGlmIChwYXRocz8ubGVuZ3RoKSB7XG4gICAgICAgIC8vIGFsbCBpcyBzdHJpbmcgbGl0ZXJhbFxuICAgICAgICBjb25zdCBpc0FsbExpdGVyYWxTdHIgPSAhcGF0aHMuc29tZSgoaXRlbSkgPT4gIWlzUXVvdGVzV3JhcChpdGVtKSlcbiAgICAgICAgaWYgKGlzQWxsTGl0ZXJhbFN0cikge1xuICAgICAgICAgIG9yaWdpbk5hbWUgPSBwYXRoc1xuICAgICAgICAgICAgLm1hcCgoaXRlbSkgPT4gY29udmVydFRpdGxlQ2FzZShpdGVtLnJlcGxhY2UoJy8nLCAnJykucmVwbGFjZShxdW90ZXNXcmFwUmVnLCAnJDEnKSkpXG4gICAgICAgICAgICAuam9pbignJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIW9yaWdpbk5hbWUpIHtcbiAgICAgIG9yaWdpbk5hbWUgPSBgaGFuZGxlTmF2VG9QYWdlXyR7TWF0aC5hYnMoTWF0aC5yYW5kb20oKSAqIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKX1gXG4gICAgfVxuICAgIC8vIFx1OTY2NFx1NTNCQlx1OTk5Nlx1NUMzRVx1NTkxQVx1NEY1OVx1NzY4NFx1NTNDQ1x1NUYxNVx1NTNGN1x1N0E3QVx1NzY3RFx1N0IyNlx1NTNGN1xuICAgIG9yaWdpbk5hbWUgPSBvcmlnaW5OYW1lLnJlcGxhY2UocXVvdGVzV3JhcFJlZywgJyQxJykudHJpbSgpXG4gICAgY29uc3QgY291bnQgPSB0aGlzLl9jYWNoZU1ldGhvZE5hbWVzW29yaWdpbk5hbWVdXG4gICAgaWYgKGNvdW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2NhY2hlTWV0aG9kTmFtZXNbb3JpZ2luTmFtZV0gPSBjb3VudCArIDFcbiAgICAgIHJldHVybiBgJHtvcmlnaW5OYW1lfSR7Y291bnQgKyAxfWBcbiAgICB9XG4gICAgcmV0dXJuIG9yaWdpbk5hbWVcbiAgfVxuXG4gIC8qKiBtYXBwaW5nIE1pZFN0YXRlIHRvIFJlc3VsdCAqL1xuICBwcml2YXRlIG1hcFN0YXRlMlJlc3VsdChzdGF0ZTogVHJhbnNmb3JtTWlkU3RhdGUpOiBSZXN1bHQge1xuICAgIHJldHVybiB7XG4gICAgICBwYXRoOiB0aGlzLmRlYWxXaXRoUGF0aChzdGF0ZS5wYXRocyksXG4gICAgICBuYXZIYW5kbGVOYW1lOiBzdGF0ZS5uYXZIYW5kbGVOYW1lLFxuICAgIH1cbiAgfVxuXG4gIC8qKiBjb252ZXJ0IHBhdGhzIGFycmF5IHRvIHBhdGggc3RyaW5nICovXG4gIHByaXZhdGUgZGVhbFdpdGhQYXRoKHBhdGhzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgLy8gY2hlY2sgYWxsIHBhdGhzIGlzIGxpdGVyYWwgc3RyaW5nXG4gICAgY29uc3QgaXNBbGxMaXRlcmFsU3RyID0gIXBhdGhzLnNvbWUoKGl0ZW0pID0+ICFpc1F1b3Rlc1dyYXAoaXRlbSkpXG4gICAgaWYgKGlzQWxsTGl0ZXJhbFN0cikge1xuICAgICAgY29uc3QgdmFsdWUgPSBwYXRoc1xuICAgICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnJlcGxhY2UocXVvdGVzV3JhcFJlZywgJyQxJykudHJpbSgpKVxuICAgICAgICAuam9pbignLycpXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcKy8sICdcXFxcJylcbiAgICAgIHJldHVybiBgXCIke3ZhbHVlfVwiYFxuICAgIH1cbiAgICAvLyBzb21lIGNhc2UgbGlrZSB0aGlzICBbJ1wiL3N0cmluZyBsaXRlcmFsXCInLCd2YXIgKyBcInN0cmluZyBsaXRlcmFsXCInLCdcInN0cmluZyBsaXRlcmFsXCInXVxuICAgIHJldHVybiBwYXRocy5qb2luKCcgKyAnKVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRQYWdlUGFyYW1OYW1lKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZWFsRmlsZVBhdGggPSBqb2luKHRoaXMub3B0aW9uLmJhc2VVcmwsIGZpbGVQYXRoLnJlcGxhY2UoJ0AnLCAnLi9zcmMvJykpXG4gICAgY29uc29sZS5sb2coJz4+Pj4+Pj4+Pj4+JylcblxuICAgIGlmICghY2hlY2tTb3VyY2VGaWxlc0V4aXN0KFtyZWFsRmlsZVBhdGhdKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHBhZ2VQYXJhbXNOYW1lID0gZ2V0UGFnZVBhcmFtTmFtZUZyb21TRkMoZmlsZVBhdGgpXG4gICAgY29uc29sZS5sb2cocmVhbEZpbGVQYXRoKVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThULFNBQVMsZ0JBQUFBLGVBQWMsbUJBQW1COzs7QUNBeEMsU0FBUyxlQUFlLFdBQVc7QUFDblcsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7OztBQ1QyVSxPQUF1Qjs7O0FDQXZCLFNBQVMsTUFBQUMsV0FBZ0I7QUFDOVgsT0FBTyxRQUFROzs7QUNEb1YsU0FBUyxTQUFTLFVBQXNCO0FBRTNZLFNBQXlCLE9BQU8scUJBQXFCO0FBQ3JELFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsWUFBWTtBQThCckIsSUFBTSxjQUFjO0FBQ3BCLElBQU0sMEJBQTBCLENBQUMsYUFBcUI7QUFDcEQsUUFBTSwyQkFBMkIsQ0FBQyxNQUFxQixDQUFDLE1BQU07QUFDNUQsV0FBTyxJQUFJLEtBQUssQ0FBQyxTQUFTO0FBckM5QjtBQXVDTSxZQUFNLGlCQUFpQixLQUFLLFNBQVMsOEJBQTRCLHdDQUFNLGdC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QUFpQjtBQUFBLElBQzFDLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxNQUNKLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxJQUNELHNCQUFtQjtBQUFBLE1BQ2pCLGtCQUFrQkMsTUFBSyxTQUFTLGVBQWU7QUFBQSxNQUMvQyxTQUFTO0FBQUEsTUFDVCxhQUFhO0FBQUEsUUFDWEEsTUFBSyxTQUFTLG1DQUFtQztBQUFBLFFBQ2pEQSxNQUFLLFNBQVMsd0NBQXdDO0FBQUEsTUFDeEQ7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsU0FBUyxLQUFLO0FBQUEsTUFDM0IsUUFBUSxRQUFRLFNBQVMsWUFBWTtBQUFBLElBQ3ZDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZSxDQUFDO0FBQUEsRUFDbEI7QUFDRixDQUFDOzs7QUQvQ0QsSUFBTywwQkFBUTtBQUFBLEVBQ2JDLGNBQWE7QUFBQSxJQUNYLE1BQU07QUFBQSxJQUNOLE1BQU0sUUFBUSxJQUFJO0FBQUEsSUFDbEIsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sSUFBSTtBQUFBLFFBQ0YsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQUEsRUFDRDtBQUNGOyIsCiAgIm5hbWVzIjogWyJkZWZpbmVDb25maWciLCAidHMiLCAiX2EiLCAidHMiLCAiam9pbiIsICJqb2luIiwgImRlZmluZUNvbmZpZyJdCn0K
