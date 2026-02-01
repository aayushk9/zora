import styles from './LandingPage.module.css'
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../useIsMobile/useIsMobile';
import { useState } from 'react';
import Prism from '../Prism/Prism';

export function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

  const [inputValue, setInputValue] = useState('');

  const tasks = [
    {
      id: "1",
      title: "Live Market Events",
      message:
        "Pick an active prediction market directly from live events and prompt zora for suggestions, analyzing and understanding market",
    },
    {
      id: "2",
      title: "AI Insights",
      message:
        "AI analyzes probability shifts, sentiment, catalysts and optimal positioning.",

    },
    {
      id: "3",
      title: "Monitor events",
      message:
        "Soon (agents will track news, X trends and onchain signals automatically)",

    }]

  return (
    <>
      <div className={styles.page}>
        {!isMobile && (
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
        )}

        <div className={styles.right}>

          {!isMobile && (
            <Prism
              animationType="rotate"
              height={3.5}
              baseWidth={5.5}
              scale={3.6}
              hueShift={0}
              colorFrequency={1}
              noise={0}
              glow={1}
              timeScale={0.6}
              className={styles.background}
            />
          )}

          <div className={styles.demoBox}>
            <h2 className={styles.heroText}>
              Ship prediction market strategies in minutes
            </h2>

            <p className={styles.heroSubtext}>
              Automate your edge in minutes
            </p>

            <div className={styles.brandTop}>
              <span className={styles.brandIcon}>▲</span>
              ZORA WORKFLOW
            </div>

            <div className={styles.promptBox}>
              <div className={styles.promptTop}>
                <input
                  type="text"
                  className={styles.promptInput}
                  placeholder="Example: Will BTC hit $100k this year?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />

                <button className={styles.askButton} onClick={() => navigate("/app")}>
                  ASK ZORA <span>→</span>
                </button>
              </div>

              <div className={styles.promptBottom}>
                <span className={styles.contextLabel}>
                  @ Select Event
                </span>
              </div>
            </div>

            <div className={styles.taskList}>
              {tasks.map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <span className={styles.taskTitle}>{task.title}</span>
                  </div>
                  <p className={styles.taskMessage}>{task.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}