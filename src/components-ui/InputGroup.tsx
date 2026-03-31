import { Group, InputContext } from 'react-aria-components';
import { composeRenderProps, type GroupProps } from 'react-aria-components';
import { Label } from './Form';
import { useId } from 'react';
import styles from './InputGroup.module.sass';

interface InputGroupProps extends GroupProps {
  label?: string;
}

export function InputGroup(props: InputGroupProps) {
  const id = useId();
  return (
    <div className={`input-group`}>
      {props.label && (
        <Label elementType="span" id={id}>
          {props.label}
        </Label>
      )}
      <Group {...props} aria-labelledby={id} className={`${styles['react-aria-Group']} inset`}>
        {composeRenderProps(props.children, (children, renderProps) => (
          <InputContext.Provider value={{ disabled: renderProps.isDisabled }}>{children}</InputContext.Provider>
        ))}
      </Group>
    </div>
  );
}
