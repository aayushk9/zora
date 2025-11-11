import React from "react";
import { Navbar } from "../../components/Navbar/Navbar.tsx"
import  { InputBox } from '../../components/InputBox/InputBox.tsx'
import styles from './Zora.module.css'

export default function Zora() {

    return (
        <React.Fragment>
            <Navbar />
            <div className={styles.parentContainer}>
                <div className={styles.childContainer}>
                    <span className={styles.miniHeader}>
                        currenlty supporting polymarket
                    </span>
                    <h1 className={styles.mainHeader}>
                        Ask Zora to Trade <span style={{ color: "#00E7FF"}}>Prediction Markets</span>
                    </h1>
                    <span className={styles.foot}>
                        Build prediction market strategies in minutes with a single prompt.
                    </span>   
                </div>
                <div id="imports">
                  <InputBox/>
                </div>
            </div>
        </React.Fragment>
    )
}