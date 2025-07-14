import { useBoolean } from '@koobiq/react-core';
import type { StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Toggle } from '../Toggle';

import {
  SidePanel,
  sidePanelPropPosition,
  type SidePanelProps,
  sidePanelPropSize,
} from './index.js';

const meta = {
  title: 'Components/SidePanel',
  component: SidePanel,
  subcomponents: {
    'SidePanel.Header': SidePanel.Header,
    'SidePanel.Body': SidePanel.Body,
    'SidePanel.Footer': SidePanel.Footer,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: function Render(args: SidePanelProps) {
    return (
      <SidePanel
        size="small"
        control={(props) => <Button {...props}>Open</Button>}
        {...args}
      >
        {({ close }) => (
          <>
            <SidePanel.Header>
              Web Security: Safeguarding the Digital World
            </SidePanel.Header>
            <SidePanel.Body>
              <FlexBox gap="m" direction="column">
                <span>
                  Web security is a crucial aspect of modern digital
                  infrastructure, ensuring the protection of sensitive data,
                  user privacy, and system integrity. As cyber threats continue
                  to evolve, developers and organizations must adopt a proactive
                  approach to securing web applications against attacks.
                </span>
                <span>
                  One of the most common vulnerabilities is SQL injection, where
                  attackers manipulate database queries to gain unauthorized
                  access to sensitive information. Similarly, cross-site
                  scripting (XSS) allows malicious scripts to run on a victim’s
                  browser, leading to data theft or session hijacking. Another
                  prevalent threat is cross-site request forgery (CSRF), in
                  which users are tricked into executing unwanted actions on
                  authenticated sites. Additionally, man-in-the-middle attacks
                  intercept communication between users and servers,
                  compromising the confidentiality of data. Distributed
                  Denial-of-Service (DDoS) attacks can also cripple web services
                  by overwhelming them with excessive traffic.
                </span>
                <span>
                  To mitigate these risks, implementing strong security
                  practices is essential. Using HTTPS ensures encrypted
                  communication, protecting data from interception. Proper input
                  validation and escaping mechanisms help prevent code injection
                  attacks. Authentication and authorization mechanisms,
                  including multi-factor authentication (MFA) and role-based
                  access control (RBAC), add layers of security to user access.
                  Secure API development, including authentication, rate
                  limiting, and encryption, reduces vulnerabilities in web
                  services. Keeping software, frameworks, and dependencies up to
                  date minimizes the risk of exploiting known vulnerabilities.
                  Continuous monitoring, logging, and security audits help
                  detect and respond to threats before they cause significant
                  damage.
                </span>
                <span>
                  Web security is not a one-time implementation but an ongoing
                  process that evolves alongside emerging threats. By following
                  best practices and staying vigilant, businesses and developers
                  can build resilient, secure applications that protect users
                  and data in an increasingly connected world.
                </span>
              </FlexBox>
            </SidePanel.Body>
            <SidePanel.Footer>
              <Button onPress={close}>Ok</Button>
              <Button variant="fade-contrast-filled" onPress={close}>
                Cancel
              </Button>
            </SidePanel.Footer>
          </>
        )}
      </SidePanel>
    );
  },
};

export const Size: Story = {
  render: function Render(args: SidePanelProps) {
    return (
      <FlexBox gap="l">
        {sidePanelPropSize.map((size) => (
          <SidePanel
            key={size}
            size={size}
            control={(props) => <Button {...props}>size = {size}</Button>}
            {...args}
          >
            {({ close }) => (
              <>
                <SidePanel.Header>I have a {size} size</SidePanel.Header>
                <SidePanel.Body>But there&#39;s nothing to say…</SidePanel.Body>
                <SidePanel.Footer>
                  <Button onPress={close}>Ok</Button>
                </SidePanel.Footer>
              </>
            )}
          </SidePanel>
        ))}
      </FlexBox>
    );
  },
};

export const Position: Story = {
  render: function Render(args: SidePanelProps) {
    return (
      <FlexBox gap="l">
        {sidePanelPropPosition.map((position) => (
          <SidePanel
            key={position}
            position={position}
            control={(props) => (
              <Button {...props}>position = {position}</Button>
            )}
            {...args}
          >
            {({ close }) => (
              <>
                <SidePanel.Header>
                  I have a {position} position
                </SidePanel.Header>
                <SidePanel.Body>But there&#39;s nothing to say…</SidePanel.Body>
                <SidePanel.Footer>
                  <Button onPress={close}>Ok</Button>
                </SidePanel.Footer>
              </>
            )}
          </SidePanel>
        ))}
      </FlexBox>
    );
  },
};

export const ControlledOpen: Story = {
  name: 'Controlled open',
  render: function Render(args: SidePanelProps) {
    const [isOpen, { on, off, set }] = useBoolean(false);

    return (
      <>
        <Button onPress={on}>Open</Button>
        <SidePanel isOpen={isOpen} size="small" onOpenChange={set} {...args}>
          <SidePanel.Header>
            Web Security: Safeguarding the Digital World
          </SidePanel.Header>
          <SidePanel.Body>
            <FlexBox gap="m" direction="column">
              <span>
                Web security is a crucial aspect of modern digital
                infrastructure, ensuring the protection of sensitive data, user
                privacy, and system integrity. As cyber threats continue to
                evolve, developers and organizations must adopt a proactive
                approach to securing web applications against attacks.
              </span>
              <span>
                One of the most common vulnerabilities is SQL injection, where
                attackers manipulate database queries to gain unauthorized
                access to sensitive information. Similarly, cross-site scripting
                (XSS) allows malicious scripts to run on a victim’s browser,
                leading to data theft or session hijacking. Another prevalent
                threat is cross-site request forgery (CSRF), in which users are
                tricked into executing unwanted actions on authenticated sites.
                Additionally, man-in-the-middle attacks intercept communication
                between users and servers, compromising the confidentiality of
                data. Distributed Denial-of-Service (DDoS) attacks can also
                cripple web services by overwhelming them with excessive
                traffic.
              </span>
              <span>
                To mitigate these risks, implementing strong security practices
                is essential. Using HTTPS ensures encrypted communication,
                protecting data from interception. Proper input validation and
                escaping mechanisms help prevent code injection attacks.
                Authentication and authorization mechanisms, including
                multi-factor authentication (MFA) and role-based access control
                (RBAC), add layers of security to user access. Secure API
                development, including authentication, rate limiting, and
                encryption, reduces vulnerabilities in web services. Keeping
                software, frameworks, and dependencies up to date minimizes the
                risk of exploiting known vulnerabilities. Continuous monitoring,
                logging, and security audits help detect and respond to threats
                before they cause significant damage.
              </span>
              <span>
                Web security is not a one-time implementation but an ongoing
                process that evolves alongside emerging threats. By following
                best practices and staying vigilant, businesses and developers
                can build resilient, secure applications that protect users and
                data in an increasingly connected world.
              </span>
            </FlexBox>
          </SidePanel.Body>
          <SidePanel.Footer>
            <Button onPress={off}>Ok</Button>
            <Button variant="fade-contrast-filled" onPress={off}>
              Cancel
            </Button>
          </SidePanel.Footer>
        </SidePanel>
      </>
    );
  },
};

export const Settings: Story = {
  render: function Render() {
    const [hideBackdrop, setHideBackdrop] = useBoolean(false);
    const [hideCloseButton, setHideCloseButton] = useBoolean(false);

    const [disableExitOnClickOutside, setDisableExitOnClickOutside] =
      useBoolean(false);

    const [disableExitOnEscapeKeyDown, setDisableExitOnEscapeKeyDown] =
      useBoolean(false);

    return (
      <SidePanel
        size="small"
        control={(props) => <Button {...props}>Adjust me</Button>}
        hideBackdrop={hideBackdrop}
        disableExitOnClickOutside={disableExitOnClickOutside}
        disableExitOnEscapeKeyDown={disableExitOnEscapeKeyDown}
        hideCloseButton={hideCloseButton}
      >
        {({ close }) => (
          <>
            <SidePanel.Header>Adjust me</SidePanel.Header>
            <SidePanel.Body>
              <FlexBox gap="l" direction="column">
                <Toggle
                  isSelected={hideBackdrop}
                  onChange={setHideBackdrop.toggle}
                >
                  Hide the backdrop
                </Toggle>
                <Toggle
                  isSelected={hideCloseButton}
                  onChange={setHideCloseButton.toggle}
                >
                  Hide the close button
                </Toggle>
                <Toggle
                  isSelected={disableExitOnClickOutside}
                  onChange={setDisableExitOnClickOutside.toggle}
                >
                  Disable the exit by clicking from the outside
                </Toggle>
                <Toggle
                  isSelected={disableExitOnEscapeKeyDown}
                  onChange={setDisableExitOnEscapeKeyDown.toggle}
                >
                  Disable the exit by pressing ESC key
                </Toggle>
              </FlexBox>
            </SidePanel.Body>
            <SidePanel.Footer>
              <Button onPress={close}>Ok</Button>
            </SidePanel.Footer>
          </>
        )}
      </SidePanel>
    );
  },
};
