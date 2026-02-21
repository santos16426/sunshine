"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface SearchPatient {
  id: string;
  name: string;
  date_of_birth: string;
  age: number;
  guardian_name: string;
  medical_diagnosis: string;
}

export interface SearchDoctor {
  id: string;
  name: string;
  hospital_affiliation: string;
  contact_information: string;
}

export interface SearchTherapist {
  id: string;
  name: string;
  therapist_type: string;
  contact_number: string;
}

export interface DashboardSearchResults {
  patients: SearchPatient[];
  doctors: SearchDoctor[];
  therapists: SearchTherapist[];
}

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

export function useDashboardSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DashboardSearchResults>({
    patients: [],
    doctors: [],
    therapists: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const runSearch = useCallback(async (query: string) => {
    const q = query.trim();
    if (q.length < MIN_QUERY_LENGTH) {
      setResults({ patients: [], doctors: [], therapists: [] });
      return;
    }
    setIsLoading(true);
    const supabase = createClient();
    const pattern = `%${q}%`;

    const [patientsRes, doctorsRes, therapistsRes] = await Promise.all([
      supabase
        .from("patients")
        .select("id, name, date_of_birth, age, guardian_name, medical_diagnosis")
        .or(`name.ilike.${pattern},guardian_name.ilike.${pattern},medical_diagnosis.ilike.${pattern}`)
        .limit(10),
      supabase
        .from("doctors")
        .select("id, name, hospital_affiliation, contact_information")
        .ilike("name", pattern)
        .limit(10),
      supabase
        .from("therapists")
        .select("id, name, therapist_type, contact_number")
        .ilike("name", pattern)
        .limit(10),
    ]);

    setResults({
      patients: (patientsRes.data ?? []) as SearchPatient[],
      doctors: (doctorsRes.data ?? []) as SearchDoctor[],
      therapists: (therapistsRes.data ?? []) as SearchTherapist[],
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ patients: [], doctors: [], therapists: [] });
      return;
    }
    const t = setTimeout(() => runSearch(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery, runSearch]);

  return {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    filteredResults: results,
    isLoading,
  };
}
