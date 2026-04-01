import { Breadcrumbs, Button } from '../components-ui';
import styles from './SandboxUI.module.sass';

export default function StyleGuide() {
  return (
    <div className={styles.container}>
      <h1>UI sandbox</h1>
      <Button className={styles.button}>Button</Button>
      <Breadcrumbs className={styles.button}>Button</Breadcrumbs>
    </div>
  );
}
