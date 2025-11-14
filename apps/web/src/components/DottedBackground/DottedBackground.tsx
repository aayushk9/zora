import styles from './DottedBackground.module.css'; 

function DottedBackground({ children }: any) {
  return (
    <div className={styles.dottedContainer}>
      {children}
    </div>
  );
}

export default DottedBackground;