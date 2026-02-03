// schemas/payroll-assignment.schema.ts
import { z } from 'zod'

/**
 * PayrollAssignment form validation schema
 * متوافق مع Laravel FormRequest
 */
export const payrollAssignmentSchema = z.object({
  assignable_type: z
    .string()
    .optional()
    .or(z.literal('')),

  assignable_id: z
    .number()
    .nullable(),

  payroll_system_id: z
    .number()
    .nullable(),

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
