import React from "react";
import { Navbar } from "../../components/Navbar/Navbar.tsx"
import { InputBox } from '../../components/InputBox/InputBox.tsx'
import { Events } from "../../components/Events/Events.tsx"
import styles from './Zora.module.css'
import { useNavigate } from "react-router-dom";

export default function Zora() {

    const navigate = useNavigate()

    const handleLandingSend = (query: string) => {
        navigate(`/query?text=${encodeURIComponent(query)}`)
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className={styles.parentContainer}>
                <div className={styles.childContainer}>
                    <span className={styles.miniHeader}>
                        supporting jupiter prediction market
                    </span>
                    <h1 className={styles.mainHeader}>
                        Ask Zora to {""}
                        <span className={styles.trade}>
                            Trade
                        </span> {""}
                        Prediction Markets
                    </h1>
                    <span className={styles.foot}>
                        Build prediction market strategies in minutes with a single prompt
                    </span>
                </div>
                <InputBox onSend={handleLandingSend} />
                <Events />
            </div>
        </React.Fragment>
    )
}