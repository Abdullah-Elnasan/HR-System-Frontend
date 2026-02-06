<script setup lang="ts">
import { generateColumns } from "~/utils/generateColumns";
import type { PayrollItem, PayrollItemForm } from "~/types/payrolls/payrollItem";
import { emptyPayrollItemForm } from "~/types/payrolls/payrollItem";
import { isPayrollItemRow } from "~/composables/payrollItems/isPayrollItemRow";
import { usePayrollItems } from "~/composables/payrollItems/usePayrollItems";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "dashboard",
  title: "إدارة سجلات الرواتب",
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
  deleteItem,
  // createRecord,
  updateItem,
} = usePayrollItems();

const open = ref(false);
const titleDrower = ref("");

/* ================== Computed ================== */
const items = computed<PayrollItem[]>(() => data.value ?? []);
console.log(items.value);
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
const enhancedItems = computed(() =>
  items.value.map((item) => ({
    ...item,
    // payroll_run_name: item.payroll_run_name,
    employee_name: item.employee.name_ar,
  }))
);

/* ================== Columns ================== */
const columns = computed(() =>
  enhancedItems.value.length
    ? generateColumns<any>(
        enhancedItems.value,
        {
          labels: {
            payroll_run_name: "دورة الرواتب",
            employee_name: "الموظف",
            period_start: "بداية الفترة",
            period_end: "نهاية الفترة",
            base_amount: "المبلغ الأساسي",
            overtime_amount: "مبلغ العمل الإضافي",
            currency: "العملة",
            manual_adjustment: "التعديل اليدوي",
            adjustment_note: "ملاحظة التعديل",
            total_amount: "المبلغ الإجمالي",
            action: "العمليات",
          },
          exclude: [
            "id",
            "payroll_run",
            "employee",
          ],
          columns: {
            payroll_run_name: { filterable: true },
            employee_name: { filterable: true },
            period_start: { type: "date" },
            period_end: { type: "date" },
            base_amount: { type: "number" },
            overtime_amount: { type: "number" },
            currency: { filterable: true },
            manual_adjustment: { type: "number" },
            adjustment_note: { hidden: true },
            total_amount: { type: "number" },
            action: { hideable: false },
          },
        },
        UButton
      )
    : []
);

/* ================== Effects ================== */
watch(
  items,
  (val) => {
    if (val.length) firstLoad.value = false;
  },
  { immediate: true }
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
const formModel = reactive<PayrollItemForm>(emptyPayrollItemForm());

const openDrower = (payload: { title: string; row?: unknown }) => {
  (document.activeElement as HTMLElement)?.blur();
  open.value = !open.value;
  titleDrower.value = payload.title;

  if (payload.row && isPayrollItemRow(payload.row)) {
    editingId.value = payload.row.id;
    Object.assign(formModel, {
      payroll_run_id: payload.row.payroll_run_id,
      employee_id: payload.row.employee.id,
      period_start: payload.row.period_start || null,
      period_end: payload.row.period_end || null,
      base_amount: payload.row.base_amount,
      overtime_amount: payload.row.overtime_amount,
      currency: payload.row.currency,
      manual_adjustment: payload.row.manual_adjustment,
      adjustment_note: payload.row.adjustment_note || "",
      total_amount: payload.row.total_amount,
    });
  } else {
    editingId.value = null;
    Object.assign(formModel, emptyPayrollItemForm());
  }
};

const formRef = ref<{ submit: () => void } | null>(null);

const onSubmit = async (value: PayrollItemForm) => {
  try {
    if (editingId.value) {
      await updateItem(editingId.value, value);
    } else {
      // await createRecord(value);
    }
    open.value = false;
  } catch (error) {
    console.error("Submit error:", error);
  }
};

const onDeleteRecordHandler = async (id: number) => {
  await deleteItem(id);
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
    :data="enhancedItems"
    :total="safePagination.total"
    :page="page"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :loading="pending"
    :meta="meta"
    :sorting="sorting"
    :global-filter="search"
    :column-filters="columnFilters"
    title-btn-create="إضافة سجل راتب"
    title-btn-icon="lucide:receipt-text"
    title-btn-edit="تعديل سجل راتب"
    @update:page="onPageChange"
    @update:page-size="onPageSizeChange"
    @update:sorting="onSortingChange"
    @update:global-filter="onSearchGlobal"
    @update:column-filters="onColumnFiltersChange"
    @delete:row="onDeleteRecordHandler"
    @drower:open="openDrower"
    @update:data="openDrower"
  />

  <ClientOnly>
    <UDrawer
      v-model:open="open"
      :description="`إدارة سجلات الرواتب`"
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
          <FormsPayrollRecordForm
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
          label="إرسال"
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
