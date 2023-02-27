// Button.stories.js|jsx

import React from 'react';
import { ComponentStory } from '@storybook/react';
import EverythingDecorator from '../../../../.storybook/decorators/EverythingDecorator';
import { DARWIN_MOCK_TOURNAMENT } from '../../../../.storybook/mocks';

import {
  TournamentHomeView,
  TournamentHomeViewProps,
} from './TournamentHomeView';

export default {
  component: TournamentHomeView,
  decorators: [EverythingDecorator],
};
//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof TournamentHomeView> = (
  args: TournamentHomeViewProps
) => <TournamentHomeView {...args} />;

//👇 Each story then reuses that template
export const Live = Template.bind({});
Live.args = {
  tournament: DARWIN_MOCK_TOURNAMENT,
};
