<script setup lang="ts">
import type { PayrollItemForm } from "~/types/payrolls/payrollItem";
import type { Field } from "~/components/generic-form.vue";
import { useFormModel } from "~/composables/useFormModel";

/* ================== Props / Emits ================== */
const props = defineProps<{
  modelValue: PayrollItemForm;
  mode?: "create" | "edit";
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: PayrollItemForm): void;
  (e: "submit", v: PayrollItemForm): void;
}>();

const model = useFormModel(toRef(props, "modelValue"), emit);

const fields = computed<Field<PayrollItemForm>[]>(() => [
  {
    name: "manual_adjustment",
    label: "التعديل اليدوي",
    colSpan: 1,
    component: "input",
    componentProps: {
      type: "number",
      placeholder: "أدخل التعديل اليدوي",
      icon: "lucide:hand",
      step: 0.01,
    },
  },
  {
    name: "adjustment_note",
    label: "ملاحظة التعديل",
    colSpan: 2,
    component: "textarea",
    componentProps: {
      placeholder: "أدخل ملاحظة التعديل",
      rows: 3,
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
