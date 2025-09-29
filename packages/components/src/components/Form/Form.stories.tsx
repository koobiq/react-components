import { type FormEvent, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Alert } from '../Alert';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Input } from '../Input';
import { spacing } from '../layout';
import { Textarea } from '../Textarea';
import { Typography } from '../Typography';

import { Form, type FormProps } from './index';

const meta = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  tags: ['status:new'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<FormProps>;

export const Base: Story = {
  render: function Render() {
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
        style={{ width: 280 }}
        onSubmit={handleSubmit}
        labelPlacement={{ xs: 'top', m: 'side' }}
      >
        {error && (
          <Alert
            status="error"
            className={spacing({ mbe: 'xl' })}
            isCompact
            isColored
          >
            {error}
          </Alert>
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
        <div data-slot="form-field">
          <Button type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </div>
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

export const Fieldset: Story = {
  render: function Render() {
    return (
      <Form style={{ width: 240 }}>
        <Form.Fieldset>
          <Form.Legend>Shipping details</Form.Legend>
          <Input
            name="street adress"
            label="Street adress"
            fullWidth
            isRequired
          />
          <Textarea label="Delivery notes" name="delivery notes" fullWidth />
        </Form.Fieldset>
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};
