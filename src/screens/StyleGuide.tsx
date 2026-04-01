import {
  Button,
  Checkbox,
  ProgressBar,
  TextField,
  SearchField,
  ToggleButton,
  TagGroup,
  Tag,
  ProgressCircle,
  Text,
  Link,
  Switch,
  Meter,
  NumberField,
  DateField,
  TimeField,
  DatePicker,
} from '../components-ui';
// Some are in ../components
import { Breadcrumbs as MyBreadcrumbs, Breadcrumb as MyBreadcrumb } from '../components/Breadcrumbs';
import { Separator } from '../components/Separator';

import styles from './StyleGuide.module.sass';

export default function StyleGuide() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>STYLE GUIDE</h1>
        <p>OMEDETO-ALISE UI COMPONENT GALLERY</p>
      </header>

      <div className={styles.grid}>
        {/* Left Column: Atoms */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>ATOMS</h2>
          <div className={styles.content}>
            
            {/* Buttons Row */}
            <section className={styles.row}>
              <h3 className={styles.rowTitle}>BUTTONS</h3>
              <div className={styles.subRow}>
                <div className={styles.variation}>
                  <Text>Primary</Text>
                  <div className={styles.flex}>
                    <Button variant="primary">BUTTON</Button>
                    <Button variant="primary" isDisabled>DISABLED</Button>
                  </div>
                </div>
                <div className={styles.variation}>
                  <Text>Secondary</Text>
                  <div className={styles.flex}>
                    <Button variant="secondary">BUTTON</Button>
                    <Button variant="secondary" isDisabled>DISABLED</Button>
                  </div>
                </div>
                <div className={styles.variation}>
                  <Text>Quiet</Text>
                  <div className={styles.flex}>
                    <Button variant="quiet">BUTTON</Button>
                    <Button variant="quiet" isDisabled>DISABLED</Button>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Selection Row */}
            <section className={styles.row}>
              <h3 className={styles.rowTitle}>SELECTION</h3>
              <div className={styles.subRow}>
                <div className={styles.variation}>
                  <Text>Checkbox</Text>
                  <div className={styles.flex}>
                    <Checkbox>UNSELECTED</Checkbox>
                    <Checkbox defaultSelected>SELECTED</Checkbox>
                    <Checkbox isDisabled>DISABLED</Checkbox>
                  </div>
                </div>
                <div className={styles.variation}>
                  <Text>Switch</Text>
                  <div className={styles.flex}>
                    <Switch>OFF</Switch>
                    <Switch defaultSelected>ON</Switch>
                    <Switch isDisabled>DISABLED</Switch>
                  </div>
                </div>
                <div className={styles.variation}>
                  <Text>Toggle Button</Text>
                  <div className={styles.flex}>
                    <ToggleButton>TOGGLE</ToggleButton>
                    <ToggleButton defaultSelected>ACTIVE</ToggleButton>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Form Fields Row */}
            <section className={styles.row}>
              <h3 className={styles.rowTitle}>FORM FIELDS</h3>
              <div className={styles.subRow}>
                <div className={styles.variation}>
                  <TextField label="Text Field" placeholder="Enter text..." />
                </div>
                <div className={styles.variation}>
                  <NumberField label="Number Field" defaultValue={42} />
                </div>
                <div className={styles.variation}>
                  <SearchField label="Search Field" placeholder="Search..." />
                </div>
              </div>
            </section>

            <Separator />

            {/* Date & Time Row */}
            <section className={styles.row}>
              <h3 className={styles.rowTitle}>DATE & TIME</h3>
              <div className={styles.subRow}>
                <div className={styles.variation}>
                  <DateField label="Date Field" />
                </div>
                <div className={styles.variation}>
                  <TimeField label="Time Field" />
                </div>
                <div className={styles.variation}>
                  <DatePicker label="Date Picker" />
                </div>
              </div>
            </section>

            <Separator />

            {/* Progress & Feedback Row */}
            <section className={styles.row}>
              <h3 className={styles.rowTitle}>PROGRESS & FEEDBACK</h3>
              <div className={styles.subRow}>
                <div className={styles.variation}>
                  <Text>Progress Bar</Text>
                  <ProgressBar label="Label" value={60} />
                  <ProgressBar label="Indeterminate" isIndeterminate />
                </div>
                <div className={styles.variation}>
                  <Text>Progress Circle</Text>
                  <div className={styles.flex}>
                    <ProgressCircle value={60} aria-label="60%" />
                    <ProgressCircle isIndeterminate aria-label="Loading" />
                  </div>
                </div>
                <div className={styles.variation}>
                  <Text>Meter</Text>
                  <Meter label="Storage" value={85} />
                </div>
              </div>
            </section>

            <Separator />

            {/* Tags & Badges Row */}
            <section className={styles.row}>
              <h3 className={styles.rowTitle}>TAGS</h3>
              <div className={styles.subRow}>
                <TagGroup label="Categories" selectionMode="multiple">
                  <Tag id="1">TECH</Tag>
                  <Tag id="2">MUSIC</Tag>
                  <Tag id="3">ART</Tag>
                </TagGroup>
              </div>
            </section>

            <Separator />

            {/* Misc Atoms */}
            <section className={styles.row}>
              <h3 className={styles.rowTitle}>MISC</h3>
              <div className={styles.subRow}>
                <div className={styles.variation}>
                  <Text>Link</Text>
                  <div className={styles.flex}>
                    <Link href="#">PRIMARY LINK</Link>
                  </div>
                </div>
                <div className={styles.variation}>
                  <Text>Breadcrumbs</Text>
                  <MyBreadcrumbs>
                    <MyBreadcrumb href="#">HOME</MyBreadcrumb>
                    <MyBreadcrumb href="#">STYLE GUIDE</MyBreadcrumb>
                    <MyBreadcrumb>ATOMS</MyBreadcrumb>
                  </MyBreadcrumbs>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Right Column: Containers (Empty for now) */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>CONTAINERS</h2>
          <div className={styles.content}>
            <p className={styles.placeholder}>RIGHT COLUMN EMPTY FOR NOW</p>
          </div>
        </div>
      </div>
    </div>
  );
}
