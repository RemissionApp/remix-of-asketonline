
import React from "react";
import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { TopBar } from "./TopBar";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 flex flex-col">
      <TopBar />
      <main className="flex-grow flex flex-col items-center px-4 py-4 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};
