import { Title } from "@tremor/react";
import { PropsWithChildren } from "react";

export const PageTitle = (props: PropsWithChildren) => (
  <h1 className="text-2xl font-bold leading-snug text-slate-700">{props.children}</h1>
)