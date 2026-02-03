// ~/composables/attendance/useAttendance.ts
import { useAttendanceStore } from '~/stores/attendances/attendances'
import type { AttendanceForm } from '~/types/attendance'
import { usePaginatedList } from '~/composables/usePaginatedList'

export function useAttendance() {
  const store = useAttendanceStore()
  const toast = useToast()

  /* ================== Paginated List ================== */
  const list = usePaginatedList({
    key: 'attendance',
    endpoint: '/api/attendances/attendances',
    store: {
      setData: store.setRecords,
    },
  })

  /* ================== Fetch ================== */
  async function fetchRecords(params?: Record<string, any>) {
    try {
      await store.fetchRecords(params)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في جلب سجلات الحضور',
        color: 'error',
      })
    }
  }

  async function fetchRecordById(id: number | string) {
    try {
      return await store.fetchRecordById(id)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في جلب سجل الحضور',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== Create ================== */
  async function createRecord(payload: AttendanceForm) {
    try {
      return await store.createRecord(payload)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في إنشاء سجل الحضور',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== Update ================== */
  async function updateRecord(id: number, payload: Partial<AttendanceForm>) {
    try {
      return await store.updateRecord(id, payload)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في تعديل سجل الحضور',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== Delete ================== */
  async function deleteRecord(id: number) {
    try {
      await store.deleteRecord(id)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في حذف سجل الحضور',
        color: 'error',
      })
      throw error
    }
  }

  return {
    // من usePaginatedList
    ...list,

    // State
    data: computed(() => store.records),
    pagination: computed(() => store.pagination),
    loading: computed(() => store.loading),
    error: computed(() => store.error),

    // Actions
    fetchRecords,
    fetchRecordById,
    createRecord,
    updateRecord,
    deleteRecord,

    // Utilities
    clearError: store.clearError,
  }
}
