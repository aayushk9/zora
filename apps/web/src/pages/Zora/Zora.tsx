import React from "react";
import { Navbar } from "../../components/Navbar/Navbar.tsx"
import  { InputBox } from '../../components/InputBox/InputBox.tsx'
import { Events } from "../../components/Events/Events.tsx"
import styles from './Zora.module.css'
import { Beta } from "../../components/Beta/Beta.tsx";

export default function Zora() {

    return (
        <React.Fragment>
            <Navbar />
            <div className={styles.parentContainer}>
                <div className={styles.childContainer}>
                    <span className={styles.miniHeader}>
                        supporting jupiter prediction market
                    </span>
                    <h1 className={styles.mainHeader}>
                        Ask Zora to Trade <span>Prediction Market</span>
                    </h1>
                    <span className={styles.foot}>
                        Build prediction market strategies in minutes with a single prompt
                    </span>   
                </div>
            
                  <InputBox/>
                  <Events/>
            </div>
        </React.Fragment>
    )
}