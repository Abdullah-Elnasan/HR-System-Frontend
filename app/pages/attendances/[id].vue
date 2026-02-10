<script setup lang="ts">
import { generateColumns } from "~/utils/generateColumns";
import type { Attendance } from "~/types/attendance";
import dayjs from "dayjs";
import { useAttendnacesEmployee } from "~/composables/attendances/useAttendnacesEmployee";
import { watchDebounced } from "@vueuse/core";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "dashboard",
  title: "سجلات حضور الموظف",
});

/* ================== Route ================== */
const route = useRoute();
const employeeId = Number(route.params.id);

/* ================== Date Filters (Current Month) ================== */
const dateFrom = ref(dayjs().startOf("month").format("YYYY-MM-DD"));
const dateTo = ref(dayjs().endOf("month").format("YYYY-MM-DD"));

/* ================== Composable ================== */
const {
  data,
  pagination,
  pending,
  page,
  pageSize,
  setPage,
  setPageSize,
  refetch,
} = useAttendnacesEmployee({
  employeeId,
  dateFrom: dateFrom.value,
  dateTo: dateTo.value,
});

/* ================== Computed ================== */
const records = computed<Attendance[]>(() => data.value ?? []);

const safePagination = computed(() => ({
  total: pagination.value?.total ?? 0,
}));

const firstLoad = ref(true);

/* ================== Enhanced Records ================== */
const statusLabels: Record<string, string> = {
  present: "حاضر",
  absent: "غائب",
  late: "متأخر",
  early_leave: "مغادرة مبكرة",
  half_day: "نصف يوم",
  incomplete: "غير مكتمل",
};

const enhancedRecords = computed(() =>
  records.value.map((record) => ({
    ...record,
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

// Watch للفترة الزمنية مع Debounce
watchDebounced(
  [dateFrom, dateTo],
  async ([newFrom, newTo]) => {
    if (newFrom && newTo && dayjs(newFrom).isValid() && dayjs(newTo).isValid()) {
      await refetch({
        "filter[date_from]": newFrom,
        "filter[date_to]": newTo,
      });
    }
  },
  { debounce: 500 },
);

/* ================== Pagination ================== */
const onPageChange = (p: number) => setPage(p);
const onPageSizeChange = (s: number) => setPageSize(s);

/* ================== Quick Date Filters ================== */
const setDateRange = (range: "today" | "week" | "month" | "year") => {
  switch (range) {
    case "today":
      dateFrom.value = dayjs().format("YYYY-MM-DD");
      dateTo.value = dayjs().format("YYYY-MM-DD");
      break;
    case "week":
      dateFrom.value = dayjs().startOf("week").format("YYYY-MM-DD");
      dateTo.value = dayjs().endOf("week").format("YYYY-MM-DD");
      break;
    case "month":
      dateFrom.value = dayjs().startOf("month").format("YYYY-MM-DD");
      dateTo.value = dayjs().endOf("month").format("YYYY-MM-DD");
      break;
    case "year":
      dateFrom.value = dayjs().startOf("year").format("YYYY-MM-DD");
      dateTo.value = dayjs().endOf("year").format("YYYY-MM-DD");
      break;
  }
};
</script>

<template>
  <div>
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
      :page-size="pageSize"
      :loading="pending"
      :btnCreate="false"
      titleBtnCreate=""
      titleBtnIcon=""
      titleBtnEdit=""
      @update:page="onPageChange"
      @update:page-size="onPageSizeChange"
    >
      <!-- Slot للفلاتر المخصصة -->
      <template #toolbar-prepend>
        <div class="flex gap-2 items-center">
          <!-- أزرار سريعة -->
          <UButton
            label="اليوم"
            size="sm"
            variant="outline"
            color="neutral"
            @click="setDateRange('today')"
          />
          <UButton
            label="هذا الأسبوع"
            size="sm"
            variant="outline"
            color="neutral"
            @click="setDateRange('week')"
          />
          <UButton
            label="هذا الشهر"
            size="sm"
            variant="outline"
            color="neutral"
            @click="setDateRange('month')"
          />
          <UButton
            label="هذا العام"
            size="sm"
            variant="outline"
            color="neutral"
            @click="setDateRange('year')"
          />

          <!-- فلاتر التاريخ -->
          <div class="flex gap-2 items-center border-r pr-2">
            <label class="text-sm text-muted">من:</label>
            <UInput type="date" v-model="dateFrom" class="w-40" />
          </div>
          <div class="flex gap-2 items-center">
            <label class="text-sm text-muted">إلى:</label>
            <UInput type="date" v-model="dateTo" class="w-40" />
          </div>
        </div>
      </template>
    </AppTable>
  </div>
</template>
