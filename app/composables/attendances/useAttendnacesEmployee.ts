// ~/composables/attendances/useAttendnacesEmployee.ts
import dayjs from "dayjs";
import { useAttendanceEmployeeStore } from "~/stores/attendances/attendancesEmployee";
import { usePaginatedList } from "~/composables/usePaginatedList";

export function useAttendnacesEmployee(options?: {
  employeeId?: number;
  dateFrom?: string;
  dateTo?: string;
}) {
  const store = useAttendanceEmployeeStore();

  // 🗓️ الشهر الحالي افتراضيًا
  const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD");

  const filters = reactive<Record<string, any>>({
    "filter[employee_id]": options?.employeeId,
    "filter[date_from]": options?.dateFrom ?? startOfMonth,
    "filter[date_to]": options?.dateTo ?? endOfMonth,
  });

  const list = usePaginatedList({
    key: "attendance-employee",
    endpoint: "/api/attendances/attendances",
    store: {
      setData: store.setRecords,
    },
    filters,
  });

  // دالة لإعادة جلب البيانات مع فلاتر جديدة
  const refetch = async (newFilters: Record<string, any>) => {
    Object.assign(filters, newFilters);
    await list.refresh();
  };

  return {
    ...list,
    data: computed(() => store.records),
    pagination: computed(() => store.pagination),
    refetch,
  };
}
