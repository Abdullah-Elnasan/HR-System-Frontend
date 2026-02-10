import type { OvertimeApprovedRow } from "~/types/payrolls/overtimeApproved";

export function isOvertimeApprovedRow(row: unknown): row is OvertimeApprovedRow {
  return (
    typeof row === "object" &&
    row !== null &&
    "id" in row &&
    "employee" in row &&
    "date_from" in row
  );
}
