// ~/composables/payroll-Items/usePayrollRecords.ts
import { usePayrollItemsStore } from '~/stores/PayrollItems/PayrollItems'
import type { PayrollItemForm } from '~/types/payrolls/payrollItem'
import { usePaginatedList } from '~/composables/usePaginatedList'

export function usePayrollItems() {
  const store = usePayrollItemsStore()
  const toast = useToast()

  /* ================== Paginated List ================== */
  const list = usePaginatedList({
    key: 'payroll-items',
    endpoint: '/api/payroll-items/payroll-items',
    store: {
      setData: store.setItems,
    },
  })

  /* ================== Fetch ================== */
  async function fetchItems(params?: Record<string, any>) {
    try {
      await store.fetchItems(params)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في جلب سجلات الرواتب',
        color: 'error',
      })
    }
  }

  async function fetchRecordById(id: number | string) {
    try {
      return await store.fetchItemById(id)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في جلب سجل الراتب',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== Create ================== */
  // async function createRecord(payload: PayrollItemForm) {
  //   try {
  //     return await store.createRecord(payload)
  //   } catch (error: any) {
  //     toast.add({
  //       title: 'خطأ',
  //       description: store.error ?? 'فشل في إنشاء سجل الراتب',
  //       color: 'error',
  //     })
  //     throw error
  //   }
  // }

  /* ================== Update ================== */
  async function updateItem(id: number, payload: Partial<PayrollItemForm>) {
    try {
      return await store.updateItem(id, payload)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في تعديل سجل الراتب',
        color: 'error',
      })
      throw error
    }
  }

  /* ================== Delete ================== */
  async function deleteItem(id: number) {
    try {
      await store.deleteItem(id)
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: store.error ?? 'فشل في حذف سجل الراتب',
        color: 'error',
      })
      throw error
    }
  }

  return {
    // من usePaginatedList
    ...list,

    // State
    data: computed(() => store.items),
    pagination: computed(() => store.pagination),
    loading: computed(() => store.loading),
    error: computed(() => store.error),

    // Actions
    fetchItems,
    fetchRecordById,
    // createItem,
    updateItem,
    deleteItem,

    // Utilities
    clearError: store.clearError,
  }
}
