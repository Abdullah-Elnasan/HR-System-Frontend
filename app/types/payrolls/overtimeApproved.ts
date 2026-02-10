import type { PaginationMeta } from "../table";

/**
 * Status Enum
 */
export type OvertimeStatus = "approved" | "rejected";

/**
 * Employee (nested)
 */
export type EmployeeNested = {
  id: number;
  name: string;
};

/**
 * Payroll Run (nested)
 */
export type PayrollRunNested = {
  id: number;
  name: string;
};
export type approvedByNested = {
  id: number;
  name: string;
};


export type periodNested = {
  from: string;
  to: string;
};

/**
 * Model القادم من الـ API
 */
export type OvertimeApproved = {
  id: number;
  employee: EmployeeNested;
  period: periodNested;
  approved_minutes: number;
  approved_minutes_time: number;
  rate_multiplier: number;
  approved_by: approvedByNested;
  status: OvertimeStatus;
  payroll: PayrollRunNested | null;
  action: string;
};

/**
 * Form Model (Create / Update)
 */
export type OvertimeApprovedForm = {
  employee_name: string | null;
  approved_minutes: number;
  rate_multiplier: number;
};

/**
 * Initial empty form
 */
export const emptyOvertimeApprovedForm = (): OvertimeApprovedForm => ({
  employee_name: null,
  approved_minutes: 0,
  rate_multiplier: 1.5,
});

/**
 * API Response
 */
export type OvertimeApprovedApiResponse<T = OvertimeApproved[]> = {
  success: boolean;
  messageAr: string;
  messageEn: string;
  data: T;
  pagination: PaginationMeta;
};

/**
 * Row Type
 */
export type OvertimeApprovedRow = Pick<
  OvertimeApproved,
  | "id"
  | "employee"
  | "period"
  | "approved_minutes"
  | "approved_minutes_time"
  | "rate_multiplier"
  | "approved_by"
  | "status"
  | "payroll"
>;
