const AgentNetwork = lazy(() => import("../../components/AgentNetwork/AgentNetwork"))
const Navbar = lazy(() => import("../../components/Navbar/Navbar"))
import styles from './Agents.module.css'
import { lazy, Suspense } from "react";

export default function Agents () {
  
    return (
          <div className={styles.parent}>
             <Suspense fallback={<div>loading...</div>}>
                <Navbar/>
                <AgentNetwork/>
             </Suspense>
          </div>
    )
}