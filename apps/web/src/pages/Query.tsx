import React, {lazy, Suspense} from "react";
import { GeneralPlan } from "../components/GeneralPlan/GeneralPlan";
import { useIsMobile } from "../components/useIsMobile/useIsMobile";
const Navbar = lazy(() => import("../components/Navbar/Navbar"))

export default function Query() {
    const isMobile = useIsMobile(768);
    return (
        <React.Fragment>
            {isMobile ? (
                <GeneralPlan />
            ) : (
                <>
                    <Suspense fallback={<div>loading..</div>}>
                      <Navbar/>
                    </Suspense>
                    <GeneralPlan />
                </>
            )}

        </React.Fragment>
    )
}