// schemas/attendance-today.schema.ts
import { z } from 'zod'

/**
 * AttendanceToday form validation schema
 * متوافق مع Laravel FormRequest
 */
export const attendanceTodaySchema = z.object({
  employee_id: z
    .number()
    .nullable(),

  work_date: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),

  first_check_in: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),

  last_check_out: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),

  worked_minutes: z
    .number(),

  current_status: z
    .string()
    .optional()
    .or(z.literal('')),

  last_punch_type: z
    .string()
    .optional()
    .or(z.literal('')),
})

export type AttendanceTodayForm = z.infer<
  typeof attendanceTodaySchema
>
