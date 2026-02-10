// ~/composables/attendances/useAttendance.ts
import { useAttendanceStore } from '~/stores/attendances/attendances'
import type { AttendanceForm } from '~/types/attendance'
import { usePaginatedList } from '~/composables/usePaginatedList'

export function useAttendancePending() {
  const store = useAttendanceStore()
  const toast = useToast()

  const filters = {
    'filter[status]': 'pending',
  }

  const list = usePaginatedList({
    key: 'attendance-pending',
    endpoint: '/api/attendances/attendances',
    store: {
      setData: store.setRecords,
    },
    filters,
  })



  async function createRecord(payload: AttendanceForm) {
    try {
      return await store.createRecord(payload)
    } catch {
      toast.add({
        title: 'خطأ',
        description: 'فشل في إنشاء سجل الحضور',
        color: 'error',
      })
      throw new Error()
    }
  }

  async function updateRecord(id: number, payload: Partial<AttendanceForm>) {
    try {
      return await store.updateRecord(id, payload)
    } catch {
      toast.add({
        title: 'خطأ',
        description: 'فشل في تعديل سجل الحضور',
        color: 'error',
      })
      throw new Error()
    }
  }

  async function deleteRecord(id: number) {
    try {
      await store.deleteRecord(id)
    } catch {
      toast.add({
        title: 'خطأ',
        description: 'فشل في حذف سجل الحضور',
        color: 'error',
      })
      throw new Error()
    }
  }

  return {
    ...list,
    data: computed(() => store.records),
    pagination: computed(() => store.pagination),
    createRecord,
    updateRecord,
    deleteRecord,
  }
}
