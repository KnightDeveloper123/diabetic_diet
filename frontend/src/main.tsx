import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "./components/ui/provider";
import { AuthProvider } from "./components/context/AuthContext";

import App from "./App";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Provider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);