import { type FormEvent, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Input } from '../Input';
import { Typography } from '../Typography';

import { Form, type FormProps } from './index';

const meta = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<FormProps>;

// Fake server used in this example.
function callServer() {
  return {
    errors: {
      username: 'Sorry, this username is taken.',
    },
  };
}

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
        <FlexBox direction="column" gap="m">
          <Input
            errorMessage="Please enter a valid username"
            label="Username"
            name="username"
            placeholder="Enter your username"
            type="text"
            isRequired
            fullWidth
          />

          <Input
            errorMessage="Please enter a valid email"
            label="Email"
            name="email"
            placeholder="Enter your email"
            type="email"
            isRequired
            fullWidth
          />
          <FlexBox gap="m">
            <Button type="submit">Submit</Button>
            <Button type="reset">Reset</Button>
          </FlexBox>
          {action && (
            <Typography>
              Action: <code>{action}</code>
            </Typography>
          )}
        </FlexBox>
      </Form>
    );
  },
};

export const Validation: Story = {
  render: function Render() {
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
        validationErrors={errors}
        onSubmit={onSubmit}
        style={{ width: 240 }}
      >
        <FlexBox direction="column" gap="m">
          <Input
            label="Username"
            name="username"
            placeholder="Enter your username"
            fullWidth
          />
          <Button type="submit">Submit</Button>
        </FlexBox>
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
        validationBehavior="aria"
        onSubmit={onSubmit}
        style={{ width: 240 }}
      >
        <FlexBox direction="column" gap="m">
          <Input
            isRequired
            label="Username"
            name="username"
            placeholder="Enter your username"
            type="text"
            validate={(value) => {
              if (value.length < 3) {
                return 'Username must be at least 3 characters long';
              }

              return value === 'admin' ? 'Nice try!' : null;
            }}
          />
          <Button type="submit">Submit</Button>
        </FlexBox>
      </Form>
    );
  },
};
