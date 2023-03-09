// Button.stories.js|jsx

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import EverythingDecorator from '../../../../.storybook/decorators/EverythingDecorator';
import {
  SetupProfileController,
  SetupProfileControllerProps,
} from './SetupProfileController';

export default {
  component: SetupProfileController,
  decorators: [EverythingDecorator],
};
//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof SetupProfileController> = (
  args: SetupProfileControllerProps
) => <SetupProfileController {...args} />;

export const Loading = Template.bind({});
Loading.args = {
  userProfile: null,
};

//👇 Each story then reuses that template
export const FoundUser = Template.bind({});
FoundUser.args = {
  userProfile: {
    id: 'me',
    name: 'Jared Grimes',
    email: '',
    image: '',
  },
};

export const NotFoundUser = Template.bind({});
NotFoundUser.args = {
  userProfile: {
    id: 'me',
    name: 'Hingle McCringleberry',
    email: '',
    image: '',
  },
};
