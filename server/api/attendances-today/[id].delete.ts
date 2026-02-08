import { apiFetch } from '../../utils/apiFetch'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'attendance toda id is required',
    })
  }

  return await apiFetch(`/attendance/today/${id}`, {
    method: 'DELETE',
  })
})
