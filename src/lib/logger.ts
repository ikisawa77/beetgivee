import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

type LogMeta = Record<string, unknown>;
type FileLogger = { info: (event: string, meta?: LogMeta) => Promise<void>; error: (event: string, meta?: LogMeta) => Promise<void> };
const secretKey = /(password|secret|token|api.?key|authorization)/i;

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, secretKey.test(key) ? "[REDACTED]" : redact(item)]));
  return value;
}

export function createFileLogger(directory = process.env.BETPAY_LOG_DIR ?? join(process.cwd(), "storage", "logs")): FileLogger {
  async function write(level: "info" | "error", event: string, meta: LogMeta = {}) {
    await mkdir(directory, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const record = { timestamp: new Date().toISOString(), level, event, meta: redact(meta) };
    await appendFile(join(directory, `${date}.jsonl`), `${JSON.stringify(record)}\n`, "utf8");
  }
  return { info: (event, meta) => write("info", event, meta), error: (event, meta) => write("error", event, meta) };
}

export const logger = createFileLogger();
