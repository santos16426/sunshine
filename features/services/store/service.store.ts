"use client";

import { create } from "zustand";
import type { Service, ServiceFormData } from "../types";
import * as serviceService from "../services/service.service";

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;

  fetchServices: (search?: string) => Promise<void>;
  createService: (data: ServiceFormData) => Promise<void>;
  updateService: (id: string, data: ServiceFormData) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async (search) => {
    set({ isLoading: true, error: null });
    try {
      const list = await serviceService.fetchServices(search);
      set({ services: list, isLoading: false, error: null });
    } catch (err) {
      set({
        services: [],
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch services",
      });
    }
  },

  createService: async (data) => {
    set({ error: null });
    try {
      const service = await serviceService.createService(data);
      set((s) => ({ services: [...s.services, service] }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create service",
      });
      throw err;
    }
  },

  updateService: async (id, data) => {
    set({ error: null });
    try {
      const svc = await serviceService.updateService(id, data);
      set((s) => ({
        services: s.services.map((x) => (x.id === id ? svc : x)),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update service",
      });
      throw err;
    }
  },

  deleteService: async (id) => {
    set({ error: null });
    try {
      await serviceService.deleteService(id);
      set((s) => ({ services: s.services.filter((x) => x.id !== id) }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete service",
      });
      throw err;
    }
  },
}));
