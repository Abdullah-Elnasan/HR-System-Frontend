/**
 * تحويل جميع قيم boolean إلى 0/1 بشكل عميق
 */
export function convertBooleansToNumbers(obj: any): any {
  if (obj === null || obj === undefined) return obj

  if (typeof obj === 'boolean') {
    return obj ? 1 : 0
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertBooleansToNumbers(item))
  }

  if (typeof obj === 'object') {
    const converted: any = {}
    for (const key in obj) {
      converted[key] = convertBooleansToNumbers(obj[key])
    }
    return converted
  }

  return obj
}

/**
 * تحويل object إلى FormData مع دعم nested objects و arrays
 */
export function toFormData(obj: any, formData = new FormData(), parentKey = ''): FormData {
  if (obj === null || obj === undefined) {
    return formData
  }

  if (obj instanceof Date) {
    formData.append(parentKey, obj.toISOString())
    return formData
  }

  if (obj instanceof File) {
    formData.append(parentKey, obj)
    return formData
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      formData.append(`${parentKey}[]`, '')
    } else {
      obj.forEach((item, index) => {
        const key = `${parentKey}[${index}]`
        if (typeof item === 'object' && item !== null && !(item instanceof File)) {
          toFormData(item, formData, key)
        } else {
          formData.append(key, item?.toString() ?? '')
        }
      })
    }
    return formData
  }

  if (typeof obj === 'object' && !(obj instanceof File)) {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      const formKey = parentKey ? `${parentKey}[${key}]` : key

      if (value === null || value === undefined) {
        formData.append(formKey, '')
      } else if (typeof value === 'object' && !(value instanceof File)) {
        toFormData(value, formData, formKey)
      } else {
        formData.append(formKey, value.toString())
      }
    })
    return formData
  }

  formData.append(parentKey, obj.toString())
  return formData
}

/**
 * تحويل WorkScheduleForm إلى صيغة API
 */
export function transformWorkSchedulePayload(payload: any): any {
  const transformed: any = {
    name_ar: payload.name_ar,
    name_en: payload.name_en || payload.name_ar,
    type: payload.type,
    description_ar: payload.description_ar || null,
    description_en: payload.description_en || null,
    is_active: payload.is_active ? 1 : 0,
  }

  if (payload.type === 'fixed') {
    transformed.fixed_rules = buildFixedRules(payload)
  } else if (payload.type === 'flexible') {
    transformed.flexible_rules = buildFlexibleRules(payload)
  }

  return transformed
}

/**
 * بناء fixed_rules من البيانات
 */
function buildFixedRules(payload: any): any[] {
  const rules: any[] = []
  const allDays = [0, 1, 2, 3, 4, 5, 6]

  if (payload.use_uniform_schedule && payload.uniform_fixed) {
    const { working_days, start_time, end_time, grace_period_in_minutes, early_leave_grace_minutes } = payload.uniform_fixed

    allDays.forEach((dayOfWeek) => {
      const isWorkingDay = working_days.includes(dayOfWeek)

      rules.push({
        day_of_week: dayOfWeek,
        period_index: 1,
        start_time: isWorkingDay ? start_time : null,
        end_time: isWorkingDay ? end_time : null,
        grace_period_in_minutes: isWorkingDay ? grace_period_in_minutes : 0,
        early_leave_grace_minutes: isWorkingDay ? early_leave_grace_minutes : 0,
        is_working_day: isWorkingDay ? 1 : 0,
      })
    })
  } else if (!payload.use_uniform_schedule && payload.custom_fixed_days) {
    payload.custom_fixed_days.forEach((day: any) => {
      day.periods.forEach((period: any) => {
        rules.push({
          day_of_week: day.day_of_week,
          period_index: period.period_index,
          start_time: day.is_working_day ? period.start_time : null,
          end_time: day.is_working_day ? period.end_time : null,
          grace_period_in_minutes: day.is_working_day ? period.grace_period_in_minutes : 0,
          early_leave_grace_minutes: day.is_working_day ? period.early_leave_grace_minutes : 0,
          is_working_day: day.is_working_day ? 1 : 0,
        })
      })
    })
  }

  return rules
}

/**
 * بناء flexible_rules من البيانات
 */
function buildFlexibleRules(payload: any): any[] {
  const rules: any[] = []
  const allDays = [0, 1, 2, 3, 4, 5, 6]

  if (payload.use_uniform_schedule && payload.uniform_flexible) {
    const { working_days, required_hours } = payload.uniform_flexible

    allDays.forEach((dayOfWeek) => {
      const isWorkingDay = working_days.includes(dayOfWeek)

      rules.push({
        day_of_week: dayOfWeek,
        required_hours: isWorkingDay ? required_hours : 0,
        is_working_day: isWorkingDay ? 1 : 0,
      })
    })
  } else if (!payload.use_uniform_schedule && payload.custom_flexible_days) {
    payload.custom_flexible_days.forEach((day: any) => {
      rules.push({
        day_of_week: day.day_of_week,
        required_hours: day.is_working_day ? day.required_hours : 0,
        is_working_day: day.is_working_day ? 1 : 0,
      })
    })
  }

  return rules
}

/**
 * معالجة البيانات قبل الإرسال للـ API
 */
export function processPayloadForAPI(payload: Record<string, any> | FormData): FormData {
  if (payload instanceof FormData) {
    return payload
  }

  let processedPayload = convertBooleansToNumbers(payload)

  // تحويل WorkScheduleForm إذا كانت موجودة
  if (
    processedPayload.type &&
    (processedPayload.uniform_fixed ||
      processedPayload.uniform_flexible ||
      processedPayload.custom_fixed_days ||
      processedPayload.custom_flexible_days)
  ) {
    processedPayload = transformWorkSchedulePayload(processedPayload)
  }

  return toFormData(processedPayload)
}
