import React from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { AgentNetwork } from "../components/AgentNetwork/AgentNetwork";

export default function Agents () {
  
    return (
        <React.Fragment>
          <div>
             <Navbar/>
             <AgentNetwork/>
          </div>
        </React.Fragment>
    )
}