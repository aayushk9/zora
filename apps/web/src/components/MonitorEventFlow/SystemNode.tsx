import { Handle, Position } from 'reactflow';
import styles from './SystemNode.module.css';

export function SystemNode({ data }: any) {
  return (
    <div className={styles.node}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>{data.title}</span>
          <span className={styles.metaLabel}>{data.meta}</span>
        </div>
        {data.tag && <span className={styles.tag}>{data.tag}</span>}
      </div>

      <div className={styles.body}>
        {data.description}
      </div>

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
}