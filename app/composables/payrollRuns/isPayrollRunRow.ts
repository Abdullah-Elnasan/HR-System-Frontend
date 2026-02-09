// ~/composables/payroll-runs/isPayrollRunRow.ts
import type { PayrollRunRow } from "~/types/payrolls/payrollRun";

export function isPayrollRunRow(row: unknown): row is PayrollRunRow {
  return (
    typeof row === "object" &&
    row !== null &&
    "id" in row &&
    "period_start" in row &&
    "status" in row
  );
}
