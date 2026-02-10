<script setup lang="ts">
import { generateColumns } from "~/utils/generateColumns";
import type {
  OvertimePending,
  OvertimePendingForm,
} from "~/types/payrolls/overtimePending";
import { emptyOvertimePendingForm } from "~/types/payrolls/overtimePending";
import { isOvertimePendingRow } from "~/composables/overtimePending/isOvertimePendingRow";
import { useOvertimePending } from "~/composables/overtimePending/useOvertimePending";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "dashboard",
  title: "إدارة الوقت الإضافي المعلق",
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
  createRecord,
} = useOvertimePending();

const open = ref(false);
const titleDrower = ref("");

/* ================== Computed ================== */
const records = computed<OvertimePending[]>(() => data.value ?? []);

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

/* ================== Enhanced Data ================== */
const enhancedRecords = computed(() =>
  records.value.map((record) => ({
    ...record,
    // employee_name: record.employee.name_ar,
    // payroll_run_name: record.payroll_run?.name ?? "—",
    // status_label: statusLabels[record.status] ?? record.status,
  })),
);

/* ================== Columns ================== */
const columns = computed(() =>
  enhancedRecords.value.length
    ? generateColumns<any>(
        enhancedRecords.value,
        {
          labels: {
            employee_name: "الموظف",
            suggested_date_from: "من تاريخ",
            suggested_date_to: "إلى تاريخ",
            actual_minutes: "الدقائق",
            last_settlement_date: "آخر اعتماد",
            action: "العمليات",
          },
          exclude: ["employee_id", "department_id"],
          columns: {
            employee_name: { filterable: true },
            suggested_date_from: { type: "date" },
            suggested_date_to: { type: "date" },
            last_settlement_date: { type: "date" },
            action: { hideable: false },
          },
        },
        UButton,
      )
    : [],
);

/* ================== Effects ================== */
watch(
  records,
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
const editingId = ref<number | null>(null);
const mode = computed(() => (editingId.value ? "edit" : "create"));
const formModel = reactive<OvertimePendingForm>(emptyOvertimePendingForm());

const openDrower = (payload: { title: string; row?: unknown }) => {
  (document.activeElement as HTMLElement)?.blur();
  open.value = !open.value;
  titleDrower.value = payload.title;
  if (payload.row && isOvertimePendingRow(payload.row)) {
    Object.assign(formModel, {
      employee_id: payload.row.employee_id,
      employee_name: payload.row.employee_name,
      date_from: payload.row.suggested_date_from || null,
      date_to: payload.row.suggested_date_to || null,
      approved_minutes: payload.row.approved_minutes,
      rate_multiplier: payload.row.rate_multiplier,
    });
  }
};

const formRef = ref<{ submit: () => void } | null>(null);

const onSubmit = async (value: OvertimePendingForm) => {
  try {
    await createRecord(value);
    open.value = false;
  } catch (error) {
    console.error("Submit error:", error);
  }
};
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
    :columns="columns"
    :data="enhancedRecords"
    :actions="{
      view: false,
      copy: false,
      edit: { label: 'اعتماد', icon: 'i-lucide-pen' },
      delete: false,
      displayMode: 'inline',
    }"
    :total="safePagination.total"
    :page="page"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :loading="pending"
    :meta="meta"
    :sorting="sorting"
    :global-filter="search"
    :column-filters="columnFilters"
    title-btn-create="إضافة وقت إضافي"
    title-btn-icon="lucide:clock-alert"
    title-btn-edit="اعتماد وقت إضافي"
    @update:page="onPageChange"
    @update:page-size="onPageSizeChange"
    @update:sorting="onSortingChange"
    @update:global-filter="onSearchGlobal"
    @update:column-filters="onColumnFiltersChange"
    @drower:open="openDrower"
    @update:data="openDrower"
  />

  <ClientOnly>
    <UDrawer
      v-model:open="open"
      :description="`إدارة الوقت الإضافي المعلق`"
      direction="left"
      :title="titleDrower"
      :ui="{
        body: 'drower space-y-5 pt-0',
        header: 'hidden',
        title: 'text-primary',
        container: 'px-4 gap-y-10 drower',
        overlay: 'bg-green-400/30',
        content:
          'shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] ps-2',
      }"
    >
      <template #body>
        <div class="flex items-center justify-end gap-2">
          <h2 class="text-highlighted font-semibold">{{ titleDrower }}</h2>

          <UIcon
            v-if="editingId"
            name="solar:pen-new-round-linear"
            class="size-5"
          />
          <UIcon
            v-else
            name="ic:baseline-control-point-duplicate"
            class="size-5"
          />
        </div>

        <ClientOnly>
          <FormsPayrollOvertimePendingForm
            ref="formRef"
            v-model="formModel"
            :mode="mode"
            @submit="onSubmit"
            class="min-w-150 items-start"
          />
        </ClientOnly>
      </template>

      <template #footer>
        <UButton
          label="اعتماد"
          color="neutral"
          class="justify-center"
          @click="formRef?.submit()"
        />

        <UButton
          label="إغلاق"
          color="neutral"
          variant="outline"
          class="justify-center"
          @click="open = false"
        />
      </template>
    </UDrawer>
  </ClientOnly>
</template>

<style scoped>
.ring-default {
  --tw-ring-color: #00dc82 !important;
}
</style>
