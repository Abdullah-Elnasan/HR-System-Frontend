<script setup lang="ts">
import { generateColumns } from "~/utils/generateColumns";
import type {
  AttendanceToday,
  AttendanceTodayForm,
} from "~/types/attendanceToday";
import { emptyAttendanceTodayForm } from "~/types/attendanceToday";
import { isAttendanceTodayRow } from "~/composables/attendances/today/isAttendanceTodayRow";
import { useAttendanceToday } from "~/composables/attendances/today/useAttendancesToday";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "dashboard",
  title: "حضور اليوم",
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
  // createRecord,
  // updateRecord,
} = useAttendanceToday();

// const open = ref(false);
// const titleDrower = ref("");

/* ================== Computed ================== */
const records = computed<AttendanceToday[]>(() => data.value ?? []);

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

/* ================== Status / Punch Label Maps ================== */
const statusLabels: Record<string, string> = {
  present: "حاضر",
  late: "متأخر",
  out: "خارج",
  absent: "غائب",
};

const punchLabels: Record<string, string> = {
  in: "دخول",
  out: "خروج",
};

/* ================== Columns ================== */
/* ================== Columns ================== */

const columns = computed(() =>
  records.value.length
    ? generateColumns<any>(
        records.value,
        {
          labels: {
            employee: "الموظف",
            work_date: "تاريخ العمل",
            first_check_in: "وقت الدخول",
            last_check_out: "وقت الخروج",

            // ربطنا التسميات بالحقول الجديدة المنسقة
            worked_formatted: "ساعات العمل",

            current_status: "الحالة الحالية",
            last_punch_type: "آخر نوع تسجيل",

            is_late: "دخول متأخر",
            late_minutes: "مدة التأخير", // تم التعديل

            is_early_leave: "خروج مبكر",
            early_leave_minutes: "مدة الخروج المبكر", // تم التعديل

            overtime_minutes: "الوقت الإضافي", // تم التعديل
            undertime_minutes: "وقت التقصير", // تم التعديل
            worked_minutes: 'وقت العمل',
            is_incomplete: "مكتمل",
            action: "العمليات",
          },
          exclude: [
            "id",
            "is_inside",
            "required_minutes",
            "created_at",
            "updated_at",
          ],
          columns: {
            employee: {type: "object", valueKey:"full_name", filterable: true },
            work_date: { type: "date" },
            first_check_in: { type: "date" }, // تأكد أن نوع date يعرض الوقت فقط إذا كان المطلوب H:i
            last_check_out: { type: "date" },

            // تمت إزالة { type: "number" } للحقول الزمنية لأنها أصبحت String
            current_status_label: { filterable: true },
            last_punch_type_label: { filterable: true },
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
// const editingId = ref<number | null>(null);
// const mode = computed(() => (editingId.value ? "edit" : "create"));
// const formModel = reactive<AttendanceTodayForm>(emptyAttendanceTodayForm());

// const openDrower = (payload: { title: string; row?: unknown }) => {
//   (document.activeElement as HTMLElement)?.blur();
//   open.value = !open.value;
//   titleDrower.value = payload.title;

//   if (payload.row && isAttendanceTodayRow(payload.row)) {
//     editingId.value = payload.row.id;
//     Object.assign(formModel, {
//       employee_id: payload.row.employee.id,
//       work_date: payload.row.work_date || null,
//       first_check_in: payload.row.first_check_in || null,
//       last_check_out: payload.row.last_check_out || null,
//       worked_minutes: payload.row.worked_minutes,
//       current_status: payload.row.current_status,
//       last_punch_type: payload.row.last_punch_type || "",
//     });
//   } else {
//     editingId.value = null;
//     Object.assign(formModel, emptyAttendanceTodayForm());
//   }
// };

// const formRef = ref<{ submit: () => void } | null>(null);

// const onSubmit = async (value: AttendanceTodayForm) => {
//   try {
//     if (editingId.value) {
//       await updateRecord(editingId.value, value);
//     } else {
//       await createRecord(value);
//     }
//     open.value = false;
//   } catch (error) {
//     console.error("Submit error:", error);
//   }
// };

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
    :data="records"
    :actions="{copy:false, view:false, edit:false}"
    :total="safePagination.total"
    :page="page"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :loading="pending"
    :meta="meta"
    :sorting="sorting"
    :global-filter="search"
    :column-filters="columnFilters"
    :btnCreate="false"
    title-btn-icon="lucide:user-check"
    title-btn-edit="تعديل سجل حضور"
    title-btn-create="إضافة سجل حضور"
    @update:page="onPageChange"
    @update:page-size="onPageSizeChange"
    @update:sorting="onSortingChange"
    @update:global-filter="onSearchGlobal"
    @update:column-filters="onColumnFiltersChange"
    @delete:row="onDeleteRecordHandler"
  />
  <!-- @drower:open="openDrower"
    @update:data="openDrower" -->

  <!-- <ClientOnly>
    <UDrawer
      v-model:open="open"
      :description="`إدارة حضور اليوم`"
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
          <FormsAttendanceTodayForm
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
  </ClientOnly> -->
</template>

<style scoped>
.ring-default {
  --tw-ring-color: #00dc82 !important;
}
</style>
