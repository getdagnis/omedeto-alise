import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button, type ButtonProps } from './Button';
import './CloseButton.sass';

type CloseButtonProps = Omit<ButtonProps, 'children' | 'variant' | 'size' | 'shape'>;

export function CloseButton(props: CloseButtonProps) {
  return (
    <Button
      {...props}
      variant="quiet"
      size="sm"
      shape="square"
      className={['app-CloseButton', props.className].filter(Boolean).join(' ')}
    >
      <FontAwesomeIcon icon={faXmark} />
    </Button>
  );
}
