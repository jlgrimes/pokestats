import { Title } from "@tremor/react";
import { PropsWithChildren } from "react";

export const PageTitle = (props: PropsWithChildren) => (
  <h1 className="text-3xl font-bold leading-snug text-slate-700 text-center">{props.children}</h1>
)