import os
import re

def fix_sass_indentation(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    lines = content.splitlines()
    new_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        if not stripped:
            new_lines.append(line)
            i += 1
            continue
            
        # Is this a selector?
        # 1. Starts with . # & or @media
        # 2. Ends with ,
        # 3. Is a simple tag name (no : except maybe pseudo-class)
        is_selector = False
        if re.match(r'^[\s]*([.&%#@]|&:|&\[)', line):
            if ': ' not in stripped:
                is_selector = True
            elif stripped.startswith('@media'):
                is_selector = True
        elif stripped.endswith(','):
            is_selector = True
        elif re.match(r'^[\s]*[a-zA-Z0-9-]+$', line):
            is_selector = True
            
        new_lines.append(line)
        
        if is_selector:
            indent = len(line) - len(line.lstrip())
            # Check subsequent lines
            j = i + 1
            while j < len(lines):
                next_line = lines[j]
                next_stripped = next_line.strip()
                if not next_stripped:
                    # Keep empty lines but don't stop
                    j += 1
                    continue
                
                next_indent = len(next_line) - len(next_line.lstrip())
                if next_indent <= indent:
                    # It's at the same level or less. 
                    # If it looks like a property, indent it!
                    if ': ' in next_stripped or next_stripped.startswith('transition') or next_stripped.startswith('animation'):
                        # Modify the line in place for future check if needed
                        lines[j] = ' ' * (indent + 2) + next_stripped
                        j += 1
                    else:
                        # Probably another selector at same level
                        break
                else:
                    # Already indented more than current selector
                    # We can continue to check further lines or stop
                    # Usually we want to stop if we find another selector at same level
                    # but if it's already indented, it's fine.
                    j += 1
        
        i += 1

    with open(file_path, 'w') as f:
        f.write('\n'.join(new_lines) + '\n')

files = [
    "src/components/Tree.module.sass",
    "src/components/Toast.module.sass",
    "src/components/Tabs.module.sass",
    "src/components/Table.module.sass",
    "src/components/SoundPanel.module.sass",
    "src/components/Sheet.module.sass",
    "src/components/Separator.module.sass",
    "src/components/ProgressionMeter.module.sass",
    "src/components/Popover.module.sass",
    "src/components/Modal.module.sass",
    "src/components/Menu.module.sass",
    "src/components/ListBox.module.sass",
    "src/components/GridList.module.sass",
    "src/components/EditCharacterModal.module.sass",
    "src/components/DropZone.module.sass",
    "src/components/DisclosureGroup.module.sass",
    "src/components/Disclosure.module.sass",
    "src/components/Dialog.module.sass",
    "src/components/CommandPalette.module.sass",
    "src/components/CharacterGrid.module.sass",
    "src/components/CharacterCard.module.sass",
    "src/components/Calendar.module.sass",
    "src/components/Breadcrumbs.module.sass",
    "src/components/Menu/Menu.module.sass",
    "src/components/Shop/Shop.module.sass",
    "src/components/BottomNav/BottomNav.module.sass",
    "src/components/Admin/Admin.module.sass",
    "src/components-ui/Form.module.sass",
    "src/components-ui/CheckboxGroup.module.sass",
    "src/components-ui/Checkbox.module.sass",
    "src/components-ui/TagGroup.module.sass",
    "src/components-ui/Button.module.sass",
    "src/components-ui/TextField.module.sass",
    "src/components-ui/ProgressBar.module.sass",
    "src/components-ui/SearchField.module.sass",
    "src/components-ui/Tooltip.module.sass",
    "src/components-ui/Toolbar.module.sass",
    "src/components-ui/ToggleButtonGroup.module.sass",
    "src/components-ui/ToggleButton.module.sass",
    "src/components-ui/TimeField.module.sass",
    "src/components-ui/Switch.module.sass",
    "src/components-ui/Slider.module.sass",
    "src/components-ui/Select.module.sass",
    "src/components-ui/SegmentedControl.module.sass",
    "src/components-ui/RangeCalendar.module.sass",
    "src/components-ui/RadioGroup.module.sass",
    "src/components-ui/NumberField.module.sass",
    "src/components-ui/Meter.module.sass",
    "src/components-ui/Link.module.sass",
    "src/components-ui/InputGroup.module.sass",
    "src/components-ui/DateRangePicker.module.sass",
    "src/components-ui/DatePicker.module.sass",
    "src/components-ui/DateField.module.sass",
    "src/components-ui/Content.module.sass",
    "src/components-ui/ComboBox.module.sass",
    "src/components-ui/ColorWheel.module.sass",
    "src/components-ui/ColorThumb.module.sass",
    "src/components-ui/ColorSwatchPicker.module.sass",
    "src/components-ui/ColorSwatch.module.sass",
    "src/components-ui/ColorSlider.module.sass",
    "src/components-ui/ColorPicker.module.sass",
    "src/components-ui/ColorField.module.sass",
    "src/components-ui/ColorArea.module.sass"
]

for file_path in files:
    if os.path.exists(file_path):
        fix_sass_indentation(file_path)
