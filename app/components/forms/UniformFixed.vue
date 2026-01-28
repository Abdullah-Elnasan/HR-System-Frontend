<script setup lang="ts">
import GenericForm, { type Field } from "~/components/generic-form.vue";
import type { UniformFixedSchedule, DayOfWeek } from "~/types/workSchedule";
import { DAY_NAMES_AR } from "~/types/workSchedule";

/* ================== Props / Emits ================== */

const props = defineProps<{
  modelValue: UniformFixedSchedule;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: UniformFixedSchedule): void;
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

/* ================== Fields ================== */

const fields: Field<UniformFixedSchedule>[] = [
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
      value.length
        ? value.map((d) => DAY_NAMES_AR[d as DayOfWeek]).join("، ")
        : "اختر أيام العمل",
  },
  {
    name: "start_time",
    label: "وقت الحضور",
    component: "input",
    componentProps: { type: "time", icon: "i-lucide-clock" },
  },
  {
    name: "end_time",
    label: "وقت الانصراف",
    component: "input",
    componentProps: { type: "time", icon: "i-lucide-clock" },
  },
  {
    name: "grace_period_in_minutes",
    label: "سماح الحضور (دقائق)",
    component: "input",
    componentProps: { type: "number", min: 0, max: 60 },
  },
  {
    name: "early_leave_grace_minutes",
    label: "سماح الانصراف (دقائق)",
    component: "input",
    componentProps: { type: "number", min: 0, max: 60 },
  },
];

/* ================== Helpers ================== */

function timeToMinutes(time?: string): number | null {
  if (!time) return null;

  const parts = time.split(":");
  if (parts.length !== 2) return null;

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  return hour * 60 + minute;
}

/* ================== Computed ================== */

const dailyHours = computed(() => {
  const start = timeToMinutes(form.value.start_time);
  const end = timeToMinutes(form.value.end_time);
  if (start === null || end === null || end <= start) return 0;
  return Number(((end - start) / 60).toFixed(1));
});

const totalWeeklyHours = computed(() =>
  Number((dailyHours.value * form.value.working_days.length).toFixed(1)),
);
</script>

<template>
  <GenericForm v-model="form" :fields="fields" :columns="2" />

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
  <UCard :ui="{ body: 'space-y-3' }" class="mt-6">
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
        <span>{{ dailyHours }} ساعة</span>
      </div>

      <div class="flex justify-between">
        <span class="text-muted">إجمالي الساعات الأسبوعية:</span>
        <span class="text-success">{{ totalWeeklyHours }} ساعة</span>
      </div>
    </div>
  </UCard>
</template>
