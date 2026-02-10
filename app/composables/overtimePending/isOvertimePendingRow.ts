// ~/composables/overtime-pending/isOvertimePendingRow.ts
import type { OvertimePendingRow } from "~/types/payrolls/overtimePending";

export function isOvertimePendingRow(row: unknown): row is OvertimePendingRow {
  return (
    typeof row === "object" &&
    row !== null &&
    "id" in row &&
    "employee_name" in row &&
    "suggested_date_from" in row
  );
}
