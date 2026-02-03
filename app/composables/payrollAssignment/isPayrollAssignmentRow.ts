// ~/composables/payroll-assignments/isPayrollAssignmentRow.ts
import type { PayrollAssignmentRow } from "~/types/payrollAssignments";

export function isPayrollAssignmentRow(row: unknown): row is PayrollAssignmentRow {
  return (
    typeof row === "object" &&
    row !== null &&
    "id" in row &&
    "payroll_system" in row &&
    "assignable" in row
  );
}
