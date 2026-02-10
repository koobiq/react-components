import { type FormEvent, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Alert } from '../Alert';
import { Autocomplete } from '../Autocomplete';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from '../CheckboxGroup';
import { DatePicker } from '../DatePicker';
import { FlexBox } from '../FlexBox';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { InputNumber } from '../InputNumber';
import { spacing } from '../layout';
import { Radio, RadioGroup } from '../RadioGroup';
import { SearchInput } from '../SearchInput';
import { Select } from '../Select';
import { Textarea } from '../Textarea';
import { TimePicker } from '../TimePicker';
import { Typography } from '../Typography';

import { Form, type FormProps } from './index';

const meta = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  subcomponents: {
    'Form.Group': Form.Group,
    'Form.Caption': Form.Caption,
    'Form.Actions': Form.Actions,
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<FormProps>;

export const Base: Story = {
  render: function Render(args) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fake server used in this example.
    const callServer = () =>
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              'Failed to sign in. Please check your login and password.'
            )
          );
        }, 400);
      });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        await callServer();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Form
        isDisabled={isLoading}
        style={{ width: 240 }}
        onSubmit={handleSubmit}
        labelPlacement={{ xs: 'top', m: 'side' }}
        {...args}
      >
        {error && (
          <Form.Caption>
            <Alert status="error" isCompact isColored>
              {error}
            </Alert>
          </Form.Caption>
        )}
        <Input
          type="text"
          name="login"
          label="Login"
          errorMessage="Login is required"
          slotProps={{ label: { isRequired: false } }}
          isRequired
          autoFocus
        />
        <Input
          name="password"
          type="password"
          label="Password"
          errorMessage="Password is required"
          slotProps={{ label: { isRequired: false } }}
          isRequired
        />
        <Form.Actions>
          <Button type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </Form.Actions>
      </Form>
    );
  },
};

export const Events: Story = {
  render: function Render() {
    const [action, setAction] = useState<string | null>(null);

    return (
      <Form
        style={{ width: 240 }}
        onReset={() => setAction('reset')}
        onSubmit={(e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.currentTarget));

          setAction(`submit ${JSON.stringify(data)}`);
        }}
      >
        <Input
          type="text"
          name="username"
          label="Username"
          errorMessage="Please enter a valid username"
          slotProps={{ label: { isRequired: false } }}
          isRequired
          fullWidth
        />
        <Input
          name="email"
          type="email"
          label="Email"
          errorMessage="Please enter a valid email"
          slotProps={{ label: { isRequired: false } }}
          isRequired
          fullWidth
        />
        <FlexBox gap="m" className={spacing({ mbe: 'm' })}>
          <Button type="submit">Submit</Button>
          <Button type="reset">Reset</Button>
        </FlexBox>
        {action && (
          <Typography>
            Action: <code>{action}</code>
          </Typography>
        )}
      </Form>
    );
  },
};

export const Validation: Story = {
  render: function Render() {
    // Fake server used in this example.
    function callServer() {
      return {
        errors: {
          username: 'Sorry, this username is taken.',
        },
      };
    }

    const [errors, setErrors] = useState({});

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.currentTarget));

      if (!data.username) {
        setErrors({ username: 'Username is required' });

        return;
      }

      const result = callServer();

      setErrors(result.errors);
    };

    return (
      <Form
        onSubmit={onSubmit}
        style={{ width: 240 }}
        validationErrors={errors}
      >
        <Input label="Username" name="username" fullWidth />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const ValidationBehavior: Story = {
  render: function Render() {
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };

    return (
      <Form
        onSubmit={onSubmit}
        style={{ width: 240 }}
        validationBehavior="aria"
      >
        <Input
          type="text"
          name="username"
          label="Username"
          slotProps={{ label: { isRequired: false } }}
          validate={(value) => {
            if (value.length < 3) {
              return 'Username must be at least 3 characters long';
            }

            return value === 'admin' ? 'Nice try!' : null;
          }}
          isRequired
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const LabelPlacementAlignment: Story = {
  name: 'Label placement and alignment',
  render: () => (
    <Form labelPlacement="side" style={{ width: 240 }}>
      <Input
        type="text"
        name="username"
        label="Username"
        errorMessage="Please enter a valid username"
        slotProps={{ label: { isRequired: false } }}
        fullWidth
        isRequired
      />
      <Input
        name="email"
        type="email"
        label="Email"
        errorMessage="Please enter a valid email"
        slotProps={{ label: { isRequired: false } }}
        fullWidth
        isRequired
      />
    </Form>
  ),
};

export const LabelInlineSize: Story = {
  name: 'Label inline size',
  render: () => (
    <Form labelInlineSize="1/2" labelPlacement="side" style={{ width: 240 }}>
      <Input
        type="text"
        name="username"
        label="Username"
        errorMessage="Please enter a valid username"
        slotProps={{ label: { isRequired: false } }}
        fullWidth
        isRequired
      />
      <Input
        name="email"
        type="email"
        label="Email"
        errorMessage="Please enter a valid email"
        slotProps={{ label: { isRequired: false } }}
        fullWidth
        isRequired
      />
    </Form>
  ),
};

export const ReadOnly: Story = {
  render: function Render() {
    return (
      <Form isReadOnly style={{ width: 240 }}>
        <Input
          type="text"
          name="username"
          label="Username"
          errorMessage="Please enter a valid username"
          slotProps={{ label: { isRequired: false } }}
          fullWidth
          isRequired
        />
        <Input
          name="email"
          type="email"
          label="Email"
          errorMessage="Please enter a valid email"
          slotProps={{ label: { isRequired: false } }}
          fullWidth
          isRequired
        />
      </Form>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <Form isDisabled style={{ width: 240 }}>
        <Input
          type="text"
          name="username"
          label="Username"
          errorMessage="Please enter a valid username"
          slotProps={{ label: { isRequired: false } }}
          fullWidth
          isRequired
        />
        <Input
          name="email"
          type="email"
          label="Email"
          errorMessage="Please enter a valid email"
          slotProps={{ label: { isRequired: false } }}
          fullWidth
          isRequired
        />
      </Form>
    );
  },
};

export const ResponsiveValues: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    return (
      <Form labelPlacement={{ xs: 'top', l: 'side' }} style={{ maxWidth: 360 }}>
        <Input
          type="text"
          name="username"
          label="Username"
          errorMessage="Please enter a valid username"
          slotProps={{ label: { isRequired: false } }}
          fullWidth
          isRequired
        />
        <Input
          name="email"
          type="email"
          label="Email"
          errorMessage="Please enter a valid email"
          slotProps={{ label: { isRequired: false } }}
          fullWidth
          isRequired
        />
      </Form>
    );
  },
};

export const Subcomponents: Story = {
  render: function Render() {
    return (
      <div style={{ maxWidth: 400 }}>
        <Typography variant="title" as="h1">
          My form
        </Typography>
        <Form className={spacing({ mbs: 'l' })}>
          <Form.Caption>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Distinctio, odio?
            </Typography>
          </Form.Caption>
          <Input
            type="text"
            name="name"
            label="Name"
            errorMessage="Please enter a valid username"
            fullWidth
            isRequired
          />
          <Input
            name="email"
            type="email"
            label="Email"
            errorMessage="Please enter a valid email"
            fullWidth
            isRequired
          />
          <Form.Group>
            <Typography variant="text-normal-strong">
              Shipping details:
            </Typography>
            <Input
              name="street adress"
              label="Street adress"
              fullWidth
              isRequired
            />
            <Textarea label="Delivery notes" name="delivery notes" fullWidth />
          </Form.Group>
          <Form.Actions>
            <Button type="submit">Submit</Button>
          </Form.Actions>
        </Form>
      </div>
    );
  },
};

export const FormFields: Story = {
  parameters: {
    layout: 'padded',
  },
  name: 'All form fields',
  render: function Render() {
    return (
      <Form
        labelPlacement={{ xs: 'top', m: 'side' }}
        labelInlineSize="2/5"
        style={{ maxWidth: 400 }}
      >
        <Select label="Select" placeholder="Select an option">
          <Select.Item key="1">Option 1</Select.Item>
          <Select.Item key="2">Option 2</Select.Item>
          <Select.Item key="3">Option 3</Select.Item>
        </Select>
        <Input label="Input" placeholder="Type a word..." />
        <Textarea label="Textarea" placeholder="Type a word..." />
        <InputNumber label="InputNumber" placeholder="Type a number..." />
        <SearchInput label="SearchInput" placeholder="Type a word..." />
        <TimePicker label="TimePicker" />
        <DatePicker label="DatePicker" />
        <RadioGroup label="RadioGroup" defaultValue="windows">
          <Radio value="windows">Windows</Radio>
          <Radio value="macos">macOS</Radio>
          <Radio value="linux">Linux</Radio>
          <Radio value="other">Other</Radio>
        </RadioGroup>
        <Autocomplete
          label="Autocomplete"
          placeholder="Select a protocol"
          disableShowChevron
        >
          <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
          <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
          <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
          <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
          <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
        </Autocomplete>
        <CheckboxGroup label="CheckboxGroup" defaultValue={['one']}>
          <Checkbox value="one">One</Checkbox>
          <Checkbox value="two">Two</Checkbox>
          <Checkbox value="three">Three</Checkbox>
        </CheckboxGroup>
        <FormField>
          <FormField.Label as="span">Inputs</FormField.Label>
          <FlexBox gap="m" style={{ inlineSize: '100%' }}>
            <Input aria-label="first" placeholder="Input 1" />
            <Input aria-label="second" placeholder="Input 2" />
          </FlexBox>
        </FormField>
      </Form>
    );
  },
};
