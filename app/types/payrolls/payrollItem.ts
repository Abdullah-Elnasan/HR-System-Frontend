import type { PaginationMeta } from "../table";

/**
 * Currency Type
 */
export type Currency = "USD" | "EUR" | "SAR" | "AED" | "EGP" | "JOD";

/**
 * Employee (nested)
 */
export type EmployeeNested = {
  id: number;
  full_name: string;
};

/**
 * Payroll Run (nested)
 */
export type PayrollRunNested = {
  id: number;
  name: string;
};

/**
 * Model القادم من الـ API
 */
export type PayrollItem = {
  id: number;
  payroll_run_id: number;
  payroll_run_name: string;
  employee: EmployeeNested;
  period_start: string;
  period_end: string;
  status: string;
  base_amount: number;
  overtime_amount: number;
  currency: Currency;
  manual_adjustment: number;
  adjustment_note: string | null;
  total_amount: number;
  action: string;
};

/**
 * Form Model (Create / Update)
 */
export type PayrollItemForm = {
  payroll_run_id: number | null;
  payroll_run_name: string | null;
  employee_id: number | null;
  period_start: string | null;
  period_end: string | null;
  status: string | null;
  base_amount: number;
  overtime_amount: number;
  currency: Currency | "";
  manual_adjustment: number;
  adjustment_note: string;
  total_amount: number;
};

/**
 * Initial empty form
 */
export const emptyPayrollItemForm = (): PayrollItemForm => ({
  payroll_run_id: null,
  payroll_run_name: null,
  employee_id: null,
  period_start: null,
  period_end: null,
  status: null ,
  base_amount: 0,
  overtime_amount: 0,
  currency: "",
  manual_adjustment: 0,
  adjustment_note: "",
  total_amount: 0,
});

/**
 * API Response
 */
export type PayrollItemsApiResponse<T = PayrollItem[]> = {
  success: boolean;
  messageAr: string;
  messageEn: string;
  data: T;
  pagination: PaginationMeta;
};

/**
 * Row Type
 */
export type PayrollItemRow = Pick<
  PayrollItem,
  | "id"
  | "payroll_run_id"
  | "payroll_run_name"
  | "employee"
  | "period_start"
  | "period_end"
  | "base_amount"
  | "overtime_amount"
  | "currency"
  | "manual_adjustment"
  | "adjustment_note"
  | "total_amount"
>;
