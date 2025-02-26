"use client"
import { AnimatePresence, motion } from "framer-motion";
import { X, Menu, Calendar, Home, Users, Settings } from "lucide-react";
import { useState } from "react";
import NAVBAR from "../components/sidebar"

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <NAVBAR/>

  
        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    );
  }
  