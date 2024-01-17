import { IconMapPin } from "@tabler/icons-react";
import { Icon, Text } from "@tremor/react";

interface LocationWithIconProps {
  children: JSX.Element;
}

export const LocationWithIcon = (props: LocationWithIconProps) => (
  <div className="flex items-center">
    <Icon className="pl-0" icon={IconMapPin} size='sm' variant='simple' color='neutral' />
    {props.children}
  </div>
)