// ~/types/payrollAssignments.ts
import type { PaginationMeta } from "./table";

/**
 * Assignable Entity
 */
export type AssignableEntity = {
  type: "Employee" | "Branch";
  id: number;
  name: string;
};

/**
 * Payroll System (nested)
 */
export type PayrollSystemNested = {
  id: number;
  name: string;
};

/**
 * Model القادم من الـ API
 */
export type PayrollAssignment = {
  id: number;
  payroll_system: PayrollSystemNested;
  assignable: AssignableEntity;
  effective_from: string | null;
  effective_to: string | null;
  action: string;
};

/**
 * Form Model (Create / Update)
 */
export type PayrollAssignmentForm = {
  assignable_type: "App\\Models\\Employee\\Employee" | "App\\Models\\Employee\\Employee" | "";
  assignable_id: number | null;
  payroll_system_id: number | null;
  effective_from: string | null;
  effective_to: string | null;
};

/**
 * Initial empty form
 */

const today = () => new Date().toISOString()?.slice(0, 10);
export const emptyPayrollAssignmentForm = (): PayrollAssignmentForm => ({
  assignable_type: "",
  assignable_id: null,
  payroll_system_id: null,
  effective_from: today(),
  effective_to: null,
});

/**
 * API Response
 */
export type PayrollAssignmentsApiResponse<T = PayrollAssignment[]> = {
  success: boolean;
  messageAr: string;
  messageEn: string;
  data: T;
  pagination: PaginationMeta;
};

/**
 * Row Type
 */
export type PayrollAssignmentRow = Pick<
  PayrollAssignment,
  "id" | "payroll_system" | "assignable" | "effective_from" | "effective_to"
>;
