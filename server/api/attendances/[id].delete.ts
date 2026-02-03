import { apiFetch } from '../../utils/apiFetch'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Attendance id is required',
    })
  }

  return await apiFetch(`/attendances/${id}`, {
    method: 'DELETE',
  })
})
