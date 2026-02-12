// ~/stores/payroll-runs/payroll-runs.ts
import { defineStore } from "pinia";
import type { PayrollRun, PayrollRunForm } from "~/types/payrolls/payrollRun";
import type { PaginatedResponse } from "~/types/table";
import { fetchList } from "~/service/useAsyncData";
import { createResource } from "~/service/createResource";
import { updateResource } from "~/service/updateResource";

export const usePayrollRunsStore = defineStore("payrollRuns", {
  state: () => ({
    runs: [] as PayrollRun[],
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 1,
    },
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getRuns: (state) => state.runs,
    getRunById: (state) => (id: number | string) =>
      state.runs.find((r) => r.id === id),
    isLoading: (state) => state.loading,
  },

  actions: {
    /* ================== Fetch Runs (Paginated) ================== */
    async fetchRuns(params?: Record<string, any>) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        const response = await fetchList<PaginatedResponse<PayrollRun>>({
          endpoint: '/api/payroll-runs/payroll-runs',
          page: params?.page ?? 1,
          perPage: params?.per_page ?? 10,
          search: params?.filter?.search,
        });

        this.runs = response.data;
        this.pagination = response.pagination;

        if ((response as any).messageAr) {
          toast.add({ title: (response as any).messageAr, color: 'success' });
        }

        return response;
      } catch (err: any) {
        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Fetch Single Run ================== */
    async fetchRunById(id: number | string) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        const response = await fetchList<{ data: PayrollRun }>({
          endpoint: `/api/payroll-runs/${id}`,
        });

        const run = response.data;
        const index = this.runs.findIndex((r) => r.id === run.id);
        if (index !== -1) this.runs[index] = run;

        if ((response as any).messageAr) {
          toast.add({ title: (response as any).messageAr, color: 'success' });
        }

        return run;
      } catch (err: any) {
        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Create Run ================== */
    async aprooveRun(payload: PayrollRunForm | FormData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        return await createResource<PayrollRun>({
          endpoint: '/api/payroll-runs/payroll-runs',
          payload,
          toast: useToast(),
          onSuccess: (data) => {
            this.runs.unshift(data);
            this.pagination.total += 1;
          },
        });
      } catch (err: any) {
        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Update Run ================== */
    async updateRun(id: number, payload: Partial<PayrollRunForm> | FormData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        return await updateResource<PayrollRun>({
          endpoint: `/api/payroll-runs/${id}`,
          payload,
          toast: useToast(),
          onSuccess: (data) => {
            const index = this.runs.findIndex((r) => r.id === data.id);
            if (index !== -1) this.runs[index] = data;
          },
        });
      } catch (err: any) {
        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Delete Run ================== */
    async deleteRun(id: number) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      const index = this.runs.findIndex((r) => r.id === id);
      const backup = index !== -1 ? this.runs[index] : null;

      try {
        if (index !== -1) {
          this.runs.splice(index, 1);
          this.pagination.total -= 1;
        }

      // await $fetch(`/api/payroll-runs/${id}`, { method: 'DELETE' });

        toast.add({ title: 'تم حذف دورة الرواتب بنجاح', color: 'success' });
        return true;
      } catch (err: any) {
        if (backup && index !== -1) {
          this.runs.splice(index, 0, backup);
          this.pagination.total += 1;
        }

        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Local State Management ================== */
    setRuns(payload: PaginatedResponse<PayrollRun>) {
      this.runs = payload.data;
      this.pagination = payload.pagination;
    },

    addRun(run: PayrollRun) {
      this.runs.unshift(run);
      this.pagination.total += 1;
    },

    removeRun(id: number | string) {
      const index = this.runs.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.runs.splice(index, 1);
        this.pagination.total -= 1;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
