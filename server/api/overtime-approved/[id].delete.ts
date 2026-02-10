import { apiFetch } from '../../utils/apiFetch'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'overtime-approvals ID is required',
    })
  }

  return await apiFetch(`/overtime-approvals/${id}`, {
    method: 'DELETE',
  })
})
