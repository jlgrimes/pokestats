import { Title } from "@tremor/react";
import { PropsWithChildren } from "react";

export const PageTitle = (props: PropsWithChildren) => (
  <Title className="text-2xl">{props.children}</Title>
)