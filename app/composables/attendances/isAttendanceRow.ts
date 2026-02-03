// ~/composables/attendance/isAttendanceRow.ts
import type { AttendanceRow } from "~/types/attendance";

export function isAttendanceRow(row: unknown): row is AttendanceRow {
  return (
    typeof row === "object" &&
    row !== null &&
    "id" in row &&
    "employee" in row &&
    "date" in row
  );
}
