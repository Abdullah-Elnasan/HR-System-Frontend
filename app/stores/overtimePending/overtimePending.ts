// ~/stores/overtime-pending/overtime-pending.ts
import { defineStore } from "pinia";
import type { OvertimePending, OvertimePendingForm } from "~/types/payrolls/overtimePending";
import type { PaginatedResponse } from "~/types/table";
import { fetchList } from "~/service/useAsyncData";
import { createResource } from "~/service/createResource";
import { updateResource } from "~/service/updateResource";

export const useOvertimePendingStore = defineStore("overtimePending", {
  state: () => ({
    records: [] as OvertimePending[],
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
    isLoading: (state) => state.loading,
  },

  actions: {
    /* ================== Fetch Records (Paginated) ================== */
    async fetchRecords(params?: Record<string, any>) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        const response = await fetchList<PaginatedResponse<OvertimePending>>({
          endpoint: '/api/overtime-pending/overtime-pending',
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


    /* ================== Create Record ================== */
    async createRecord(payload: OvertimePendingForm | FormData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        return await createResource<OvertimePending>({
          endpoint: '/api/overtime-pending/overtime-pending',
          payload,
          toast: useToast(),

        });
      } catch (err: any) {
        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },



    /* ================== Local State Management ================== */
    setRecords(payload: PaginatedResponse<OvertimePending>) {
      this.records = payload.data;
      this.pagination = payload.pagination;
    },

    addRecord(record: OvertimePending) {
      this.records.unshift(record);
      this.pagination.total += 1;
    },


    clearError() {
      this.error = null;
    },
  },
});
