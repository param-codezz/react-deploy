import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <TooltipProvider>
        <Header />
        <div className="m-2" />
        <div className="container">
          <Outlet />
        </div>
        {/* <Footer /> */}
      </TooltipProvider>
    </>
  );
}

export default Layout;
