import { z } from 'zod'

export const overtimeApprovedSchema = z.object({
  employee_name: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),

  approved_minutes: z.preprocess(
    (val) => {
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    },
    z.number().min(0, { message: "الدقائق يجب أن تكون أكبر من أو تساوي صفر" }).nullable()
  ),

  rate_multiplier: z.preprocess(
    (val) => {
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    },
    z.number().min(1, { message: "معامل السعر يجب أن يكون أكبر من أو يساوي 1" }).nullable()
  ),
})

export type OvertimeApprovedForm = z.infer<typeof overtimeApprovedSchema>
