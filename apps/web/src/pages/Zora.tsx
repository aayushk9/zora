import React from "react";
import { Navbar } from "../components/Navbar/Navbar.tsx"

export default function Zora() {

    return (
        <React.Fragment>
            <Navbar />
            <div style={{
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                height: "94vh",
                width: "99vw",
                boxSizing: "border-box",
                overflow: "hidden",
                overflowY: "auto",
                marginTop: "4px"
            }}>

                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        overflowY: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingTop: "20px",
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
                        
                        backdropFilter: "blur(6px)",
                    }}>
                        currenlty supporting polymarket
                    </span>

                    
                </div>

                {/* import input box and events here */}
            </div>
        </React.Fragment>
    )
}