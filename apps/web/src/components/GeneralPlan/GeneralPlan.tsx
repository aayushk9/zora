import React from "react"
import { useIsMobile } from "../useIsMobile/useIsMobile"
import { DesktopLayout } from "./DesktopLayout/DesktopLayout";
import { MobileLayout } from "./MobileLayout/MobileLayout";

export function GeneralPlan() {

   const isMobile = useIsMobile(768);

   return (
      <React.Fragment>
         {isMobile ? (
            <MobileLayout />
         ) : (
            <DesktopLayout />
         )}
      </React.Fragment>
   )
}