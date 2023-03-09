// Button.stories.js|jsx

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import EverythingDecorator from '../../../.storybook/decorators/EverythingDecorator';

import { addDays } from 'date-fns';
import { convertToDateString } from '../../lib/dates';
import { HomePage, HomePageProps } from './HomePage';
import {
  DARWIN_MOCK_TOURNAMENT,
  SYDNEY_MOCK_TOURNAMENT,
} from '../../../tests/mocks';

export default {
  component: HomePage,
  decorators: [EverythingDecorator],
};
//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof HomePage> = (args: HomePageProps) => (
  <HomePage {...args} />
);

//👇 Each story then reuses that template
export const Live = Template.bind({});
Live.args = {
  tournaments: [DARWIN_MOCK_TOURNAMENT, SYDNEY_MOCK_TOURNAMENT],
};
