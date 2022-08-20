import { Dataflow } from "./Dataflow";
const renderDataflowProps = {
  loading: 0,
  suspending: 0,
  count: 0,
  updateLoading: null as null | [string, number],
  updateSuspending: null as null | [string, number],
  updateCount: null as null | [string, number],
};
const renderDataflowProvides = {};
type RenderDataflowProps = typeof renderDataflowProps;
type RenderDataflowProvides = typeof renderDataflowProvides;
type ToplevelRenderDataflow<PROPS, PROVIDES> = Dataflow<
  RenderDataflowProps & PROPS,
  RenderDataflowProvides & PROVIDES,
  {},
  {}
>;
const topLevelhandle = <PROPS, PROVIDES>(
  self: ToplevelRenderDataflow<PROPS, PROVIDES>
) => {};

export const useRenderDataflow = <PROPS, PROVIDES>(
  props: PROPS,
  provides: PROVIDES
): ToplevelRenderDataflow<PROPS, PROVIDES> =>
  new Dataflow(
    { ...renderDataflowProps, ...props },
    { ...renderDataflowProvides, ...provides }
  );
