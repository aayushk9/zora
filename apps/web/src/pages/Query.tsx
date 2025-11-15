import React from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { GeneralPlan } from "../components/GeneralPlan/GeneralPlan";
import { useIsMobile } from "../components/useIsMobile/useIsMobile";

export default function Query() {
    const isMobile = useIsMobile(768);
    return (
        <React.Fragment>
            {isMobile ? (
                <GeneralPlan />
            ) : (
                <>
                    <Navbar />
                    <GeneralPlan />
                </>
            )}

        </React.Fragment>
    )
}