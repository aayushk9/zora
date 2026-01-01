import React, { lazy, Suspense } from "react"
import { useIsMobile } from "../useIsMobile/useIsMobile"
const DesktopLayout = lazy(() => import("./DesktopLayout/DesktopLayout"))
const MobileLayout = lazy(() => import("./MobileLayout/MobileLayout"))

export function GeneralPlan() {

   const isMobile = useIsMobile(768);

   return (
      <React.Fragment>
         {isMobile ? (
            <Suspense fallback={<div>loading...</div>}>
               <MobileLayout />
            </Suspense>
         ) : (
            <Suspense fallback={<div>loading...</div>}>
               <DesktopLayout />
            </Suspense>
         )}
      </React.Fragment>
   )
}