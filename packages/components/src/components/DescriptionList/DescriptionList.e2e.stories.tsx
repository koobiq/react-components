import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { DescriptionList, descriptionListPropOrientation } from './index.js';

const meta = {
  title: 'E2E/DescriptionList',
  component: DescriptionList,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof DescriptionList>;

export default meta;

type Story = StoryObj<typeof DescriptionList>;

export const Orientation: Story = {
  render: () => (
    <E2eGrid columns={1}>
      {descriptionListPropOrientation.map((orientation) => (
        <DescriptionList
          key={orientation}
          orientation={orientation}
          style={{ inlineSize: 480 }}
        >
          <DescriptionList.Group id="type">
            <DescriptionList.Term>Incident type</DescriptionList.Term>
            <DescriptionList.Description>Malware</DescriptionList.Description>
          </DescriptionList.Group>
          <DescriptionList.Group id="identifier">
            <DescriptionList.Term>Identifier</DescriptionList.Term>
            <DescriptionList.Description>
              INC-2022-125-78253
            </DescriptionList.Description>
          </DescriptionList.Group>
          <DescriptionList.Group id="description">
            <DescriptionList.Term>Description</DescriptionList.Term>
            <DescriptionList.Description>
              An employee opened an attachment in a phishing email.
            </DescriptionList.Description>
          </DescriptionList.Group>
        </DescriptionList>
      ))}
    </E2eGrid>
  ),
};
