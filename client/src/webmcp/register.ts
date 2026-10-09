import { createTools, type WebMcpTool } from "./tools";

type ModelContext = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ) => Promise<void> | void;
};

// The draft spec exposes document.modelContext; early Chrome builds used
// navigator.modelContext. Without either, nothing is registered.
function findModelContext(): ModelContext | undefined {
  const candidates = [
    (document as unknown as { modelContext?: ModelContext }).modelContext,
    (navigator as unknown as { modelContext?: ModelContext }).modelContext,
  ];
  return candidates.find((c) => typeof c?.registerTool === "function");
}

function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function registerWebMcpTools(): AbortController | undefined {
  if (!window.isSecureContext) return undefined;
  const modelContext = findModelContext();
  if (!modelContext) return undefined;

  const controller = new AbortController();
  for (const tool of createTools(scrollToSection)) {
    Promise.resolve(
      modelContext.registerTool(tool, { signal: controller.signal }),
    ).catch(() => {});
  }
  return controller;
}
