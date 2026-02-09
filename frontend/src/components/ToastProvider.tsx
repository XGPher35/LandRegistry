"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: "#1f2937",
                        color: "#f9fafb",
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        padding: "16px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#10b981",
                            secondary: "#f9fafb",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ef4444",
                            secondary: "#f9fafb",
                        },
                    },
                }}
            />
        </>
    );
}
