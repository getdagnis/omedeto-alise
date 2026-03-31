import type { Preview } from '@storybook/react-vite';
import '../src/styles/ui-theme/theme.css';
import '../src/styles/ui-theme/utilities.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
