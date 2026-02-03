// ~/types/attendance.ts
import type { PaginationMeta } from "./table";

/**
 * Status Enum
 */
export type AttendanceStatus =
  | "present"
  | "absent"
  | "pending"
  | "leave"
  | "holiday";

export type FinalStatus =
  | "incomplete"
  | "absent"
  | "pending";

/**
 * Employee (nested)
 */
export type EmployeeNested = {
  id: number;
  name_ar: string;
};

/**
 * Model القادم من الـ API
 */
export type Attendance = {
  id: number;
  employee: EmployeeNested;
  device_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  work_minutes: number;
  required_minutes: number;
  overtime_minutes: number;
  late_minutes:number;
  early_leave_minutes:number;
  is_late: boolean;
  is_early_leave: boolean;
  attendance_status: AttendanceStatus;
  status: FinalStatus;
  action: string;
};

/**
 * Form Model (Create / Update)
 */
export type AttendanceForm = {
  employee_id: number | null;
  device_id: number | null;
  date: string | null;
  check_in: string | null;
  check_out: string | null;
  work_minutes: number | null;
  required_minutes: number | null;
  overtime_minutes: number | null;
  undertime_minutes: number | null;
  late_minutes: number | null;
  early_leave_minutes: number | null;
  is_late: boolean | null;
  is_early_leave: boolean | null;
  attendance_status: "present" | "absent" | "pending" | "leave" | "holiday" | "";
  status: "incomplete" | "absent" | "pending" | "";
};
/**
 * Initial empty form
 */

const today = () => new Date().toISOString()?.slice(0, 10);
export const emptyAttendanceForm = (): AttendanceForm => ({
  employee_id: null,
  device_id: null,
  date: today(),
  check_in: null,
  check_out: null,

  work_minutes: 0,
  required_minutes: 0,
  overtime_minutes: 0,
  undertime_minutes: 0,

  late_minutes: 0,
  early_leave_minutes: 0,

  is_late: false,
  is_early_leave: false,

  attendance_status: "",
  status: "",
});


/**
 * API Response
 */
export type AttendanceApiResponse<T = Attendance[]> = {
  success: boolean;
  messageAr: string;
  messageEn: string;
  data: T;
  pagination: PaginationMeta;
};

/**
 * Row Type
 */
export type AttendanceRow = Pick<
  Attendance,
  | "id"
  | "employee"
  | "date"
  | "check_in"
  | "check_out"
  | "work_minutes"
  | "required_minutes"
  | "overtime_minutes"
  | "attendance_status"
  | "is_late"
  | "late_minutes"
  | "is_early_leave"
  | "early_leave_minutes"
  | "status"
>;
