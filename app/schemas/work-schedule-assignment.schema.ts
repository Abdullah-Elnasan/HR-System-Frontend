// schemas/work-schedule-assignment.schema.ts
import { z } from 'zod'

/**
 * WorkScheduleAssignment form validation schema
 * متوافق مع Laravel FormRequest
 */
export const workScheduleAssignmentSchema = z.object({
  assignable_type: z
    .string()
    .optional()
    .or(z.literal('')),

  assignable_id: z
    .number()
    .nullable(),

  work_schedule_id: z
    .number()
    .nullable(),

  starts_at: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),

  ends_at: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),
})

export type WorkScheduleAssignmentForm = z.infer<
  typeof workScheduleAssignmentSchema
>
