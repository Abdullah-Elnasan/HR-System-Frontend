// ~/composables/attendances/useAttendance.ts
import { useAttendanceStore } from '~/stores/attendances/attendances'
import type { AttendanceForm } from '~/types/attendance'
import { usePaginatedList } from '~/composables/usePaginatedList'
import dayjs from 'dayjs'

export function useAttendance(options?: {
  dateFrom?: string;
  dateTo?: string;
  branchId?: number | null;
  departmentId?: number | null;
  status?: string | null;
}) {
  const store = useAttendanceStore()
  const toast = useToast()

  /* ================== Default Filters ================== */
  // 🗓️ الشهر الحالي افتراضيًا
  const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD')
  const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD')

  // بناء الفلاتر الأولية
  const filters = reactive<Record<string, any>>({
    'filter[date_from]': options?.dateFrom ?? startOfMonth,
    'filter[date_to]': options?.dateTo ?? endOfMonth,
  })

  // إضافة الفلاتر الاختيارية
  if (options?.branchId !== undefined && options.branchId !== null) {
    filters['filter[branch_id]'] = options.branchId
  }
  if (options?.departmentId !== undefined && options.departmentId !== null) {
    filters['filter[department_id]'] = options.departmentId
  }
  if (options?.status !== undefined && options.status !== null) {
    filters['filter[status]'] = options.status
  }

  /* ================== Paginated List ================== */
  const list = usePaginatedList({
    key: 'attendance',
    endpoint: '/api/attendances/attendances',
    store: {
      setData: store.setRecords,
    },
    filters,
  })

  /* ================== Refetch with New Filters ================== */
  async function refetch(newFilters: Record<string, any>) {
    try {
      // تحديث الفلاتر
      Object.keys(newFilters).forEach(key => {
        if (newFilters[key] === null || newFilters[key] === undefined) {
          delete filters[key]
        } else {
          filters[key] = newFilters[key]
        }
      })

      // إعادة جلب البيانات
      await list.refresh()
    } catch (error: any) {
      toast.add({
        title: 'خطأ',
        description: 'فشل في تحديث البيانات',
        color: 'error',
      })
    }
  }

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
    refetch, // ✅ إضافة دالة refetch

    // Utilities
    clearError: store.clearError,
  }
}
