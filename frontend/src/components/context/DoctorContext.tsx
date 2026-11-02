import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import useFetch from "../hooks/uesFetch";
// import { useAuth } from "../context/AuthContext";
import type { Doctor } from "../types/doctor.types";
import type { FunctionTypes } from "../types/parameter.typs";

export interface FunctionParams {
    page?: number,
    limit?: number,
    search?: string
}

type AppContextType = {
    loading: boolean
    allDoctor: FunctionTypes<Doctor[]> | null
    fetchAllDoctor: (param: FunctionParams) => void;

  

}



const DoctorContext = createContext<AppContextType | undefined>(undefined);

export const DoctorProvider = ({ children }: { children: ReactNode }) => {

    const { loading, request } = useFetch();
    // const { showAlert, } = useAuth()

    const [allDoctor, setAllDoctor] = useState<FunctionTypes<Doctor[]> | null>(null)
    const fetchAllDoctor = useCallback(async ({ page, limit, search }: FunctionParams) => {
        try {
            const response = await request({
                url: `/api/health/get-all-doctor?page=${page}&limit=${limit}&search=${search}`,
                method: "GET",
                withLoader: true
            })


            if (response.status === 1) {
              console.log(response)
                setAllDoctor(response)
            } else {
                // showAlert(response.message || 'Error fetching Doctor', 'error')
            }
        } catch (error: any) {
            console.log(error);
            // showAlert(error.message || 'Internal Error', 'error')
        }
    }, [])




    return (
        <DoctorContext.Provider value={{
            loading,
            fetchAllDoctor, allDoctor,
          

        }}>
            {children}
        </DoctorContext.Provider>
    )
}

export const useDoctor = () => {
    const ctx = useContext(DoctorContext);
    if (!ctx) throw new Error("useDoctor must be used within an AppProvider");
    return ctx;
};