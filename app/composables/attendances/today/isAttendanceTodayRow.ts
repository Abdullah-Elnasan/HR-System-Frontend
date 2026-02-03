// ~/composables/attendance-today/isAttendanceTodayRow.ts
import type { AttendanceTodayRow } from "~/types/attendanceToday";

export function isAttendanceTodayRow(row: unknown): row is AttendanceTodayRow {
  return (
    typeof row === "object" &&
    row !== null &&
    "id" in row &&
    "employee" in row &&
    "current_status" in row
  );
}
