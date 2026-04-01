import { Breadcrumb, Breadcrumbs, Button, Separator } from '../components-ui';
import styles from './SandboxUI.module.sass';

export default function StyleGuide() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>UI sandbox</h1>
      </div>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>UI bricks</h3>
          <h4>Button</h4>
          <div className={styles.preview}>
            <Button className={styles.button}>Button</Button>
          </div>
          <Separator />
          <h4>Breadcrumbs</h4>
          <Breadcrumbs>
            <Breadcrumb href="#">Home</Breadcrumb>
            <Breadcrumb href="#">React Aria</Breadcrumb>
            <Breadcrumb>Breadcrumbs</Breadcrumb>
          </Breadcrumbs>
        </div>
        <div className={styles.card}></div>
      </div>
    </div>
  );
}
