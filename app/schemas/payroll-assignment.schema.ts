// schemas/payroll-assignment.schema.ts
import { z } from 'zod'

export const payrollAssignmentSchema = z.object({
  assignable_type: z
    .string()
    .optional()
    .or(z.literal('')),

  assignable_id: z
    .number()
    .nullable().or(z.literal('')),

  payroll_system_id: z
    .number()
    .nullable().or(z.literal('')),

  effective_from: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),

  effective_to: z
    .string()
    .nullable()
    .optional()
    .or(z.literal('')),
})

export type PayrollAssignmentForm = z.infer<
  typeof payrollAssignmentSchema
>
