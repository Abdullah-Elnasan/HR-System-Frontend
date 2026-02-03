// server/api/employees.get.ts
import { proxyFetch } from '../../utils/proxyFetch'

export default defineEventHandler(async (event) => {
  const res = await proxyFetch(event, '/attendance/today');
  return res;
})
