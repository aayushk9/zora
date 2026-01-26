import {Navbar} from "../../components/Navbar/Navbar.tsx"
import { InputBox } from '../../components/InputBox/InputBox.tsx'
import { Events } from "../../components/Events/Events.tsx"
import styles from './Zora.module.css'
import { useNavigate } from "react-router-dom";
import { LimitExceedNotification } from "../../components/LimitExceedNotification/LimitExceedNotification.tsx";
import { useQuotaStore } from "../../store/useQuotaStore.ts";

export default function Zora() {

    const navigate = useNavigate()
    const quotaExceeded = useQuotaStore((state) => state.isExceeded)
    
    const handleLandingSend = (query: string) => {
        navigate(`/query?c=${encodeURIComponent(query)}&src=landing`)
    }

    return (
        <div className={styles.body}>
            <Navbar />
            <div className={styles.parentContainer}>
                <div className={styles.childContainer}>
                    <span className={styles.miniHeader}>
                        supporting jupiter prediction market
                    </span>
                    <h1 className={styles.mainHeader}>
                        Ask Zora to Analyze Prediction Markets
                    </h1>
                    <span className={styles.foot}>
                        Explore prediction market strategies with a single prompt
                    </span>
                </div>
                <InputBox onSend={handleLandingSend} />
                {quotaExceeded && <LimitExceedNotification/> }
                <Events />
            </div>
        </div>
    )
}