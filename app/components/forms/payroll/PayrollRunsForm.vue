<script setup lang="ts">
import type { PayrollRunForm } from "~/types/payrolls/payrollRun";
import type { Field } from "~/components/generic-form.vue";
import { useFormModel } from "~/composables/useFormModel";
import { CalendarDate } from "@internationalized/date";

/* ================== Props / Emits ================== */
const props = defineProps<{
  modelValue: PayrollRunForm;
  mode?: "create" | "edit";
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: PayrollRunForm): void;
  (e: "submit", v: PayrollRunForm): void;
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
  // القيمة الافتراضية
  return new CalendarDate(2022, 1, 10);
};

const periodStartCalendar = computed({
  get: () => stringToCalendarDate(model.value.period_start),
  set: (val) => (model.value.period_start = val.toString()),
});

const periodEndCalendar = computed({
  get: () => stringToCalendarDate(model.value.period_end),
  set: (val) => (model.value.period_end = val.toString()),
});

const approvedAtCalendar = computed({
  get: () => stringToCalendarDate(model.value.approved_at),
  set: (val) => {
    const existingTime = model.value.approved_at?.split("T")[1] ?? "00:00:00";
    model.value.approved_at = `${val.toString()}T${existingTime}`;
  },
});

/* ================== Time Helper for approved_at ================== */
const extractTime = (datetime: string | null): string => {
  if (!datetime) return "";
  const timePart = datetime.split("T")[1];
  if (!timePart) return "";
  return timePart.substring(0, 5);
};

const updateTime = (datetime: string | null, time: string): string | null => {
  if (!time) return datetime;
  const datePart = datetime?.split("T")[0] ?? new Date().toISOString().split("T")[0];
  return `${datePart}T${time}:00`;
};

// const approvedAtTime = computed({
//   get: () => extractTime(model.value.approved_at),
//   set: (val) => {
//     model.value.approved_at = updateTime(model.value.approved_at, val);
//   },
// });

/* ================== Fields ================== */
const fields = computed<Field<PayrollRunForm>[]>(() => [
  {
    name: "period_start",
    label: "بداية الفترة",
    colSpan: 1,
    component: "custom",
  },
  {
    name: "period_end",
    label: "نهاية الفترة",
    colSpan: 1,
    component: "custom",
  },
  {
    name: "status",
    label: "الحالة",
    colSpan: 2,
    component: "select",
    items: [
      { id: "draft", name_ar: "مسودة" },
      { id: "processing", name_ar: "قيد المعالجة" },
      { id: "approved", name_ar: "معتمد" },
      { id: "paid", name_ar: "مدفوع" },
      { id: "cancelled", name_ar: "ملغي" },
    ],
    componentProps: {
      valueKey: "id",
      labelKey: "name_ar",
      placeholder: "اختر الحالة",
      icon: "lucide:list-checks",
      required: true,
    },
  },
  {
    name: "approved_by",
    label: "معتمد من (ID)",
    colSpan: 1,
    component: "input",
    componentProps: {
      type: "number",
      placeholder: "أدخل ID المعتمد",
      icon: "lucide:user-check",
      min: 1,
      step: 1,
    },
  },
  {
    name: "approved_by_name",
    label: "اسم المعتمد",
    colSpan: 1,
    component: "input",
    componentProps: {
      placeholder: "أدخل اسم المعتمد",
      icon: "lucide:user",
    },
  },
  {
    name: "approved_at",
    label: "تاريخ الاعتماد",
    colSpan: 2,
    component: "custom",
  },
]);

/* ================== Expose ================== */
const formRef = ref<{ submit: () => void } | null>(null);
defineExpose({
  submit: () => formRef.value?.submit(),
});
</script>

<template>
  <ClientOnly>
    <GenericForm
      ref="formRef"
      v-model="model"
      :fields="fields"
      :loading="loading"
      :columns="props.columns ?? 2"
      @submit="emit('submit', $event)"
      dir="rtl"
    >
      <!-- بداية الفترة -->
      <template #field-period_start>
        <UInputDate v-model="periodStartCalendar">
          <template #trailing>
            <UPopover>
              <UButton
                icon="i-lucide-calendar"
                size="sm"
                variant="link"
              />
              <template #content>
                <UCalendar v-model="periodStartCalendar" class="p-2" />
              </template>
            </UPopover>
          </template>
        </UInputDate>
      </template>

      <!-- نهاية الفترة -->
      <template #field-period_end>
        <UInputDate v-model="periodEndCalendar">
          <template #trailing>
            <UPopover>
              <UButton
                icon="i-lucide-calendar"
                size="sm"
                variant="link"
              />
              <template #content>
                <UCalendar v-model="periodEndCalendar" class="p-2" />
              </template>
            </UPopover>
          </template>
        </UInputDate>
      </template>

      <!-- تاريخ الاعتماد -->
      <template #field-approved_at>
        <div class="flex gap-2">
          <UInputDate v-model="approvedAtCalendar" class="flex-1">
            <template #trailing>
              <UPopover>
                <UButton
                  icon="i-lucide-calendar"
                  size="sm"
                  variant="link"
                />
                <template #content>
                  <UCalendar v-model="approvedAtCalendar" class="p-2" />
                </template>
              </UPopover>
            </template>
          </UInputDate>

          <!-- v-model="approvedAtTime" -->
          <UInput
            type="time"
            class="w-32"
          />
        </div>
      </template>
    </GenericForm>
  </ClientOnly>
</template>
