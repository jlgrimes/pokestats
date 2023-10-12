import { Card, Subtitle, Title } from "@tremor/react";
import { PropsWithChildren } from "react";

interface FullWidthCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
}

export const FullWidthCard = (props: FullWidthCardProps) => (
  <Card className="px-1">
    <div className='mb-4 px-5'>
      <Title>{props.title}</Title>
      {props.subtitle && <Subtitle>{props.subtitle}</Subtitle>}
    </div>
    {props.children}
  </Card>
)