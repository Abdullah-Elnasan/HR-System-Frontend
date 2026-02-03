import { apiFetch } from '../../utils/apiFetch'
import { readFormData, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Attendance ID is required',
    })
  }

  const formData = await readFormData(event)
  console.log(formData)
  return apiFetch(`/attendances/${id}`, {
    method: 'PUT',
    body: formData,
  })
})
