import { useState } from 'react';
import { CalendarDate, Time } from '@internationalized/date';
import { Dialog, DialogTrigger, Input, parseColor } from 'react-aria-components';
import * as UI from '../components-ui';
import styles from './SandboxUI.module.sass';
import { ConstellationPickerMockup } from '../components/SoundPicker/MockupVariants';

const fruitItems = [
  { id: 'strawberry', name: 'Strawberry' },
  { id: 'melon', name: 'Melon' },
  { id: 'yuzu', name: 'Yuzu' },
] as const;

const commandItems = [
  { id: 'open-shop', name: 'Open Shop' },
  { id: 'show-profile', name: 'Show Profile' },
  { id: 'toggle-glitch', name: 'Toggle Glitch' },
] as const;

const tagItems = [
  { id: 'neon', name: 'Neon' },
  { id: 'rain', name: 'Rain' },
  { id: 'metro', name: 'Metro' },
] as const;

const gridItems = [
  { id: 'alise', title: 'Alise', image: '/alise-1.svg' },
  { id: 'tokyo', title: 'Tokyo Echo', image: '/alise-2.svg' },
] as const;

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <UI.CardSection title={title} bodyClassName={styles.preview}>
      {children}
    </UI.CardSection>
  );
}

export default function StyleGuide() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className={styles.container}>
      <UI.MyToastRegion />

      <div className={styles.header}>
        <h1>UI sandbox</h1>
        <p>A playground for unified components and prototype mockups.</p>
      </div>

      <UI.Tabs defaultSelectedKey="elements">
        <UI.TabList aria-label="Sandbox sections">
          <UI.Tab id="elements">UI Elements</UI.Tab>
          <UI.Tab id="mockups">Mockups</UI.Tab>
        </UI.TabList>

        <UI.TabPanels>
          <UI.TabPanel id="elements">
            <div className={styles.grid}>
              <SectionCard title="Breadcrumbs">
                <UI.Breadcrumbs>
                  <UI.Breadcrumb href="#">Home</UI.Breadcrumb>
                  <UI.Breadcrumb href="#">Tokyo</UI.Breadcrumb>
                  <UI.Breadcrumb>Sandbox</UI.Breadcrumb>
                </UI.Breadcrumbs>
              </SectionCard>

              <SectionCard title="Button">
                <div className={styles.row}>
                  <UI.Button>Primary</UI.Button>
                  <UI.Button variant="secondary">Secondary</UI.Button>
                  <UI.Button variant="quiet">Quiet</UI.Button>
                </div>
              </SectionCard>

              <SectionCard title="Checkbox">
                <div className={styles.stack}>
                  <UI.Checkbox defaultSelected>Enable neon overlay</UI.Checkbox>
                  <UI.Checkbox isIndeterminate>Pending district sync</UI.Checkbox>
                </div>
              </SectionCard>

              <SectionCard title="CheckboxGroup">
                <UI.CheckboxGroup label="District mood" defaultValue={['rain', 'metro']}>
                  <UI.Checkbox value="rain">Rain reflections</UI.Checkbox>
                  <UI.Checkbox value="metro">Metro ambience</UI.Checkbox>
                  <UI.Checkbox value="arcade">Arcade signal</UI.Checkbox>
                </UI.CheckboxGroup>
              </SectionCard>

              <SectionCard title="ColorPicker">
                <UI.ColorPicker label="Primary glow" defaultValue={parseColor('#ff2ad4')} />
              </SectionCard>

              <SectionCard title="ColorSwatch">
                <UI.ColorSwatch color={parseColor('#00f5ff')} />
              </SectionCard>

              <SectionCard title="ColorSwatchPicker">
                <UI.ColorSwatchPicker defaultValue={parseColor('#00f5ff')} aria-label="Theme swatches">
                  <UI.ColorSwatchPickerItem color={parseColor('#ff2ad4')} />
                  <UI.ColorSwatchPickerItem color={parseColor('#00f5ff')} />
                  <UI.ColorSwatchPickerItem color={parseColor('#ffe45e')} />
                </UI.ColorSwatchPicker>
              </SectionCard>

              <SectionCard title="ComboBox">
                <UI.ComboBox label="Favorite fruit" items={fruitItems} defaultSelectedKey="melon">
                  {(item) => <UI.ComboBoxItem>{item.name}</UI.ComboBoxItem>}
                </UI.ComboBox>
              </SectionCard>

              <SectionCard title="CommandPalette">
                <div className={styles.stack}>
                  <UI.Button onPress={() => setIsCommandPaletteOpen(true)}>Open palette</UI.Button>
                  <UI.Text>Press Cmd/Ctrl + J also works.</UI.Text>
                </div>
                <UI.CommandPalette
                  aria-label="Command palette"
                  items={commandItems}
                  isOpen={isCommandPaletteOpen}
                  onOpenChange={(isOpen) => setIsCommandPaletteOpen(Boolean(isOpen))}
                >
                  {(item) => <UI.MenuItem>{item.name}</UI.MenuItem>}
                </UI.CommandPalette>
              </SectionCard>

              <SectionCard title="Content">
                <div className={styles.stack}>
                  <UI.Heading level={3}>Late-night signal</UI.Heading>
                  <UI.Text>Quiet social presence with reactive sound and identity fragments.</UI.Text>
                </div>
              </SectionCard>

              <SectionCard title="DateField">
                <UI.DateField label="Event date" defaultValue={new CalendarDate(2026, 4, 1)} />
              </SectionCard>

              <SectionCard title="Disclosure">
                <UI.Disclosure defaultExpanded>
                  <UI.DisclosureHeader>Reveal district note</UI.DisclosureHeader>
                  <UI.DisclosurePanel>Akihabara glows louder after midnight.</UI.DisclosurePanel>
                </UI.Disclosure>
              </SectionCard>

              <SectionCard title="DisclosureGroup">
                <UI.DisclosureGroup defaultExpandedKeys={['vision']}>
                  <UI.Disclosure id="vision">
                    <UI.DisclosureHeader>Vision</UI.DisclosureHeader>
                    <UI.DisclosurePanel>Interaction should lead identity, not the other way around.</UI.DisclosurePanel>
                  </UI.Disclosure>
                  <UI.Disclosure id="world">
                    <UI.DisclosureHeader>World</UI.DisclosureHeader>
                    <UI.DisclosurePanel>Tokyo night is a system constraint, not visual garnish.</UI.DisclosurePanel>
                  </UI.Disclosure>
                </UI.DisclosureGroup>
              </SectionCard>

              <SectionCard title="DropZone">
                <UI.DropZone aria-label="Upload pack">Drop files here</UI.DropZone>
              </SectionCard>

              <SectionCard title="Form">
                <UI.Form className={styles.stack} onSubmit={(event) => event.preventDefault()}>
                  <UI.TextField label="Name" defaultValue="Alise" />
                  <UI.Button type="submit">Submit</UI.Button>
                </UI.Form>
              </SectionCard>

              <SectionCard title="GridList">
                <UI.GridList aria-label="Character grid" items={gridItems} selectionMode="multiple">
                  {(item) => (
                    <UI.GridListItem textValue={item.title}>
                      <img src={item.image} alt="" />
                      <UI.Text>{item.title}</UI.Text>
                      <UI.Text slot="description">Preview card</UI.Text>
                    </UI.GridListItem>
                  )}
                </UI.GridList>
              </SectionCard>

              <SectionCard title="InputGroup">
                <UI.InputGroup label="Inline controls">
                  <UI.Button variant="quiet" aria-label="minus">
                    -
                  </UI.Button>
                  <Input className={styles.inlineInput} defaultValue="12" />
                  <UI.Button variant="quiet" aria-label="plus">
                    +
                  </UI.Button>
                </UI.InputGroup>
              </SectionCard>

              <SectionCard title="Link">
                <UI.Link href="#">Open district archive</UI.Link>
              </SectionCard>

              <SectionCard title="ListBox">
                <div className={styles.stack} style={{ width: '100%', maxWidth: '320px' }}>
                  <UI.ListBox aria-label="Standard List" selectionMode="single">
                    <UI.ListBoxItem>Aardvark</UI.ListBoxItem>
                    <UI.ListBoxItem>Cat</UI.ListBoxItem>
                    <UI.ListBoxItem>Dog</UI.ListBoxItem>
                    <UI.ListBoxItem>Kangaroo</UI.ListBoxItem>
                  </UI.ListBox>

                  <UI.Text slot="description">Library implementation mockup:</UI.Text>

                  <UI.ListBox aria-label="Library Preview" selectionMode="single" selectedKeys={['rain']}>
                    <UI.ListBoxItem isUsed action="−">
                      Tokyo Night
                    </UI.ListBoxItem>
                    <UI.ListBoxItem>Metro Echo</UI.ListBoxItem>
                    <UI.ListBoxItem id="rain" action="+">
                      Rain Signal
                    </UI.ListBoxItem>
                    <UI.ListBoxItem>Ambient neon rain...</UI.ListBoxItem>
                    <UI.ListBoxItem isUsed action="−">
                      Neon Rain signal
                    </UI.ListBoxItem>
                  </UI.ListBox>
                </div>
              </SectionCard>

              <SectionCard title="Meter">
                <UI.MenuTrigger>
                  <UI.Button>Open menu</UI.Button>
                  <UI.Menu aria-label="Quick actions">
                    <UI.MenuSection>
                      <UI.Header>Operations</UI.Header>
                      <UI.MenuItem>Preview board</UI.MenuItem>
                      <UI.MenuItem>Share combo</UI.MenuItem>
                    </UI.MenuSection>
                    <UI.Separator />
                    <UI.MenuSection>
                      <UI.Header>Account</UI.Header>
                      <UI.MenuItem>Open profile</UI.MenuItem>
                    </UI.MenuSection>
                  </UI.Menu>
                </UI.MenuTrigger>
              </SectionCard>

              <SectionCard title="Meter">
                <UI.Meter label="Signal load" value={72} minValue={0} maxValue={100} />
              </SectionCard>

              <SectionCard title="Modal">
                <div className={styles.stack}>
                  <UI.Button onPress={() => setIsModalOpen(true)}>Open modal</UI.Button>
                  <UI.Modal
                    isDismissable
                    isOpen={isModalOpen}
                    onOpenChange={(isOpen) => setIsModalOpen(Boolean(isOpen))}
                  >
                    <Dialog className={styles.dialogCard}>
                      <UI.Heading level={3}>Modal sample</UI.Heading>
                      <UI.Text>Simple overlay dialog using the shared modal wrapper.</UI.Text>
                      <UI.Button onPress={() => setIsModalOpen(false)}>Close</UI.Button>
                    </Dialog>
                  </UI.Modal>
                </div>
              </SectionCard>

              <SectionCard title="NumberField">
                <UI.NumberField label="Slots" defaultValue={3} minValue={1} maxValue={12} />
              </SectionCard>

              <SectionCard title="Popover">
                <DialogTrigger>
                  <UI.Button>Open popover</UI.Button>
                  <UI.Popover>
                    <Dialog className={styles.popoverCard}>
                      <UI.Heading level={3}>Popover sample</UI.Heading>
                      <UI.Text>Compact contextual surface.</UI.Text>
                    </Dialog>
                  </UI.Popover>
                </DialogTrigger>
              </SectionCard>

              <SectionCard title="ProgressBar">
                <UI.ProgressBar label="Combo discovery" value={68} />
              </SectionCard>

              <SectionCard title="ProgressCircle">
                <UI.ProgressCircle aria-label="Loading" isIndeterminate size={32} />
              </SectionCard>

              <SectionCard title="RadioGroup">
                <UI.RadioGroup label="Render mode" defaultValue="stable">
                  <UI.Radio value="stable">Stable</UI.Radio>
                  <UI.Radio value="glitch">Glitch</UI.Radio>
                </UI.RadioGroup>
              </SectionCard>

              <SectionCard title="SearchField">
                <UI.SearchField
                  label="Search"
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search sounds"
                />
              </SectionCard>

              <SectionCard title="SegmentedControl">
                <UI.SegmentedControl selectionMode="single" defaultSelectedKeys={['ambient']}>
                  <UI.SegmentedControlItem id="ambient">Ambient</UI.SegmentedControlItem>
                  <UI.SegmentedControlItem id="beats">Beats</UI.SegmentedControlItem>
                  <UI.SegmentedControlItem id="voice">Voice</UI.SegmentedControlItem>
                </UI.SegmentedControl>
              </SectionCard>

              <SectionCard title="Select">
                <UI.Select label="District" items={fruitItems} defaultSelectedKey="yuzu">
                  {(item) => <UI.SelectItem>{item.name}</UI.SelectItem>}
                </UI.Select>
              </SectionCard>

              <SectionCard title="Separator">
                <div className={styles.stack}>
                  <UI.Text>Top block</UI.Text>
                  <UI.Separator />
                  <UI.Text>Bottom block</UI.Text>
                </div>
              </SectionCard>

              <SectionCard title="Sheet">
                <div className={styles.stack}>
                  <UI.Button onPress={() => setIsSheetOpen(true)}>Open sheet</UI.Button>
                  {isSheetOpen && (
                    <UI.Sheet isOpen onOpenChange={(isOpen) => setIsSheetOpen(Boolean(isOpen))}>
                      <div className={styles.sheetContent}>
                        <UI.Heading level={3}>Sheet sample</UI.Heading>
                        <UI.Text>Side panel for larger contextual tasks.</UI.Text>
                        <UI.Button onPress={() => setIsSheetOpen(false)}>Close sheet</UI.Button>
                      </div>
                    </UI.Sheet>
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Slider">
                <UI.Slider label="Glow intensity" defaultValue={55} />
              </SectionCard>

              <SectionCard title="Switch">
                <UI.Switch defaultSelected>Enable ambient presence</UI.Switch>
              </SectionCard>

              <SectionCard title="TagGroup">
                <UI.TagGroup aria-label="Tags" items={tagItems}>
                  {(item) => <UI.Tag>{item.name}</UI.Tag>}
                </UI.TagGroup>
              </SectionCard>

              <SectionCard title="TextField">
                <UI.TextField label="Profile title" defaultValue="Neon Listener" />
              </SectionCard>

              <SectionCard title="TimeField">
                <UI.TimeField label="Night cycle" defaultValue={new Time(2, 15)} />
              </SectionCard>

              <SectionCard title="Toast">
                <UI.Button
                  onPress={() =>
                    UI.queue.add({
                      title: 'Tokyo signal',
                      description: 'Ambient toast preview triggered.',
                    })
                  }
                >
                  Trigger toast
                </UI.Button>
              </SectionCard>

              <SectionCard title="ToggleButton">
                <UI.ToggleButton defaultSelected>Loop mode</UI.ToggleButton>
              </SectionCard>

              <SectionCard title="ToggleButtonGroup">
                <UI.ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['shibuya']}>
                  <UI.ToggleButton id="shibuya">Shibuya</UI.ToggleButton>
                  <UI.ToggleButton id="akiba">Akiba</UI.ToggleButton>
                  <UI.ToggleButton id="metro">Metro</UI.ToggleButton>
                </UI.ToggleButtonGroup>
              </SectionCard>

              <SectionCard title="Tooltip">
                <UI.TooltipTrigger>
                  <UI.Button>Hover me</UI.Button>
                  <UI.Tooltip>Quiet social signal</UI.Tooltip>
                </UI.TooltipTrigger>
              </SectionCard>
            </div>
          </UI.TabPanel>

          <UI.TabPanel id="mockups">
            <div className={styles.mockupContainer}>
              <ConstellationPickerMockup />
            </div>
          </UI.TabPanel>
        </UI.TabPanels>
      </UI.Tabs>
    </div>
  );
}
