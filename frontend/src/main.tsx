import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "./components/ui/Provider";
import { AuthProvider } from "./components/context/AuthContext";
import { DoctorProvider } from "./components/context/DoctorContext";

import App from "./App";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Provider>
      <AuthProvider>
        <DoctorProvider>
        <App />
        </DoctorProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);