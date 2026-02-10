// schemas/payroll-system.schema.ts
import { z } from 'zod'


export const payrollSystemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'الاسم مطلوب' })
    .max(255, { message: 'الاسم يجب ألا يتجاوز 255 حرفًا' }),

  salary_type: z
    .string()
    .optional()
    .or(z.literal('')),

  monthly_salary: z
    .number()
    .nullable().or(z.literal('')),

  hourly_rate: z
    .number()
    .nullable().or(z.literal('')),

  overtime_base_rate: z
    .number()
    .min(0, { message: 'قيمة العمل الإضافي يجب أن تكون أكبر أو تساوي 0' }),

  deduct_missing_time: z
    .boolean(),

  is_active: z
    .boolean(),

  currency: z
    .string()
    .optional()
    .or(z.literal('')),
})

export type PayrollSystemForm = z.infer<typeof payrollSystemSchema>
