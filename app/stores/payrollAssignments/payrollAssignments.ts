// ~/stores/payroll-assignments/payroll-assignments.ts
import { defineStore } from "pinia";
import type { PayrollAssignment, PayrollAssignmentForm } from "~/types/payrollAssignments";
import type { PaginatedResponse } from "~/types/table";
import { fetchList } from "~/service/useAsyncData";
import { createResource } from "~/service/createResource";
import { updateResource } from "~/service/updateResource";

export const usePayrollAssignmentsStore = defineStore("payrollAssignments", {
  state: () => ({
    assignments: [] as PayrollAssignment[],
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
    getAssignments: (state) => state.assignments,
    getAssignmentById: (state) => (id: number | string) =>
      state.assignments.find((a) => a.id === id),
    isLoading: (state) => state.loading,
  },

  actions: {
    /* ================== Fetch Assignments (Paginated) ================== */
    async fetchAssignments(params?: Record<string, any>) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        const response = await fetchList<PaginatedResponse<PayrollAssignment>>({
          endpoint: '/api/payroll-assignments/payroll-assignments',
          page: params?.page ?? 1,
          perPage: params?.per_page ?? 10,
          search: params?.filter?.search,
        });

        this.assignments = response.data;
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

    /* ================== Fetch Single Assignment ================== */
    async fetchAssignmentById(id: number | string) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        const response = await fetchList<{ data: PayrollAssignment }>({
          endpoint: `/api/payroll-assignments/${id}`,
        });

        const assignment = response.data;
        const index = this.assignments.findIndex((a) => a.id === assignment.id);
        if (index !== -1) this.assignments[index] = assignment;

        if ((response as any).messageAr) {
          toast.add({ title: (response as any).messageAr, color: 'success' });
        }

        return assignment;
      } catch (err: any) {
        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Create Assignment ================== */
    async createAssignment(payload: PayrollAssignmentForm | FormData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        return await createResource<PayrollAssignment>({
          endpoint: '/api/payroll-assignments/payroll-assignments',
          payload,
          toast: useToast(),
          onSuccess: (data) => {
            this.assignments.unshift(data);
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

    /* ================== Update Assignment ================== */
    async updateAssignment(id: number, payload: Partial<PayrollAssignmentForm> | FormData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      try {
        return await updateResource<PayrollAssignment>({
          endpoint: `/api/payroll-assignments/${id}`,
          payload,
          toast: useToast(),
          onSuccess: (data) => {
            const index = this.assignments.findIndex((a) => a.id === data.id);
            if (index !== -1) this.assignments[index] = data;
          },
        });
      } catch (err: any) {
        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Delete Assignment ================== */
    async deleteAssignment(id: number) {
      this.loading = true;
      this.error = null;
      const toast = useToast();

      const index = this.assignments.findIndex((a) => a.id === id);
      const backup = index !== -1 ? this.assignments[index] : null;

      try {
        if (index !== -1) {
          this.assignments.splice(index, 1);
          this.pagination.total -= 1;
        }

        await $fetch(`/api/payroll-assignments/${id}`, { method: 'DELETE' });

        toast.add({ title: 'تم حذف الإسناد بنجاح', color: 'success' });
        return true;
      } catch (err: any) {
        if (backup && index !== -1) {
          this.assignments.splice(index, 0, backup);
          this.pagination.total += 1;
        }

        handleApiError(err, toast);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /* ================== Local State Management ================== */
    setAssignments(payload: PaginatedResponse<PayrollAssignment>) {
      this.assignments = payload.data;
      this.pagination = payload.pagination;
    },

    addAssignment(assignment: PayrollAssignment) {
      this.assignments.unshift(assignment);
      this.pagination.total += 1;
    },

    removeAssignment(id: number | string) {
      const index = this.assignments.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.assignments.splice(index, 1);
        this.pagination.total -= 1;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
