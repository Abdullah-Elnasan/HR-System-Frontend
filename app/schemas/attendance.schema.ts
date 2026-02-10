import { z } from 'zod'

export const attendanceSchema = z.object({
  employee_id: z
    .preprocess(
      (val) => {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      },
      z.number().int().nullable()
    ),

  device_id: z
    .preprocess(
      (val) => {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      },
      z.number().int().nullable()
    ),

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
    .preprocess(
      (val) => {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      },
      z.number().nullable()
    ),

  required_minutes: z
    .preprocess(
      (val) => {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      },
      z.number().nullable()
    ),

  overtime_minutes: z
    .preprocess(
      (val) => {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      },
      z.number().nullable()
    ),

  undertime_minutes: z
    .preprocess(
      (val) => {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      },
      z.number().nullable()
    ),

  late_minutes: z
    .preprocess(
      (val) => {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      },
      z.number().nullable()
    ),

  early_leave_minutes: z
    .preprocess(
      (val) => {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      },
      z.number().nullable()
    ),

  is_late: z
    .boolean()
    .nullable()
    .or(z.literal('')),

  is_early_leave: z
    .boolean()
    .nullable()
    .or(z.literal('')),

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
