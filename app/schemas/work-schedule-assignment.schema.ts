// schemas/workScheduleAssignment.schema.ts
import { z } from 'zod'

export const workScheduleAssignmentSchema = z.object({
  assignable_type: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')), // نوع الإسناد

  assignable_id: z.preprocess(
    (val) => {
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    },
    z.number().int().nullable()
  ),

  work_schedule_id: z.preprocess(
    (val) => {
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    },
    z.number().int().nullable()
  ),

  starts_at: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')), // تاريخ البداية

  ends_at: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')), // تاريخ النهاية
})

export type WorkScheduleAssignmentForm = z.infer<typeof workScheduleAssignmentSchema>
