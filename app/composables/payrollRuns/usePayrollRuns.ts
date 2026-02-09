// ~/composables/payroll-runs/usePayrollRuns.ts
import { usePayrollRunsStore } from '~/stores/payrollRuns/payrollRuns'
import type { PayrollRunForm } from '~/types/payrolls/payrollRun'
import { usePaginatedList } from '~/composables/usePaginatedList'

export function usePayrollRuns() {
  const store = usePayrollRunsStore()
  const toast = useToast()

  /* ================== Paginated List ================== */
  const list = usePaginatedList({
    key: 'payroll-runs',
    endpoint: '/api/payroll-runs/payroll-runs',
    store: {
      setData: store.setRuns,
    },
  })

  /* ================== Fetch ================== */
  async function fetchRuns(params?: Record<string, any>) {
    try {
      await store.fetchRuns(params)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في جلب دورات الرواتب',
        color: 'error',
      })
    }
  }

  async function fetchRunById(id: number | string) {
    try {
      return await store.fetchRunById(id)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في جلب دورة الرواتب',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== aprooveRun ================== */
  async function aprooveRun(payload: PayrollRunForm) {
    try {
      return await store.aprooveRun(payload)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في إنشاء دورة الرواتب',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== Update ================== */
  async function updateRun(id: number, payload: Partial<PayrollRunForm>) {
    try {
      return await store.updateRun(id, payload)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في تعديل دورة الرواتب',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== Delete ================== */
  async function deleteRun(id: number) {
    try {
      await store.deleteRun(id)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في حذف دورة الرواتب',
        color: 'error',
      })
      throw error
    }
  }

  return {
    // من usePaginatedList
    ...list,

    // State
    data: computed(() => store.runs),
    pagination: computed(() => store.pagination),
    loading: computed(() => store.loading),
    error: computed(() => store.error),

    // Actions
    fetchRuns,
    fetchRunById,
    aprooveRun,
    updateRun,
    deleteRun,

    // Utilities
    clearError: store.clearError,
  }
}
