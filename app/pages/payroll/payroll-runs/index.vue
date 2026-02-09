<script setup lang="ts">
import { generateColumns } from "~/utils/generateColumns";
import type { PayrollRun, PayrollRunForm } from "~/types/payrolls/payrollRun";
import { emptyPayrollRunForm } from "~/types/payrolls/payrollRun";
import { isPayrollRunRow } from "~/composables/payrollRuns/isPayrollRunRow";
import { usePayrollRuns } from "~/composables/payrollRuns/usePayrollRuns";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "dashboard",
  title: "إدارة دورات الرواتب",
  keepalive: false,
});

/* ================== Composable ================== */
const {
  data,
  pagination,
  pending,
  page,
  pageSize,
  search,
  setPage,
  setPageSize,
  setSearch,
  aprooveRun,
} = usePayrollRuns();

/* ================== Computed ================== */
const runs = computed<PayrollRun[]>(() => data.value ?? []);
const router = useRouter();

const safePagination = computed(() => ({
  total: pagination.value?.total ?? 0,
  per_page: pagination.value?.per_page ?? pageSize.value,
  current_page: pagination.value?.current_page ?? page.value,
  last_page: pagination.value?.last_page ?? 1,
}));

/* ================== Table State ================== */
const pageSizes = [10, 50, 100];
const sorting = ref<any[]>([]);
const columnFilters = ref<any[]>([]);
const firstLoad = ref(true);

const meta = {
  class: {
    tr: (row: any) =>
      "bg-white dark:bg-gray-900 shadow-sm ring-1 ring-default/10 rounded-lg transition-shadow",
  },
};

/* ================== Status Labels ================== */
const statusLabels: Record<string, string> = {
  draft: "مسودة",
  processing: "قيد المعالجة",
  approved: "معتمد",
  paid: "مدفوع",
  cancelled: "ملغي",
};

/* ================== Enhanced Data ================== */
const enhancedRuns = computed(() =>
  runs.value.map((run) => ({
    ...run,
    status_label: statusLabels[run.status] ?? run.status,
  })),
);

/* ================== Columns ================== */
const columns = computed(() =>
  enhancedRuns.value.length
    ? generateColumns<any>(
        enhancedRuns.value,
        {
          labels: {
            period_start: "بداية الفترة",
            period_end: "نهاية الفترة",
            status_label: "الحالة",
            approved_by: "معتمد من (ID)",
            approved_by_name: "اسم المعتمد",
            payroll_run_name: "اسم الدورة",
            is_ready_for_approval: "إمكانية الاعتماد",
            approved_at: "تاريخ الاعتماد",
            action: "العمليات",
          },
          exclude: ["approved_by", "status", "created_at", "updated_at"],
          columns: {
            period_start: { type: "date" },
            period_end: { type: "date" },
            status_label: { filterable: true },
            approved_by: { type: "number" },
            approved_by_name: { filterable: true },
            approved_at: { type: "date" },
            action: { hideable: false },
          },
        },
        UButton,
      )
    : [],
);

/* ================== Effects ================== */
watch(
  runs,
  (val) => {
    if (val.length) firstLoad.value = false;
  },
  { immediate: true },
);

/* ================== Handlers ================== */
const onPageChange = (p: number) => setPage(p);
const onPageSizeChange = (s: number) => setPageSize(s);
const onSearchGlobal = (val: string) => setSearch(val);
const onSortingChange = (val: any[]) => (sorting.value = val);
const onColumnFiltersChange = (val: any[]) => (columnFilters.value = val);

/* ================== Form Management ================== */
const adoptionId = ref<number | null>(null);

const onSubmit = async (value: PayrollRunForm) => {
  try {
    console.log("value");
    console.log(value);
    await aprooveRun(value);
  } catch (error) {
    console.error("Submit error:", error);
  }
};

const onUpdateData = async (payload: { title: string; row?: unknown }) => {
  if (!payload.row) return;

  if (!isPayrollRunRow(payload.row)) return;

  const form: PayrollRunForm = {
    period_start: payload.row.period_start,
    period_end: payload.row.period_end,
  };

  await onSubmit(form);
};


function goToEmployee(row: { id: number }) {
  router.push(`/payroll/payroll-runs/${row.id}`); // أو أي مسار آخر
}

</script>

<template>
  <!-- Loading أول تحميل فقط -->
  <div
    v-if="firstLoad && pending"
    class="flex justify-center items-center py-20"
  >
    <span class="text-muted text-lg">جارٍ التحميل...</span>
  </div>

  <AppTable
    v-else
    :actions="{
      view: false,
      copy: false,
      edit: { label: 'اعتماد', icon: 'i-lucide-pen' },
      delete: false,
      displayMode: 'inline',
    }"
    :row-clickable="true"
    :on-row-click="goToEmployee"
    :columns="columns"
    :data="enhancedRuns"
    :total="safePagination.total"
    :page="page"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :loading="pending"
    :meta="meta"
    :sorting="sorting"
    :global-filter="search"
    :column-filters="columnFilters"
    title-btn-create="إضافة دورة رواتب"
    title-btn-icon="lucide:calendar-range"
    title-btn-edit="تعديل دورة رواتب"
    @update:page="onPageChange"
    @update:page-size="onPageSizeChange"
    @update:sorting="onSortingChange"
    @update:global-filter="onSearchGlobal"
    @update:column-filters="onColumnFiltersChange"
    @update:data="onUpdateData"
  />
</template>

<style scoped>
.ring-default {
  --tw-ring-color: #00dc82 !important;
}
</style>
