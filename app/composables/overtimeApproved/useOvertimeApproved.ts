import { useOvertimeApprovedStore } from '~/stores/overtimeApproved/overtimeApproved'
import type { OvertimeApprovedForm } from '~/types/payrolls/overtimeApproved'
import { usePaginatedList } from '~/composables/usePaginatedList'

export function useOvertimeApproved() {
  const store = useOvertimeApprovedStore()
  const toast = useToast()

  /* ================== Paginated List ================== */
  const list = usePaginatedList({
    key: 'overtime-pending',
    endpoint: '/api/overtime-approved/overtime-approved',
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
        description: store.error ?? 'فشل في جلب سجلات الوقت الإضافي',
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
        description: store.error ?? 'فشل في جلب سجل الوقت الإضافي',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== Create ================== */
  async function createRecord(payload: OvertimeApprovedForm) {
    try {
      return await store.createRecord(payload)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في إنشاء سجل الوقت الإضافي',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== Update ================== */
  async function updateRecord(id: number, payload: Partial<OvertimeApprovedForm>) {
    try {
      return await store.updateRecord(id, payload)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في تعديل سجل الوقت الإضافي',
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
        description: store.error ?? 'فشل في حذف سجل الوقت الإضافي',
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
