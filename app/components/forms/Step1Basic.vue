<script setup lang="ts">
import { required } from "zod/mini";
import GenericForm, { type Field } from "~/components/generic-form.vue";
import type { WorkScheduleBasicForm } from "~/types/workSchedule";

/* ================== Props / Emits ================== */

const props = defineProps<{
  modelValue: WorkScheduleBasicForm;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: WorkScheduleBasicForm): void;
  (e: "submit", value: WorkScheduleBasicForm): void;
}>();

/* ================== State ================== */

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

/* ================== Fields ================== */

const fields: Field<WorkScheduleBasicForm>[] = [
  {
    name: "is_active",
    label: "حالة النظام",
    component: "switch",
    componentProps: {
      trueLabel: "النظام نشط",
      falseLabel: "النظام غير نشط",
      required: true,
    },
    colSpan: 2,
  },
  {
    name: "name_ar",
    label: "الاسم بالعربية",
    component: "input",
    colSpan: 1,
    componentProps: {
      required: true,
    },
  },
  // {
  //   name: "name_en",
  //   label: "الاسم بالإنجليزية",
  //   component: "input",
  //   colSpan: 1,
  // },
  {
    name: "type",
    label: "نوع الدوام",
    component: "select-menu",
    items: [
      { value: "fixed", label: "دوام ثابت", icon: "i-lucide-clock" },
      { value: "flexible", label: "دوام مرن", icon: "i-lucide-calendar-clock" },
    ],
    componentProps: {
      valueKey: "value",
      required: true,

      labelKey: "label",
      placeholder: "اختر نوع جدول العمل",
      icon: "uim:schedule",
    },
    colSpan: 1,
  },
  {
    name: "description_ar",
    label: "الوصف بالعربية (اختياري)",
    component: "textarea",
    colSpan: 2,
  },
  // {
  //   name: "description_en",
  //   label: "الوصف بالإنجليزية (اختياري)",
  //   component: "textarea",
  //   colSpan: 1,
  // },

];
</script>

<template>
  <GenericForm
    v-model="form"
    :fields="fields"
    :columns="2"
    @submit="$emit('submit', $event)"
  />

  <!-- Optional Info Card -->
  <UCard
    :ui="{ body: 'space-y-2 bg-primary/5 dark:bg-primary/10' }"
    class="mt-6"
  >
    <div class="flex items-start gap-3">
      <UIcon name="i-lucide-info" class="w-5 h-5 text-primary mt-0.5" />
      <div class="text-sm space-y-1">
        <p class="font-medium text-highlighted">
          {{ form.type === "fixed" ? "دوام ثابت" : "دوام مرن" }}
        </p>
        <p class="text-muted">
          {{
            form.type === "fixed"
              ? "يتطلب أوقات حضور وانصراف محددة يومياً"
              : "يتطلب عدد ساعات محدد يومياً بدون أوقات ثابتة"
          }}
        </p>
      </div>
    </div>
  </UCard>
</template>
