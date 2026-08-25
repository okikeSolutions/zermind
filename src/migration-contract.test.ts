import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

async function collectTsxFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectTsxFiles(entryPath)));
    if (entry.isFile() && entry.name.endsWith(".tsx")) files.push(entryPath);
  }
  return files;
}

describe("TanStack Start and StyleX migration contract", () => {
  it("does not ship Next.js or Tailwind packages", async () => {
    const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
    const packages = { ...packageJson.dependencies, ...packageJson.devDependencies };

    expect(packages.next).toBeUndefined();
    expect(packages.tailwindcss).toBeUndefined();
    expect(packages["tailwind-merge"]).toBeUndefined();
    expect(packages["@stylexjs/stylex"]).toBeDefined();
    expect(packages["@tanstack/react-start"]).toBeDefined();
    expect(packages["@inlang/paraglide-js"]).toBeDefined();
  });

  it("transforms DOM utilities once and passes raw utilities to component adapters", async () => {
    const files = await collectTsxFiles(path.join(projectRoot, "src"));
    const rawDomClasses: string[] = [];
    const doubleTransforms: string[] = [];

    for (const file of files) {
      const source = await readFile(file, "utf8");
      const sourceFile = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const componentAdapters = new Set<string>();

      for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
          continue;
        }
        const moduleName = statement.moduleSpecifier.text;
        const transformsClassName =
          moduleName.startsWith("@/components/ui/") ||
          moduleName === "@/components/dropzone" ||
          moduleName === "@/components/model-selector";
        const defaultBinding = statement.importClause?.name;
        const bindings = statement.importClause?.namedBindings;
        if (!transformsClassName) continue;
        if (defaultBinding) componentAdapters.add(defaultBinding.text);
        if (bindings && ts.isNamedImports(bindings)) {
          for (const element of bindings.elements) componentAdapters.add(element.name.text);
        }
      }

      function visit(node: ts.Node) {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
          const tagName = node.tagName.getText(sourceFile);
          const isDomElement = /^[a-z]/.test(tagName);
          const isComponentAdapter = componentAdapters.has(tagName.split(".")[0]);

          for (const attribute of node.attributes.properties) {
            const line =
              sourceFile.getLineAndCharacterOfPosition(attribute.getStart(sourceFile)).line + 1;
            if (
              isDomElement &&
              ts.isJsxAttribute(attribute) &&
              attribute.name.getText(sourceFile) === "className"
            ) {
              rawDomClasses.push(`${path.relative(projectRoot, file)}:${line}`);
            }
            if (
              isComponentAdapter &&
              ts.isJsxSpreadAttribute(attribute) &&
              ts.isCallExpression(attribute.expression) &&
              attribute.expression.expression.getText(sourceFile) === "sx"
            ) {
              doubleTransforms.push(`${path.relative(projectRoot, file)}:${line}`);
            }
          }
        }
        ts.forEachChild(node, visit);
      }

      visit(sourceFile);
    }

    expect(rawDomClasses).toEqual([]);
    expect(doubleTransforms).toEqual([]);
  });

  it("keeps the migrated route inventory in the generated tree", async () => {
    const routeTree = await readFile(path.join(projectRoot, "src/routeTree.gen.ts"), "utf8");

    for (const route of [
      "/auth/login",
      "/demo/$scenario",
      "/protected/chat/$id",
      "/collaborate/$chatId",
      "/share/$shareId",
      "/api/auth/$",
    ]) {
      expect(routeTree).toContain(route);
    }
  });

  it("keeps crawler controls and public pages in the SEO configuration", async () => {
    const robots = await readFile(path.join(projectRoot, "public/robots.txt"), "utf8");
    const sitemap = await readFile(path.join(projectRoot, "src/routes/sitemap[.]xml.ts"), "utf8");
    const viteConfig = await readFile(path.join(projectRoot, "vite.config.ts"), "utf8");
    const i18nConfig = await readFile(path.join(projectRoot, "i18n/config.ts"), "utf8");

    expect(robots).toContain("Sitemap: https://zermind.ai/sitemap.xml");
    expect(robots).toContain("Disallow: /api/");
    expect(sitemap).toContain('hreflang="x-default"');
    expect(viteConfig).toContain("paraglideVitePlugin");
    for (const path of ["/privacy", "/terms", "/imprint"]) {
      expect(i18nConfig).toContain(path);
    }
  });

  it("keeps the Paraglide integration at the router and server boundaries", async () => {
    const viteConfig = await readFile(path.join(projectRoot, "vite.config.ts"), "utf8");
    const router = await readFile(path.join(projectRoot, "src/router.tsx"), "utf8");
    const server = await readFile(path.join(projectRoot, "src/server.ts"), "utf8");
    const rootRoute = await readFile(path.join(projectRoot, "src/routes/__root.tsx"), "utf8");

    expect(viteConfig).toContain("paraglideVitePlugin");
    expect(viteConfig).toContain("localizedPrerenderPaths");
    expect(router).toContain("deLocalizeUrl");
    expect(router).toContain("localizeUrl");
    expect(server).toContain("paraglideMiddleware");
    expect(rootRoute).toContain("lang={getLocale()}");
  });
});
