import { Toolbar as RACToolbar, SeparatorContext, ToggleButtonGroupContext } from 'react-aria-components';
import type { ToolbarProps } from 'react-aria-components';
import styles from './Toolbar.module.sass';

export function Toolbar(props: ToolbarProps) {
  const {orientation = 'horizontal'} = props;
  return (
    <ToggleButtonGroupContext.Provider value={{orientation}}>
      <SeparatorContext.Provider value={{orientation: orientation === 'horizontal' ? 'vertical' : 'horizontal'}}>
        <RACToolbar {...props} />
      </SeparatorContext.Provider>
    </ToggleButtonGroupContext.Provider>
  );
}
