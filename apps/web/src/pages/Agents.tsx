import React from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { Sidebar } from "../components/Sidebar/Sidebar";

export default function Agents () {
  
    return (
        <React.Fragment>
          <div>
            <Navbar/>
            <Sidebar/>
          </div>
        </React.Fragment>
    )
}