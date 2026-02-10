<script setup lang="ts">
import type { AttendanceForm } from "~/types/attendance";
import type { Field } from "~/components/generic-form.vue";
import { useFormModel } from "~/composables/useFormModel";
import { CalendarDate } from "@internationalized/date";
import { attendanceSchema } from "~/schemas/attendance.schema";

/* ================== Props / Emits ================== */
const props = defineProps<{
  modelValue: AttendanceForm;
  mode?: "create" | "edit";
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: AttendanceForm): void;
  (e: "submit", v: AttendanceForm): void;
}>();

const model = useFormModel(toRef(props, "modelValue"), emit);

/* ================== Date / Datetime Helpers ================== */
const stringToCalendarDate = (
  dateString: string | null | undefined,
): CalendarDate => {
  if (dateString) {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]);
      const day = Number(parts[2]);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new CalendarDate(year, month, day);
      }
    }
  }
  const today = new Date();
  return new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
};

// date
const dateCalendar = computed({
  get: () => stringToCalendarDate(model.value.date),
  set: (val) => (model.value.date = val.toString()),
});

const normalizeDateTime = (value?: string | null): string | null => {
  if (!value) return null;
  return value.includes("T") ? value : value.replace(" ", "T");
};

// check_out - Date + Time
const checkOutCalendar = computed({
  get: () => {
    if (!model.value.check_out) return stringToCalendarDate(model.value.date);
    const datePart = model.value.check_out.split("T")[0];
    return stringToCalendarDate(datePart);
  },
  set: (val) => {
    const existingTime = extractTime(model.value.check_out) || "00:00";
    model.value.check_out = `${val.toString()}T${existingTime}:00`;
  },
});

/* ================== Time Helpers ================== */
const extractTime = (datetime: string | null | undefined): string => {
  const normalized = normalizeDateTime(datetime);
  if (!normalized) return "";
  const timePart = normalized.split("T")[1];
  return timePart ? timePart.substring(0, 5) : "";
};

const updateTime = (
  datetime: string | null | undefined,
  time: string,
): string | null => {
  if (!time) return datetime || null;
  const datePart =
    datetime?.split("T")[0] ??
    model.value.date ??
    new Date().toISOString().split("T")[0];
  return `${datePart}T${time}:00`;
};

const todayIsoDate = () => {
  return new Date().toISOString().split("T")[0];
};

const checkOutTime = computed({
  get: () => extractTime(model.value.check_out),
  set: (val) => {
    model.value.check_out = updateTime(model.value.check_out, val);
  },
});

/* ================== Loading States ================== */
const loadingEmployees = ref(false);

const fields = computed((): Field<AttendanceForm>[] => [
  {
    name: "check_out",
    label: "وقت الخروج (اختياري)",
    colSpan: 2,
    component: "custom",
  },
  {
    name: "work_minutes",
    label: "دقائق العمل (اختياري)",
    colSpan: 1,
    component: "input",
    componentProps: {
      type: "number",
      placeholder: "دقائق العمل",
      icon: "lucide:clock",
      min: 0,
      step: 1,
    },
  },

  {
    name: "overtime_minutes",
    label: "دقائق العمل الإضافي (اختياري)",
    colSpan: 1,
    component: "input",
    componentProps: {
      type: "number",
      placeholder: "دقائق العمل الإضافي",
      icon: "lucide:clock-alert",
      min: 0,
      step: 1,
    },
  },
  {
    name: "undertime_minutes",
    label: "دقائق النقص (اختياري)",
    colSpan: 1,
    component: "input",
    componentProps: {
      type: "number",
      placeholder: "دقائق النقص",
      icon: "lucide:clock-arrow-down",
      min: 0,
      step: 1,
    },
  },
  {
    name: "early_leave_minutes",
    label: "دقائق الخروج المبكر (اختياري)",
    colSpan: 1,
    component: "input",
    componentProps: {
      type: "number",
      placeholder: "دقائق الخروج المبكر",
      icon: "lucide:timer-off",
      min: 0,
      step: 1,
    },
  },
  {
    name: "is_early_leave",
    label: "هل انصرف مبكراً؟",
    colSpan: 1,
    component: "switch",
    componentProps: {
      label: "انصراف مبكر",
    },
  },
  {
    name: "attendance_status",
    label: "حالة الحضور",
    colSpan: 1,
    component: "select",
    items: [
      { id: "present", name_ar: "حاضر" },
      { id: "absent", name_ar: "غائب" },
      { id: "pending", name_ar: "قيد المراجعة" },
      // { id: "leave", name_ar: "إجازة" },
      // { id: "holiday", name_ar: "عطلة" },
    ],
    componentProps: {
      valueKey: "id",
      labelKey: "name_ar",
      placeholder: "اختر حالة الحضور",
      icon: "lucide:user-check",
    },
  },
  {
    name: "status",
    label: "الحالة النهائية",
    colSpan: 1,
    component: "select",
    items: [
      { id: "incomplete", name_ar: "مكتمل" },
      { id: "absent", name_ar: "غائب" },
      { id: "pending", name_ar: "قيد المراجعة" },
    ],
    componentProps: {
      valueKey: "id",
      labelKey: "name_ar",
      placeholder: "اختر الحالة النهائية",
      icon: "lucide:activity",
    },
  },
]);

/* ================== Expose ================== */
const formRef = ref<{ submit: () => void } | null>(null);
defineExpose({
  submit: () => formRef.value?.submit(),
});

onMounted(() => {
  if (props.mode !== "create") return;

  const today = todayIsoDate();

  // وقت الخروج: اليوم 16:00
  if (!model.value.check_out) {
    model.value.check_out = `${today}T16:00:00`;
  }
});
</script>

<template>
  <ClientOnly>
    <GenericForm
      ref="formRef"
      v-model="model"
      :fields="fields"
      :schema="attendanceSchema"
      :loading="loading"
      :columns="props.columns ?? 2"
      :select-loading="{
        employee_id: loadingEmployees,
      }"
      @submit="emit('submit', $event)"
      dir="rtl"
    >
      <!-- التاريخ -->
      <template #field-date>
        <UInputDate v-model="dateCalendar">
          <template #trailing>
            <UPopover>
              <UButton icon="i-lucide-calendar" size="sm" variant="link" />
              <template #content>
                <UCalendar v-model="dateCalendar" class="p-2" />
              </template>
            </UPopover>
          </template>
        </UInputDate>
      </template>

      <!-- وقت الخروج -->
      <template #field-check_out>
        <div class="flex gap-2">
          <UInputDate v-model="checkOutCalendar" class="flex-1">
            <template #trailing>
              <UPopover>
                <UButton icon="i-lucide-calendar" size="sm" variant="link" />
                <template #content>
                  <UCalendar v-model="checkOutCalendar" class="p-2" />
                </template>
              </UPopover>
            </template>
          </UInputDate>

          <UInput
            v-model="checkOutTime"
            type="time"
            class="w-32"
            placeholder="00:00"
          />
        </div>
      </template>
    </GenericForm>
  </ClientOnly>
</template>
