import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "./components/ui/Provider";
import { AuthProvider } from "./components/context/AuthContext";
import { DoctorProvider } from "./components/context/DoctorContext";

import App from "./App";
import { PatientProvider } from "./components/context/PatientContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Provider>
      <AuthProvider>
        <PatientProvider>
        <DoctorProvider>
        <App />
        </DoctorProvider>
        </PatientProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);