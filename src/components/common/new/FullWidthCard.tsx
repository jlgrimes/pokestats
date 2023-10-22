import { Card, Color, Flex, Icon, Subtitle, Title } from "@tremor/react";
import { ElementType, PropsWithChildren } from "react";

interface FullWidthCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  icon?: ElementType;
  iconColor?: Color;
}

export const FullWidthCard = (props: FullWidthCardProps) => (
  <Card className="px-1">
    <Flex>
      <div className='px-5'>
        <Title>{props.title}</Title>
        {props.subtitle && <Subtitle>{props.subtitle}</Subtitle>}
      </div>
      {props.icon && <Icon className='mr-4' variant="solid" icon={props.icon} color={props.iconColor} />}
    </Flex>
    {props.children}
  </Card>
)