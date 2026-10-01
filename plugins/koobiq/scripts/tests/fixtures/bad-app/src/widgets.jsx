import { Button } from '@koobiq/react-components';
import { Button as Deep } from '@koobiq/react-components/dist/components/Button'; // expect: import/deep

export const Save = ({ onSave }) => (
  <Button variant="fade-contrast-filled" progress onPress={onSave}> {/* expect: deprecated/prop */}
    Save
  </Button>
);

export const Other = () => <Deep />;
