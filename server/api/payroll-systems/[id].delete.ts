import { apiFetch } from '../../utils/apiFetch'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'payroll-systems ID is required',
    })
  }

  return await apiFetch(`/payroll-systems/${id}`, {
    method: 'DELETE',
  })
})
