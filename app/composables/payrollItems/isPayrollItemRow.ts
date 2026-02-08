import type { PayrollItemRow } from "~/types/payrolls/payrollItem";

export function isPayrollItemRow(row: unknown): row is PayrollItemRow {
  return (
    typeof row === "object" &&
    row !== null &&
    "id" in row &&
    "employee" in row &&
    "payroll_run_id" in row &&
    "manual_adjustment" in row
  );
}
