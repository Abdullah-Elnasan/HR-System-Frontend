import { proxyFetch } from '../../utils/proxyFetch'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'payroll-runs ID is required',
    })
  }

  console.log(`/payroll-runs/${id}/entries`)
  return proxyFetch(event, `/payroll-runs/${id}/entries`)
})


