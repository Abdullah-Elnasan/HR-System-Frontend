// ~/types/work-schedule-assignment.ts
import type { PaginationMeta } from "./table";

/**
 * Assignable Entity
 */
export type AssignableEntity = {
  type: "Employee" | "Branch" | "Department";
  id: number;
  name: string;
};

/**
 * Work Schedule (nested)
 */
export type WorkScheduleNested = {
  id: number;
  name: string;
};

/**
 * Model القادم من الـ API
 */
export type WorkScheduleAssignment = {
  id: number;
  work_schedule: WorkScheduleNested;
  assignable: AssignableEntity;
  starts_at: string | null;
  ends_at: string | null;
  action: string;
};

/**
 * Form Model (Create / Update)
 */
export type WorkScheduleAssignmentForm = {
  assignable_type: "App\\Models\\Employee\\Employee" | "App\\Models\\Branch\\Branch" | "";
  assignable_id: number | null;
  work_schedule_id: number | null;
  starts_at: string | null;
  ends_at: string | null;
};

/**
 * Initial empty form
 */

const today = () => new Date().toISOString()?.slice(0, 10);

export const emptyWorkScheduleAssignmentForm =
  (): WorkScheduleAssignmentForm => ({
    assignable_type: "",
    assignable_id: null,
    work_schedule_id: null,
    starts_at: today(), // ✅ string
    ends_at: null,
  });


/**
 * API Response
 */
export type WorkScheduleAssignmentsApiResponse<T = WorkScheduleAssignment[]> = {
  success: boolean;
  messageAr: string;
  messageEn: string;
  data: T;
  pagination: PaginationMeta;
};

/**
 * Row Type
 */
export type WorkScheduleAssignmentRow = Pick<
  WorkScheduleAssignment,
  "id" | "work_schedule" | "assignable" | "starts_at" | "ends_at"
>;
