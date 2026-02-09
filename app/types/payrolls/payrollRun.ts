// ~/types/payroll-run.ts
import type { PaginationMeta } from "../table";

/**
 * Status Enum
 */
export type PayrollRunStatus = "draft" | "processing" | "approved" | "paid" | "cancelled";

/**
 * Model القادم من الـ API
 */
export type PayrollRun = {
  id: number;
  period_start: string;
  period_end: string;
  status: PayrollRunStatus;
  approved_by: number | null;
  approved_by_name: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  action: string;
};

/**
 * Form Model (Create / Update)
 */
export type PayrollRunForm = {
  period_start: string | null;
  period_end: string | null;
  status?: PayrollRunStatus | "";
  approved_by?: number | null;
  approved_by_name?: string;
  payroll_run_name?: string;
  is_ready_for_approval?: string;
  approved_at?: string | null;
};

/**
 * Initial empty form
 */
export const emptyPayrollRunForm = (): PayrollRunForm => ({
  period_start: null,
  period_end: null,
  status: "",
  approved_by: null,
  approved_by_name: "",
  approved_at: null,
});

/**
 * API Response
 */
export type PayrollRunsApiResponse<T = PayrollRun[]> = {
  success: boolean;
  messageAr: string;
  messageEn: string;
  data: T;
  pagination: PaginationMeta;
};

/**
 * Row Type
 */
export type PayrollRunRow = Pick<
  PayrollRun,
  | "id"
  | "period_start"
  | "period_end"
  | "status"
  | "approved_by"
  | "approved_by_name"
  | "approved_at"
>;
