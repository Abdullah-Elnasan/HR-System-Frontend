<script setup lang="ts">
import { generateColumns } from "~/utils/generateColumns";

import { isAttendanceRow } from "~/composables/attendances/isAttendanceRow";
import { useAttendance } from "~/composables/attendances/useAttendance";
import {
  emptyAttendanceForm,
  type Attendance,
  type AttendanceForm,
} from "~/types/attendance";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "dashboard",
  title: "إدارة الحضور",
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
  deleteRecord,
  createRecord,
  updateRecord,
} = useAttendance();

const open = ref(false);
const titleDrower = ref("");

/* ================== Computed ================== */
const records = computed<Attendance[]>(() => data.value ?? []);

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
  present: "حاضر",
  absent: "غائب",
  late: "متأخر",
  early_leave: "مغادرة مبكرة",
  half_day: "نصف يوم",
  incomplete: "مكتمل",
};

/* ================== Enhanced Data ================== */
const enhancedRecords = computed(() =>
  records.value.map((record) => ({
    ...record,
    // employee_name: record.employee.name_ar,
    status_label: statusLabels[record.status] ?? record.status,
    status_label_re:
      statusLabels[record.attendance_status] ?? record.attendance_status,
  })),
);

/* ================== Columns ================== */
const columns = computed(() =>
  enhancedRecords.value.length
    ? generateColumns<any>(
        enhancedRecords.value,
        {
          labels: {
            employee: "الموظف",
            date: "التاريخ",
            device_id: "الجهاز",
            check_in_time: "وقت الدخول",
            check_out_time: "وقت الخروج",
            required_time: "الساعات المطلوبة",
            work_time: "ساعات العمل الفعلية",
            is_late: "دخول متأخر",
            late_time: "مدة التأخير", // تم التعديل
            is_early_leave: "خروج مبكر",
            early_leave_time: "مدة الخروج المبكر", // تم التعديل
            overtime_time: "ساعات العمل الإضافي",
            undertime_time: "ساعات التقصير",
            status_label_re: "حالة الحضور",
            status_label: "حالة السجل",
            action: "العمليات",
          },
          exclude: [
            "status",
            "created_at",
            "updated_at",
            "attendance_status",
            "check_in",
            "check_out",
            "early_leave_minutes",
            "late_minutes",
            "overtime_minutes",
            "undertime_minutes",
            "work_minutes",
            "required_minutes",
          ],
          columns: {
            employee: {
              type: "object",
              valueKey: "full_name",
              filterable: true,
            },
            date: { type: "date" },
            check_in: { type: "date" },
            check_out: { type: "date" },
            undertime_time: { type: "number" },
            // required_minutes: { type: "number" },
            // overtime_minutes: { type: "number" },
            // undertime_minutes: { type: "number" },
            status_label: { filterable: true },
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
const formModel = reactive<AttendanceForm>(emptyAttendanceForm());

const openDrower = (payload: { title: string; row?: unknown }) => {
  (document.activeElement as HTMLElement)?.blur();
  open.value = !open.value;
  titleDrower.value = payload.title;

  if (payload.row && isAttendanceRow(payload.row)) {
    editingId.value = payload.row.id;
    Object.assign(formModel, {
      employee_id: payload.row.employee.id,
      date: payload.row.date || null,
      check_in: payload.row.check_in || null,
      check_out: payload.row.check_out || null,
      work_minutes: payload.row.work_minutes,
      required_minutes: payload.row.required_minutes,
      overtime_minutes: payload.row.overtime_minutes,
      attendance_status: payload.row.attendance_status,
      late_minutes: payload.row.late_minutes,
      early_leave_minutes: payload.row.early_leave_minutes,
      is_late: payload.row.is_late,
      is_early_leave: payload.row.is_early_leave,
      status: payload.row.status,
    });
  } else {
    editingId.value = null;
    Object.assign(formModel, emptyAttendanceForm());
  }
};

const formRef = ref<{ submit: () => void } | null>(null);

const onSubmit = async (value: AttendanceForm) => {
  try {
    if (editingId.value) {
      await updateRecord(editingId.value, value);
    } else {
      await createRecord(value);
    }
    open.value = false;
  } catch (error) {
    console.error("Submit error:", error);
  }
};

const onDeleteRecordHandler = async (id: number) => {
  await deleteRecord(id);
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
    :total="safePagination.total"
    :page="page"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :loading="pending"
    :meta="meta"
    :sorting="sorting"
    :global-filter="search"
    :column-filters="columnFilters"
    :btnCreate="true"
    title-btn-create="إضافة سجل حضور"
    title-btn-icon="lucide:calendar-check"
    title-btn-edit="تعديل سجل حضور"
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
      :description="`إدارة الحضور`"
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
          <FormsAttendancesForm
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
