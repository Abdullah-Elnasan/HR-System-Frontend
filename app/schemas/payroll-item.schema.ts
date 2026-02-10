import { z } from 'zod'

export const payrollItemSchema = z.object({
  manual_adjustment: z.preprocess(
    (val) => {
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    },
    z.number().nullable()
  ),

  adjustment_note: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),
})

export type PayrollItemForm = z.infer<typeof payrollItemSchema>
