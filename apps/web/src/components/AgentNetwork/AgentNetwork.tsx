import React, { useState } from "react";
import styles from './AgentNetwork.module.css';
import createAgent from "../../assets/createAgent.png";
import runAgent from "../../assets/runAgent.png"

const AgentCard = ({ title, description, image}: {
    title: string;
    description: React.ReactNode;
    image: string;
}) => {
    return (
        <div className={styles.agentCard}>
            <img
                src={image}
                alt={`${title} icon`}
                className={styles.cardImage}
            />

            <h2 className={styles.cardTitle}>
                {title}
            </h2>
            <p className={styles.cardDescription}>
                {description}
            </p>

        </div>
    );
}


export function AgentNetwork() {
    const [searchInput, setSearchInput] = useState("");
    
    return (
        <React.Fragment>
            <div className={styles.parentContainer}>
                <div className={styles.topBar}>
                    <h1 className={styles.mainHeader}>Agent Dashboard</h1>
                    <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className={styles.search} type="text" placeholder="Search tools..." />
                </div>

                <div className={styles.agentsContainer}>
                    <AgentCard
                        image={createAgent}
                        title="Create an agent"
                        description={
                            <>
                                Design an highly customizable agent that 
                                can run 24/7 in the background
                            </>
                        }
                    />
                    <AgentCard
                        image={runAgent}
                        title="Run an agent"
                        description={
                            <>
                                Use the default agent, pre installed 
                                system agents or run one of your own
                            </>
                        }
                    />
                </div>
                 <span className={styles.beta}>Stay tuned, coming soon</span>
            </div>
        </React.Fragment>
    );
}