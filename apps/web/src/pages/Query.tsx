import React from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { GeneralPlan } from "../components/GeneralPlan/GeneralPlan";
import { Sidebar } from "../components/Sidebar/Sidebar";

export default function Query () {
    
    return (
       <React.Fragment>
           <Navbar/>
           <GeneralPlan/>
           <Sidebar/>
       </React.Fragment>
    )
}