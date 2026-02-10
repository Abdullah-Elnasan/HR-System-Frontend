
import { defineStore } from "pinia";
import type { OvertimeApproved, OvertimeApprovedForm } from "~/types/payrolls/overtimeApproved";
import type { PaginatedResponse } from "~/types/table";
import { fetchList } from "~/service/useAsyncData";
import { createResource } from "~/service/createResource";
import { updateResource } from "~/service/updateResource";

export const useOvertimeApprovedStore = defineStore("overtimeApproved", {
  state: () => ({
    records: [] as OvertimeApproved[],
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
    getRecords: (state) => state.records,
    getRecordById: (state) => (id: number | string) =>
      state.records.find((r) => r.id === id),
    isLoading: (state) => state.loading,
  },

  actions: {
    /* ================== Fetch Records (Paginated) ================== */
    async fetchRecords(params?: Record<string, any>) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        const response = await fetchList<PaginatedResponse<OvertimeApproved>>({
          endpoint: '/api/overtime-approved/overtime-approved',
          page: params?.page ?? 1,
          perPage: params?.per_page ?? 10,
          search: params?.filter?.search,
        });

        this.records = response.data;
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

    /* ================== Fetch Single Record ================== */
    async fetchRecordById(id: number | string) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        const response = await fetchList<{ data: OvertimeApproved }>({
          endpoint: `/api/overtime-approved/${id}`,
        });

        const record = response.data;
        const index = this.records.findIndex((r) => r.id === record.id);
        if (index !== -1) this.records[index] = record;

        if ((response as any).messageAr) {
          toast.add({ title: (response as any).messageAr, color: 'success' });
        }

        return record;
      } catch (err: any) {
        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Create Record ================== */
    async createRecord(payload: OvertimeApprovedForm | FormData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        return await createResource<OvertimeApproved>({
          endpoint: '/api/overtime-approved/overtime-approved',
          payload,
          toast: useToast(),
          onSuccess: (data) => {
            this.records.unshift(data);
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

    /* ================== Update Record ================== */
    async updateRecord(id: number, payload: Partial<OvertimeApprovedForm> | FormData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        return await updateResource<OvertimeApproved>({
          endpoint: `/api/overtime-approved/${id}`,
          payload,
          toast: useToast(),
          onSuccess: (data) => {
            const index = this.records.findIndex((r) => r.id === data.id);
            if (index !== -1) this.records[index] = data;
          },
        });
      } catch (err: any) {
        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Delete Record ================== */
    async deleteRecord(id: number) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      const index = this.records.findIndex((r) => r.id === id);
      const backup = index !== -1 ? this.records[index] : null;

      try {
        if (index !== -1) {
          this.records.splice(index, 1);
          this.pagination.total -= 1;
        }

        await $fetch(`/api/overtime-approved/${id}`, { method: 'DELETE' });

        toast.add({ title: 'تم حذف السجل بنجاح', color: 'success' });
        return true;
      } catch (err: any) {
        if (backup && index !== -1) {
          this.records.splice(index, 0, backup);
          this.pagination.total += 1;
        }

        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Local State Management ================== */
    setRecords(payload: PaginatedResponse<OvertimeApproved>) {
      this.records = payload.data;
      this.pagination = payload.pagination;
    },

    addRecord(record: OvertimeApproved) {
      this.records.unshift(record);
      this.pagination.total += 1;
    },

    removeRecord(id: number | string) {
      const index = this.records.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.records.splice(index, 1);
        this.pagination.total -= 1;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
