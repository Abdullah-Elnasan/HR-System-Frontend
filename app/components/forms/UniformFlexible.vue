<script setup lang="ts">
import GenericForm, { type Field } from "~/components/generic-form.vue";
import type { UniformFlexibleSchedule, DayOfWeek } from "~/types/workSchedule";
import { DAY_NAMES_AR } from "~/types/workSchedule";
import { reactive, computed } from "vue";

/* ================== Props / Emits ================== */
const props = defineProps<{
  modelValue: UniformFlexibleSchedule;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: UniformFlexibleSchedule): void;
}>();

/* ================== Model ================== */
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

/* ================== Days Options ================== */
const daysOptions = computed(() => {
  const days: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
  return days.map((day) => ({
    value: day,
    label: DAY_NAMES_AR[day],
  }));
});

/* ================== Hour Presets ================== */
const hourPresets = [6, 7, 8, 9, 10];

/* ================== Fields ================== */
const fields: Field<UniformFlexibleSchedule>[] = [
  {
    name: "working_days",
    label: "أيام العمل",
    component: "select-menu",
    multiple: true,
    searchable: true,
    items: daysOptions.value,
    componentProps: {
      valueKey: "value",
      textKey: "label",
    },
    renderLabel: (value: number[]) =>
      value.length ? value.map((d) => DAY_NAMES_AR[d as DayOfWeek]).join("، ") : "اختر أيام العمل",
  },
  {
    name: "required_hours",
    label: "عدد الساعات المطلوبة يومياً",
    component: "input",
    componentProps: {
      type: "number",
      min: 1,
      max: 24,
      step: 0.5,
      placeholder: "8",
      icon: "i-lucide-clock",
    },
  },
];

/* ================== Computed ================== */
const totalWeeklyHours = computed(() => {
  return form.value.required_hours * form.value.working_days.length;
});
</script>

<template>
  <!-- Generic Form -->
  <GenericForm
    v-model="form"
    :fields="fields"
    :columns="2"
  />

  <!-- Hour Presets -->
  <div class="flex flex-wrap gap-2 mt-4">
    <UButton
      v-for="h in hourPresets"
      :key="h"
      :variant="form.required_hours === h ? 'solid' : 'outline'"
      :color="form.required_hours === h ? 'primary' : 'neutral'"
      size="sm"
      @click="form.required_hours = h"
    >
      {{ h }} ساعات
    </UButton>
  </div>

  <!-- Selected Days Preview -->
  <div v-if="form.working_days.length" class="flex flex-wrap gap-2 mt-4">
    <UBadge
      v-for="day in form.working_days"
      :key="day"
      color="primary"
      variant="soft"
    >
      {{ DAY_NAMES_AR[day] }}
    </UBadge>
  </div>

  <!-- Summary -->
  <UCard class="mt-6" :ui="{ body: 'space-y-3' }">
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-info" class="w-5 h-5 text-success" />
      <h4 class="font-semibold">ملخص الدوام</h4>
    </div>

    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-muted">عدد أيام العمل:</span>
        <span>{{ form.working_days.length }} أيام</span>
      </div>

      <div class="flex justify-between">
        <span class="text-muted">ساعات العمل اليومية:</span>
        <span>{{ form.required_hours }} ساعة</span>
      </div>

      <div class="flex justify-between">
        <span class="text-muted">إجمالي الساعات الأسبوعية:</span>
        <span class="text-success">{{ totalWeeklyHours }} ساعة</span>
      </div>
    </div>
  </UCard>
</template>
