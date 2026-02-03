<script setup lang="ts">
import { generateColumns } from "~/utils/generateColumns";
import type {
  PayrollAssignment,
  PayrollAssignmentForm,
} from "~/types/payrollAssignments";
import { emptyPayrollAssignmentForm } from "~/types/payrollAssignments";
import { isPayrollAssignmentRow } from "~/composables/payrollAssignment/isPayrollAssignmentRow";
import { usePayrollAssignments } from "~/composables/payrollAssignment/usePayrollAssignments";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "dashboard",
  title: "إدارة إسناد أنظمة الرواتب",
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
  deleteAssignment,
  createAssignment,
  updateAssignment,
} = usePayrollAssignments();

const open = ref(false);
const titleDrower = ref("");

/* ================== Computed ================== */
const assignments = computed<PayrollAssignment[]>(() => data.value ?? []);

const safePagination = computed(() => ({
  total: pagination.value?.total ?? 0,
  per_page: pagination.value?.per_page ?? pageSize.value,
  current_page: pagination.value?.current_page ?? page.value,
  last_page: pagination.value?.last_page ?? 1,
}));

/* ================== Table State ================== */
const pageSizes = [5, 50, 100];
const sorting = ref<any[]>([]);
const columnFilters = ref<any[]>([]);
const firstLoad = ref(true);

const meta = {
  class: {
    tr: (row: any) =>
      "bg-white dark:bg-gray-900 shadow-sm ring-1 ring-default/10 rounded-lg transition-shadow",
  },
};

/* ================== Computed Status ================== */
const getAssignmentStatus = (assignment: PayrollAssignment) => {
  if (!assignment.effective_to) return "نشط";
  const endDate = new Date(assignment.effective_to);
  const now = new Date();
  return endDate > now ? "نشط" : "منتهي";
};

/* ================== Enhanced Data with Status ================== */
const enhancedAssignments = computed(() =>
  assignments.value.map((assignment) => ({
    ...assignment,
    assignable_type: assignment.assignable.type === "Employee" ? "موظف" : "فرع",
    assignable_name: assignment.assignable.name,
    payroll_system_name: assignment.payroll_system.name,
    status: getAssignmentStatus(assignment),
  })),
);

/* ================== Columns ================== */
const columns = computed(() =>
  enhancedAssignments.value.length
    ? generateColumns<any>(
        enhancedAssignments.value,
        {
          labels: {
            assignable_type: "نوع الإسناد",
            assignable_name: "الاسم",
            payroll_system_name: "نظام الرواتب",
            effective_from: "تاريخ السريان",
            effective_to: "تاريخ الانتهاء",
            status: "الحالة",
            action: "العمليات",
          },
          exclude: ["id", "payroll_system", "assignable"],
          columns: {
            assignable_type: { filterable: true },
            assignable_name: { filterable: true },
            payroll_system_name: { filterable: true },
            effective_from: { type: "date" },
            effective_to: { type: "date" },
            status: { filterable: true },
            action: { hideable: false },
          },
        },
        UButton,
      )
    : [],
);

/* ================== Effects ================== */
watch(
  assignments,
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
const formModel = reactive<PayrollAssignmentForm>(emptyPayrollAssignmentForm());

const openDrower = (payload: { title: string; row?: unknown }) => {
  (document.activeElement as HTMLElement)?.blur();
  open.value = !open.value;
  titleDrower.value = payload.title;

  if (payload.row && isPayrollAssignmentRow(payload.row)) {
    editingId.value = payload.row.id;
    Object.assign(formModel, {
      assignable_type: payload.row.assignable.type,
      assignable_id: payload.row.assignable.id,
      payroll_system_id: payload.row.payroll_system.id,
      effective_from: payload.row.effective_from || null,
      effective_to: payload.row.effective_to || null,
    });

    console.log(formModel);
  } else {
    editingId.value = null;
    Object.assign(formModel, emptyPayrollAssignmentForm());
  }
};

const formRef = ref<{ submit: () => void } | null>(null);

const onSubmit = async (value: PayrollAssignmentForm) => {
  try {
    const payload: Partial<PayrollAssignmentForm> = { ...value };
    if (editingId.value) {
      delete payload.assignable_type;
      delete payload.assignable_id;
      await updateAssignment(editingId.value, payload);
    } else {
      await createAssignment(value);
    }
    open.value = false;
  } catch (error) {
    console.error("Submit error:", error);
  }
};

const onDeleteAssignmentHandler = async (id: number) => {
  await deleteAssignment(id);
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
    :data="enhancedAssignments"
    :btn-create="true"
    :total="safePagination.total"
    :page="page"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :loading="pending"
    :meta="meta"
    :sorting="sorting"
    :global-filter="search"
    :column-filters="columnFilters"
    title-btn-create="إضافة إسناد رواتب"
    title-btn-icon="lucide:wallet-cards"
    title-btn-edit="تعديل إسناد رواتب"
    @update:page="onPageChange"
    @update:page-size="onPageSizeChange"
    @update:sorting="onSortingChange"
    @update:global-filter="onSearchGlobal"
    @update:column-filters="onColumnFiltersChange"
    @delete:row="onDeleteAssignmentHandler"
    @drower:open="openDrower"
    @update:data="openDrower"
  />

  <ClientOnly>
    <UDrawer
      v-model:open="open"
      :description="`إدارة إسناد أنظمة الرواتب`"
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
          <FormsPayrollSystemAssignmentFrom
            ref="formRef"
            v-model="formModel"
            :mode="mode"
            @submit="onSubmit"
            class="min-w-150 items-start"
            :columns="1"
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
