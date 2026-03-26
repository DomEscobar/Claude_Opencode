import { tool } from "@opencode-ai/plugin";

/**
 * Calculate the next N execution times for a cron expression.
 * Supports standard 5-field cron + optional 6th field (seconds).
 * Great for understanding what "0 9 * * 1-5" actually means in practice.
 *
 * Use cases:
 *   - "What times will this cron job run next week?"
 *   - "Verify my cron expression is correct before saving it"
 *   - "Check if '0 0 * * *' runs at midnight UTC"
 */
export const cronNext = tool({
  description:
    "Parse a cron expression and show the next N scheduled execution times. Supports 5-field (standard) and 6-field (with seconds) cron expressions. All times shown in UTC and local timezone.",
  args: {
    expression: tool.schema
      .string()
      .describe(
        "Cron expression (e.g. '0 9 * * 1-5' = 9:00 AM weekdays, '*/15 * * * *' = every 15 min, '0 0 1 * *' = monthly)"
      ),
    count: tool.schema
      .number()
      .optional()
      .describe("Number of upcoming times to show (default: 10, max: 50)"),
    timezone: tool.schema.string().optional().describe("Timezone (default: UTC, e.g. 'Europe/Berlin', 'America/New_York')"),
  },
  async execute({ expression, count = 10, timezone = "UTC" }) {
    const fields = expression.trim().split(/\s+/);
    const hasSeconds = fields.length === 6;
    const fieldCount = fields.length;

    if (fieldCount !== 5 && fieldCount !== 6) {
      return {
        error: `Invalid cron expression: expected 5 or 6 fields, got ${fieldCount}`,
        hint: "Format: [seconds] minute hour day-of-month month day-of-week\nExample: '0 9 * * 1-5' = 9:00 AM on weekdays",
      };
    }

    const parts = hasSeconds ? fields : ["0", ...fields];
    const [sec, min, hour, dom, month, dow] = parts.map((f) => f.trim());

    // Simple validation
    const validation = validateField(min, 0, 59, "minute") ||
      validateField(hour, 0, 23, "hour") ||
      validateField(dom, 1, 31, "day of month") ||
      validateField(month, 1, 12, "month") ||
      validateField(dow, 0, 7, "day of week"); // 0 and 7 = Sunday

    if (validation) return validation;

    // Calculate next runs using native Date
    const now = new Date();
    const results = [];
    const tzOffset = timezone === "UTC" ? 0 : getTzOffset(timezone);

    if (isNaN(tzOffset)) {
      return { error: `Unknown timezone: ${timezone}`, hint: "Use IANA timezone names like 'Europe/Berlin'" };
    }

    let d = new Date(now);
    let iterations = 0;
    const maxIterations = 5000;

    while (results.length < Math.min(count, 50) && iterations < maxIterations) {
      iterations++;
      d.setTime(d.getTime() + 60000); // advance 1 min

      if (!matches(sec, d.getSeconds(), 0, 59)) continue;
      if (!matches(min, d.getMinutes(), 0, 59)) continue;
      if (!matches(hour, d.getHours(), 0, 23)) continue;
      if (!matches(dom, d.getDate(), 1, 31)) continue;
      if (!matches(month, d.getMonth() + 1, 1, 12)) continue;
      if (!matchesDow(dow, d.getDay())) continue;

      // Apply timezone offset
      const utc = new Date(d.getTime() + tzOffset * 60000);

      results.push({
        utc: utc.toISOString().replace("T", " ").slice(0, 19) + " UTC",
        local: d.toISOString().replace("T", " ").slice(0, 19) + " Z",
        unix: Math.floor(d.getTime() / 1000),
      });
    }

    if (iterations >= maxIterations) {
      return { error: "Could not find enough matches — check your cron expression" };
    }

    return {
      expression,
      timezone,
      fieldCount: hasSeconds ? 6 : 5,
      nextRuns: results,
      humanReadable: toHumanReadable(expression, results[0]?.local),
    };
  },
});

function matches(field, value, min, max) {
  if (field === "*") return true;
  if (field.includes(",")) return field.split(",").some((f) => matches(f.trim(), value, min, max));
  if (field.includes("/")) {
    const [, step] = field.split("/");
    return value % parseInt(step, 10) === 0;
  }
  if (field.includes("-")) {
    const [start, end] = field.split("-").map(Number);
    return value >= start && value <= end;
  }
  return parseInt(field, 10) === value;
}

function matchesDow(field, day) {
  if (field === "*") return true;
  if (field === "?") return true;
  const normalizedField = field === "7" ? "0" : field;
  return matches(normalizedField, day.toString(), 0, 7);
}

function validateField(field, min, max, name) {
  const validSpecial = ["*", "?", "l", "w"];
  if (!/^[\d,\-\/*wl]+$/.test(field)) {
    return { error: `Invalid ${name} field: '${field}'` };
  }
  return null;
}

function getTzOffset(tz) {
  try {
    const now = new Date();
    const utcStr = now.toLocaleString("en-US", { timeZone: "UTC" });
    const tzStr = now.toLocaleString("en-US", { timeZone: tz });
    const diffMs = new Date(utcStr) - new Date(tzStr);
    const offsetHours = diffMs / (1000 * 60 * 60);
    return -offsetHours;
  } catch {
    return NaN;
  }
}

function toHumanReadable(expr, firstRun) {
  const parts = expr.trim().split(/\s+/);
  const hasSec = parts.length === 6;
  const min = hasSec ? parts[1] : parts[0];
  const hour = hasSec ? parts[2] : parts[1];
  const dom = hasSec ? parts[3] : parts[2];
  const month = hasSec ? parts[4] : parts[3];
  const dow = hasSec ? parts[5] : parts[4];

  const times = [];
  if (hour === "*" && min === "*") times.push("every minute");
  else if (min === "*") times.push(`every hour at minute ${hour}`);
  else if (hour === "*") times.push(`at minute ${min} of every hour`);
  else times.push(`at ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`);

  const days = [];
  if (dow !== "*") {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (dow.includes("-")) {
      const [s, e] = dow.split("-").map(Number);
      days.push(`${dayNames[s]}–${dayNames[e]}`);
    } else if (dow === "1-5") {
      days.push("Mon–Fri (weekdays)");
    } else if (dow === "0,6" || dow === "6,0") {
      days.push("weekends");
    } else {
      days.push(dayNames[parseInt(dow)] || dow);
    }
  }
  if (dom !== "*") {
    if (dom === "1") days.push("1st of month");
    else days.push(`day ${dom}`);
  }

  return [times.join(", "), days.length ? `on ${days.join(", ")}` : ""].filter(Boolean).join(" ");
}

export default { cronNext };
