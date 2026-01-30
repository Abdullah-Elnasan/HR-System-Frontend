import { apiFetch } from '../../utils/apiFetch'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'work-schedule-assignments id is required',
    })
  }

  return await apiFetch(`/work-schedule-assignments/${id}`, {
    method: 'DELETE',
  })
})
