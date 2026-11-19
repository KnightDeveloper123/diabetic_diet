
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { FunctionTypes } from "../types/parameter.typs";
import type { Patient } from "../types/patient.types";
import useFetch from "../hooks/uesFetch";

export interface FunctionParams {
  page?: number;
  limit?: number;
  search?: string;
  doctor_id?: string | number;
}

interface AppContextType {
  loading: boolean;
  allPatient: FunctionTypes<Patient[]> | null;
  patientById: Patient | null;

  fetchAllPatient: (param: FunctionParams) => void;
  fetchPatientById: (patient_id: string) => void;
}

const PatientContext = createContext<AppContextType | undefined>(
  undefined
);

export function PatientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { loading, request } = useFetch();

  const [allPatient, setAllPatient] =
    useState<FunctionTypes<Patient[]> | null>(null);

  const [patientById, setPatientById] =
    useState<Patient | null>(null);

  // Get all patients
  const fetchAllPatient = useCallback(
    async ({ page, limit, search, doctor_id }: FunctionParams) => {
      try {
        const response = await request({
          url: `/api/health/get-all-patient?page=${page}&limit=${limit}&search=${search}&doctor_id=${doctor_id}`,
          method: "GET",
          withLoader: true,
        });

        if (response.status === 1) {
          setAllPatient(response);
        }
      } catch (error: any) {
        console.log(error);
      }
    },
    [request]
  );

  // Get patient by ID
  const fetchPatientById = useCallback(
    async (patient_id: string) => {
      try {
        const response = await request({
          url: `/api/health/get-patient-by-tid?patient_id=${encodeURIComponent(patient_id)}`,
          method: "GET",
          withLoader: true,
        });

        if (response.status === 1) {
          setPatientById(response.data);
        } else {
          setPatientById(null);
        }
      } catch (error: any) {
        console.log("Fetch patient by ID error:", error);
        setPatientById(null);
      }
    },
    [request]
  );

  return (
    <PatientContext.Provider
      value={{
        loading,
        allPatient,
        patientById,
        fetchAllPatient,
        fetchPatientById,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);

  if (!context) {
    throw new Error(
      "usePatient must be used inside PatientProvider"
    );
  }

  return context;
}
