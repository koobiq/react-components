import { type FormEvent, useState } from 'react';

import {
  Button,
  FlexBox,
  Form,
  Input,
  spacing,
  Typography,
} from '@koobiq/react-components';
import type { StoryObj } from '@storybook/react';

const meta = {
  title: 'Forms',
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<object>;

const formStyle = {
  inlineSize: 240,
};

export const LabelsHelperText: Story = {
  render: function Render() {
    return (
      <Input
        type="password"
        label="Password"
        caption="Password must be at least 8 characters."
        minLength={8}
      />
    );
  },
};

export const UncontrolledForms: Story = {
  render: function Render() {
    const [submitted, setSubmitted] = useState<{
      [p: string]: globalThis.FormDataEntryValue;
    }>();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      // Prevent default browser page refresh.
      e.preventDefault();

      // Get form data as an object.
      const data = Object.fromEntries(new FormData(e.currentTarget));

      // Submit to your backend API...
      setSubmitted(data);
    };

    return (
      <Form onSubmit={onSubmit} style={formStyle}>
        <Input name="name" label="Name" />
        <FlexBox gap="m" className={spacing({ mbe: 'm' })}>
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="fade-contrast-filled">
            Reset
          </Button>
        </FlexBox>
        {submitted && (
          <Typography>You submitted: {JSON.stringify(submitted)}</Typography>
        )}
      </Form>
    );
  },
};

export const ControlledForms: Story = {
  render: function Render() {
    const [name, setName] = useState('');

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Submit data to your backend API...
      alert(name);
    };

    return (
      <Form onSubmit={onSubmit} style={formStyle}>
        <Input label="Name" value={name} onChange={setName} />
        <FlexBox gap="m" className={spacing({ mbe: 'm' })}>
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="fade-contrast-filled">
            Reset
          </Button>
        </FlexBox>
        <Typography>You entered: {name}</Typography>
      </Form>
    );
  },
};

export const BuiltInValidation: Story = {
  render: function Render() {
    return (
      <Form validationBehavior="native" style={formStyle}>
        <Input label="Email" name="email" type="email" isRequired />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const ErrorMessages: Story = {
  render: function Render() {
    return (
      <Form validationBehavior="native" style={formStyle}>
        <Input
          label="Name"
          name="name"
          isRequired
          errorMessage={({ validationDetails }) =>
            validationDetails.valueMissing ? 'Please enter a name.' : ''
          }
        />

        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const CustomValidation: Story = {
  render: function Render() {
    return (
      <Form validationBehavior="native" style={formStyle}>
        <Input
          label="Username"
          validate={(value) => (value === 'admin' ? 'Nice try!' : null)}
        />

        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const RealtimeValidation: Story = {
  render: function Render() {
    const [password, setPassword] = useState('');
    let error: string | undefined;

    if (password.length < 8) {
      error =
        password !== '' ? 'Password must be 8 characters or more.' : undefined;
    } else if ((password.match(/[A-Z]/g) ?? []).length < 2) {
      error = 'Password must include at least 2 upper case letters';
    } else if ((password.match(/[^a-z]/gi) ?? []).length < 2) {
      error = 'Password must include at least 2 symbols.';
    }

    return (
      <Input
        label="Password"
        isInvalid={!!error}
        errorMessage={error}
        value={password}
        onChange={setPassword}
        style={{ inlineSize: 240 }}
      />
    );
  },
};

export const ServerValidation: Story = {
  render: function Render() {
    // Fake server used in this example.
    function callServer<T>(data: { [k: string]: T }) {
      console.log(data);

      return {
        errors: {
          username: 'Sorry, this username is taken.',
        },
      };
    }

    const [errors, setErrors] = useState({});

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.currentTarget));
      const result = await callServer(data);
      setErrors(result.errors);
    };

    return (
      <Form
        validationBehavior="native"
        onSubmit={onSubmit}
        validationErrors={errors}
        style={formStyle}
      >
        <Input label="Username" name="username" isRequired />
        <Input label="Password" name="password" type="password" isRequired />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};
