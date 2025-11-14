import React from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { GeneralPlan } from "../components/GeneralPlan/GeneralPlan";

export default function Query () {
    
    return (
       <React.Fragment>
           <Navbar/>
           <GeneralPlan/>
       </React.Fragment>
    )
}