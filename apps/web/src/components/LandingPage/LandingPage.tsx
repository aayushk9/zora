import styles from './LandingPage.module.css'
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../useIsMobile/useIsMobile';
import { useState } from 'react';
import LightRays from '../LightRays/LightRays';

export function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

  const [inputValue, setInputValue] = useState('');

  const [tasks] = useState<Task[]>([
    {
      id: "1",
      type: "market",
      from: "Live Market Event",
      message: "User selects an active prediction market from Jupiter Prediction Market",
    },
    {
      id: "2",
      type: "prompt",
      from: "User Prompt",
      message: "Ask: What is the best position given current probability shifts?",
    },
    {
      id: "3",
      type: "analysis",
      from: "Zora AI Insight",
      message: "AI explains trend momentum, market sentiment, and key catalysts",
    },
  ]);

  interface Task {
    id: string;
    type: "market" | "prompt" | "analysis" | "strategy";
    from: string;
    message: string;
  }


  const getTaskIcon = (type: string) => {
    switch (type) {
      case "election":
        return "🗳️";
      case "crypto":
        return "₿";
      case "macro":
        return "📉";
      case "sports":
        return "🏆";
    }
  };


  return (
    <>
      <div className={styles.page}>
        <div className={styles.left}>
          <div className={styles.navbar}>zora</div>
          <div className={styles.content}>
            <h1 className={styles.heading}>
              hi. this IS <br /> ZORA
            </h1>

            <p className={styles.subtext}>
              The intelligence layer for prediction markets where users select live market events and prompt for insights and analysis
            </p>

            <div className={styles.actions}>
              <button onClick={() => navigate("/app")} className={styles.primary}>
                try zora
              </button>
            </div>
          </div>
        </div>

        {!isMobile ? (
          <div className={styles.right}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={1}
              lightSpread={0.5}
              rayLength={3}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0}
              distortion={0}
              pulsating={false}
              fadeDistance={1}
              saturation={1}
              className={styles.raysBackground}
            />

            <div className={styles.rhs}>
              <div className={styles.rhsContent}>
                <div className={styles.brandTop}>
                  <span className={styles.brandIcon}>▲</span> ZORA
                </div>

                <div className={styles.container}>
                  <div className={styles.content}>
                    <h1 className={styles.heroText}>
                      Ship prediction market strategies in minutes
                    </h1>
                    <p className={styles.heroSubtext}>
                      Analyze trends and optimize your positions with AI-driven insights.
                    </p>

                    <div className={styles.inputWrapper}>
                      <div className={styles.inputContainer}>
                        <span className={styles.inputIcon}>{getTaskIcon('github')}</span>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Analyze: Will Bitcoin hit $100k this year?"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button className={styles.goButton}>
                          Ask AI <span className={styles.goArrow}>→</span>
                        </button>
                      </div>

                      <button className={styles.addContext}>
                        <span className={styles.atSymbol}>@</span>
                        Select event
                        <span className={styles.contextIcons}>
                          <span className={styles.contextIcon}>📄</span>
                          <span className={styles.contextIcon}>🔗</span>
                          <span className={styles.contextIcon}>📊</span>
                        </span>
                      </button>
                    </div>

                    <div className={styles.taskList}>
                      {tasks.map((task) => (
                        <div key={task.id} className={styles.taskCard}>
                          <div className={styles.taskHeader}>
                            <span className={styles.taskFrom}>
                              <span className={styles.taskIcon}>
                                {getTaskIcon(task.type)}
                              </span>
                              <span className={styles.fromName}>{task.from}</span>
                            </span>
                            <span className={styles.taskMessage}>{task.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}