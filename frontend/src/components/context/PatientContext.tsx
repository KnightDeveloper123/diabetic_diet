import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "../types/auth.types";
import type { FunctionTypes } from "../types/parameter.typs";
import type { Patient } from "../types/patient.types";
import useFetch from "../hooks/uesFetch";


export interface FunctionParams {
    page?: number,
    limit?: number,
    search?: string
}

interface AppContextType {
    loading: boolean
     allPatient: FunctionTypes<Patient[]> | null
     fetchAllPatient: (param: FunctionParams) => void;
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
      // const { showAlert, } = useAuth()
  
      const [allPatient, setAllPatient] = useState<FunctionTypes<Patient[]> | null>(null)
      const fetchAllPatient = useCallback(async ({ page, limit, search }: FunctionParams) => {
          try {
              const response = await request({
                  url: `/api/health/get-all-patient?page=${page}&limit=${limit}&search=${search}`,
                  method: "GET",
                  withLoader: true
              })
  
  
              if (response.status === 1) {
                console.log(response)
                  setAllPatient(response)
              } else {
                  // showAlert(response.message || 'Error fetching Patient', 'error')
              }
          } catch (error: any) {
              console.log(error);
              // showAlert(error.message || 'Internal Error', 'error')
          }
      }, [])

  return (
    <PatientContext.Provider
      value={{
        loading,
        allPatient,
        fetchAllPatient,
      
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