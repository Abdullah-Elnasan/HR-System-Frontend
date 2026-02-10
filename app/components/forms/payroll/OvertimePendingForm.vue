<script setup lang="ts">
import type { OvertimePendingForm } from "~/types/payrolls/overtimePending";
import type { Field } from "~/components/generic-form.vue";
import { useFormModel } from "~/composables/useFormModel";
import { CalendarDate } from "@internationalized/date";
import { overtimePendingSchema } from "~/schemas/overtime-pending.schema";

/* ================== Props / Emits ================== */
const props = defineProps<{
  modelValue: OvertimePendingForm;
  mode?: "create" | "edit";
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: OvertimePendingForm): void;
  (e: "submit", v: OvertimePendingForm): void;
}>();

const model = useFormModel(toRef(props, "modelValue"), emit);

/* ================== Date Helpers ================== */
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

const dateFromCalendar = computed({
  get: () => stringToCalendarDate(model.value.date_from),
  set: (val) => (model.value.date_from = val.toString()),
});

const dateToCalendar = computed({
  get: () => stringToCalendarDate(model.value.date_to),
  set: (val) => (model.value.date_to = val.toString()),
});

/* ================== Loading States ================== */
const loadingEmployees = ref(false);

/* ================== Fields ================== */

const fields = computed<Field<OvertimePendingForm>[]>(() => [
  {
    name: "employee_name",
    label: "الاسم",
    colSpan: 2,
    component: "input",
    componentProps: {
      disabled: true,
    },
  },

  {
    name: "approved_minutes",
    label: "الدقائق المعتمدة",
    colSpan: 1,
    component: "input",
    componentProps: {
      type: "number",
      placeholder: "أدخل الدقائق المعتمدة",
      icon: "lucide:clock",
      min: 0,
      step: 1,
    },
  },

  {
    name: "rate_multiplier",
    label: "معامل السعر",
    colSpan: 1,
    component: "input",
    componentProps: {
      type: "number",
      placeholder: "أدخل معامل السعر",
      icon: "lucide:percent",
      min: 1,
      step: 0.1,
    },
  },
  {
    name: "date_from",
    label: "من تاريخ",
    colSpan: 1,
    component: "custom",
    componentProps: {
      disabled: false,
    },
  },
  {
    name: "date_to",
    label: "إلى تاريخ",
    colSpan: 1,
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
      :schema="overtimePendingSchema"
      v-model="model"
      :fields="fields"
      :loading="loading"
      :columns="props.columns ?? 2"
      :select-loading="{
        employee_id: loadingEmployees,
      }"
      @submit="emit('submit', $event)"
      dir="rtl"
    >
      <!-- من تاريخ -->
      <template #field-date_from>
        <UInputDate v-model="dateFromCalendar">
          <template #trailing>
            <UPopover>
              <UButton icon="i-lucide-calendar" size="sm" variant="link" />
              <template #content>
                <UCalendar v-model="dateFromCalendar" class="p-2" disabled />
              </template>
            </UPopover>
          </template>
        </UInputDate>
      </template>

      <!-- إلى تاريخ -->
      <template #field-date_to>
        <UInputDate v-model="dateToCalendar">
          <template #trailing>
            <UPopover>
              <UButton icon="i-lucide-calendar" size="sm" variant="link" />
              <template #content>
                <UCalendar v-model="dateToCalendar" class="p-2" />
              </template>
            </UPopover>
          </template>
        </UInputDate>
      </template>
    </GenericForm>
  </ClientOnly>
</template>
