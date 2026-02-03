// schemas/attendance.schema.ts
import { z } from 'zod'

/**
 * Attendance form validation schema
 * متوافق مع Laravel FormRequest
 */
export const attendanceSchema = z.object({
  employee_id: z
    .number()
    .nullable(),

  device_id: z
    .number()
    .nullable(),

  date: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),

  check_in: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),

  check_out: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),

  work_minutes: z
    .number()
    .nullable(),

  required_minutes: z
    .number()
    .nullable(),

  overtime_minutes: z
    .number()
    .nullable(),

  undertime_minutes: z
    .number()
    .nullable(),

  late_minutes: z
    .number()
    .nullable(),

  early_leave_minutes: z
    .number()
    .nullable(),

  is_late: z
    .boolean()
    .nullable(),

  is_early_leave: z
    .boolean()
    .nullable(),

  attendance_status: z
    .string()
    .optional()
    .or(z.literal('')),

  status: z
    .string()
    .optional()
    .or(z.literal('')),
})

export type AttendanceForm = z.infer<typeof attendanceSchema>
