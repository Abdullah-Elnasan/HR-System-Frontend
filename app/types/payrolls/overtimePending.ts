// ~/types/overtime.ts
import type { PaginationMeta } from "../table";




/**
 * Model القادم من الـ API
 */
export type OvertimePending = {
  id:number,
  employee_id:number | null,
  employee_name:string,
  suggested_date_from: string | null;
  suggested_date_to: string | null;
  approved_minutes: number;
  rate_multiplier: number;
  action: string;
};

/**
 * Form Model (Create / Update)
 */
export type OvertimePendingForm = {
  id:number | null,
  employee_id:number | null,
  employee_name:string | null,
  date_from: string | null;
  date_to: string | null;
  approved_minutes: number;
  rate_multiplier: number;
};

/**
 * Initial empty form
 */
export const emptyOvertimePendingForm = (): OvertimePendingForm => ({
  id:null,
  employee_id: null,
  employee_name:null,
  date_from: null,
  date_to: null,
  approved_minutes: 0,
  rate_multiplier: 1.5,
});

/**
 * API Response
 */
export type OvertimePendingApiResponse<T = OvertimePending[]> = {
  success: boolean;
  messageAr: string;
  messageEn: string;
  data: T;
  pagination: PaginationMeta;
};

/**
 * Row Type
 */
export type OvertimePendingRow = Pick<
  OvertimePending,
  |"id"
  | "employee_id"
  | "employee_name"
  | "suggested_date_from"
  | "suggested_date_to"
  | "approved_minutes"
  | "rate_multiplier"
>;
