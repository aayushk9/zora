import { AuthPage } from '../Auth/AuthPage';
import styles from './LandingPage.module.css'
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
    const navigate = useNavigate();

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
                            A live prediction market intelligence layer where users select live market events and prompt for analysis.
                        </p>

                        <div className={styles.actions}>
                            <button onClick={() => navigate("/app")} className={styles.primary}>
                                try zora
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.right}>
                    <AuthPage mode="landingPage" />
                </div>
            </div>
        </>
    );
}