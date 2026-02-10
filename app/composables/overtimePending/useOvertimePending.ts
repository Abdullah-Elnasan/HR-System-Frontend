// ~/composables/overtime-pending/useOvertimePending.ts
import { useOvertimePendingStore } from '~/stores/overtimePending/overtimePending'
import type { OvertimePendingForm } from '~/types/payrolls/overtimePending'
import { usePaginatedList } from '~/composables/usePaginatedList'

export function useOvertimePending() {
  const store = useOvertimePendingStore()
  const toast = useToast()

  /* ================== Paginated List ================== */
  const list = usePaginatedList({
    key: 'overtime-pending',
    endpoint: '/api/overtime-pending/overtime-pending',
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

  /* ================== Create ================== */
  async function createRecord(payload: OvertimePendingForm) {
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
    createRecord,

    // Utilities
    clearError: store.clearError,
  }
}
