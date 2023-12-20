import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import SettingsProvider from "./Providers/Settings";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <div className="fixed top-0 w-full left-0 z-[99999]">
          <Toaster />
        </div>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </SettingsProvider>
  </React.StrictMode>
);
