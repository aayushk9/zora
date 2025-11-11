import React from "react";
import { Navbar } from "../components/Navbar/Navbar.tsx"
import  { InputBox } from '../components/InputBox/InputBox.tsx'

export default function Zora() {

    return (
        <React.Fragment>
            <Navbar />
            <div style={{
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                height: "93vh",
                width: "100%",
                boxSizing: "border-box",
                overflow: "hidden",
                overflowY: "auto",
                marginTop: "4px"
            }}>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "50px",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}
                >
                    <span style={{
                        border: "1px solid rgba(255, 255, 255, 0.6)",
                        borderRadius: "20px",
                        color: "white",
                        fontSize: "12px",
                        letterSpacing: "1px",
                        padding: "8px 18px",
                        textTransform: "uppercase",
                        fontFamily: "sans-serif",
                        marginBottom: "0.7rem"
                    }}>
                        currenlty supporting polymarket
                    </span>

                    <h1 style={{
                        color: "#FFFFFF",
                        fontFamily: "sans-serif",
                        fontWeight: 700, 
                        fontSize: '38px',
                        margin: 0
                    }}>Ask Zora to Trade <span style={{ color: "#00E7FF"}}>Prediction Markets</span></h1>

                    <span style={{
                        color: "#CCCCCC",
                        fontSize: "1rem",
                        fontFamily: "sans-serif",
                        margin: 0,
                        lineHeight: 1.2
                    }}>
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