import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "../types/auth.types";

interface PatientContextType {
  doctor: AuthUser | null;
  setPatient: (doctor: AuthUser | null) => void;
  clearPatient: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(
  undefined
);

export function PatientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [doctor, setPatient] = useState<AuthUser | null>(null);

  const clearPatient = () => {
    setPatient(null);
  };

  return (
    <PatientContext.Provider
      value={{
        doctor,
        setPatient,
        clearPatient,
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