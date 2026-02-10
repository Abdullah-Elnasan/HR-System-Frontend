<script setup lang="ts">
import type { OvertimeApprovedForm } from "~/types/payrolls/overtimeApproved";
import type { Field } from "~/components/generic-form.vue";
import { useFormModel } from "~/composables/useFormModel";
import { overtimeApprovedSchema } from "~/schemas/overtime-approved.schema";

/* ================== Props / Emits ================== */
const props = defineProps<{
  modelValue: OvertimeApprovedForm;
  mode?: "create" | "edit";
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: OvertimeApprovedForm): void;
  (e: "submit", v: OvertimeApprovedForm): void;
}>();

const model = useFormModel(toRef(props, "modelValue"), emit);

/* ================== Loading States ================== */

const fields = computed<Field<OvertimeApprovedForm>[]>(() => [
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
      :schema="overtimeApprovedSchema"
      v-model="model"
      :fields="fields"
      :loading="loading"
      :columns="props.columns ?? 2"
      @submit="emit('submit', $event)"
      dir="rtl"
    >
    </GenericForm>
  </ClientOnly>
</template>
