import ts from "typescript";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const sourceRoots = [
  "src/components",
  "src/pages",
  "src/routes",
  "src/hooks",
  "src/lib",
  "src/constants",
];
const sourceExtensions = new Set([".ts", ".tsx"]);
const copyAttributes = new Set([
  "alt",
  "aria-description",
  "aria-label",
  "description",
  "label",
  "placeholder",
  "title",
]);
const ignoredProperties = new Set([
  "className",
  "color",
  "contentType",
  "href",
  "id",
  "mimeType",
  "name",
  "path",
  "role",
  "size",
  "type",
  "variant",
]);

type Finding = { file: string; line: number; kind: string; text: string };
const findings: Finding[] = [];

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (path.includes("/paraglide/")) return [];
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return sourceExtensions.has(extname(path)) ? [path] : [];
  });
}

function normalized(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function looksLikeCopy(text: string) {
  const value = normalized(text);
  if (!value || value.length < 2) return false;
  if (!/[A-Za-z]/.test(value)) return false;
  if (/^(?:https?:|\/|\.\/|\.\.\/|[.#@]|--)/.test(value)) return false;
  if (/^[a-z0-9_-]+(?:\/[a-z0-9_.+-]+)+$/i.test(value)) return false;
  if (/^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/.test(value)) return false;
  if (/^[a-z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)+$/.test(value)) return false;
  if (/^[a-z0-9_-]+(?:\s+[a-z0-9_:[\]/%.#()-]+)+$/.test(value) && /[-:[\]/]/.test(value))
    return false;
  return /\s|[A-Z]|[.!?,:'"]/.test(value);
}

function propertyName(node: ts.Node): string | undefined {
  if (ts.isPropertyAssignment(node) || ts.isPropertyDeclaration(node)) {
    return ts.isIdentifier(node.name) || ts.isStringLiteral(node.name) ? node.name.text : undefined;
  }
  if (ts.isJsxAttribute(node)) return node.name.getText();
  return undefined;
}

for (const file of sourceRoots.flatMap((directory) => sourceFiles(join(root, directory)))) {
  if (file.endsWith(".test.ts") || file.endsWith(".test.tsx") || file.endsWith("routeTree.gen.ts"))
    continue;
  const sourceText = readFileSync(file, "utf8");
  const source = ts.createSourceFile(
    file,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  function add(node: ts.Node, kind: string, text: string) {
    const value = normalized(text);
    if (!looksLikeCopy(value)) return;
    const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
    findings.push({ file: relative(root, file), line, kind, text: value });
  }

  function visit(node: ts.Node) {
    if (ts.isJsxText(node)) add(node, "jsx-text", node.text);
    if (ts.isJsxAttribute(node) && node.initializer && copyAttributes.has(node.name.getText())) {
      if (ts.isStringLiteral(node.initializer)) add(node, "jsx-attribute", node.initializer.text);
      if (
        ts.isJsxExpression(node.initializer) &&
        node.initializer.expression &&
        ts.isStringLiteralLike(node.initializer.expression)
      ) {
        add(node, "jsx-attribute", node.initializer.expression.text);
      }
    }
    if (ts.isStringLiteralLike(node) && !ts.isJsxAttribute(node.parent)) {
      const parent = node.parent;
      const key = propertyName(parent);
      const isImport =
        ts.isImportDeclaration(parent) ||
        ts.isExportDeclaration(parent) ||
        ts.isImportTypeNode(parent);
      const isModuleSpecifier =
        isImport ||
        (ts.isCallExpression(parent) && parent.expression.kind === ts.SyntaxKind.ImportKeyword);
      const isObjectKey =
        (ts.isPropertyAssignment(parent) && parent.name === node) ||
        ts.isPropertyAccessExpression(parent);
      const isIgnoredProperty = key && ignoredProperties.has(key);
      const isCodeCall =
        ts.isCallExpression(parent) &&
        ts.isIdentifier(parent.expression) &&
        ["sx", "cn", "stylex", "createRoute", "redirect"].includes(parent.expression.text);
      if (!isModuleSpecifier && !isObjectKey && !isIgnoredProperty && !isCodeCall)
        add(node, "string", node.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
for (const finding of findings) {
  process.stdout.write(`${finding.file}:${finding.line}\t${finding.kind}\t${finding.text}\n`);
}
process.stderr.write(
  `\n${findings.length} candidate copy occurrences in ${new Set(findings.map(({ file }) => file)).size} files.\n`,
);
if (
  process.argv.includes("--fail-on-jsx") &&
  findings.some(({ kind }) => kind === "jsx-text" || kind === "jsx-attribute")
) {
  process.exitCode = 1;
}
