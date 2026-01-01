import  {Navbar}  from "../../components/Navbar/Navbar";
import  {AgentNetwork} from "../../components/AgentNetwork/AgentNetwork";
import styles from './Agents.module.css'

export default function Agents () {
  
    return (
          <div className={styles.parent}>
             <Navbar/>
             <AgentNetwork/>
          </div>
    )
}