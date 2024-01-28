import { Card, CardProps } from "@tremor/react";

export const HomePageCard = (props: CardProps) => <Card className='flex flex-col gap-3 px-6 py-4' {...props}>{props.children}</Card>;