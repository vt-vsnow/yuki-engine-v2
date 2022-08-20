import { Dataflow } from "./Dataflow";
const renderDataflowProps = {
  loading: 0,
  suspending: 0,
  count: 0,
  loadings: {} as { [key: string]: number },
  suspendings: {} as { [key: string]: number },
  counts: {} as { [key: string]: number },
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
type RenderDataflow<PROPS, PROVIDES, EMITS, INJECTS> = Dataflow<
  RenderDataflowProps & PROPS,
  RenderDataflowProvides & PROVIDES,
  EMITS,
  INJECTS
>;
const objectReduce = (
  o: { [key: string]: number },
  fn: (sum, val, key) => number
) => {
  let sum = 0;
  for (const key in o) {
    sum = fn(sum, o[key], key);
  }
  return sum;
};
const handle = <PROPS, PROVIDES>(
  self:
    | ToplevelRenderDataflow<PROPS, PROVIDES>
    | Dataflow<
        RenderDataflowProps & PROPS,
        RenderDataflowProvides & PROVIDES,
        RenderDataflowProps & PROPS,
        RenderDataflowProvides & PROVIDES
      >
) => {
  const { loading, suspending, count, loadings, suspendings, counts } = toRefs(
    self.props
  );
  // loading
  watch(loadings, (val, old) => {
    // ループしてしまうんだが。
    loadings.value = old;
    for (const key in val) {
      //
    }
  });
  watchEffect(() => {
    if (loading === -1) {
      for (const key in loadings.value) {
        loadings[key] = -1;
      }
    }
  });

  // 集計
  watchEffect(() => {
    loading.value = objectReduce(
      loadings.value,
      (sum, val, key) => sum + (val === -1 ? counts[key] : val)
    );
  });
};

export const useRenderDataflow = <PROPS, PROVIDES>(
  props: PROPS,
  provides: PROVIDES,
  parent: RenderDataflow<
    PROPS,
    PROVIDES,
    RenderDataflowProps,
    RenderDataflowProvides
  >
) => {
  if (parent) {
    return parent.addChild(
      { ...renderDataflowProps, ...props },
      { ...renderDataflowProvides, ...provides },
      handle
    );
  } else {
    return new Dataflow(
      { ...renderDataflowProps, ...props },
      { ...renderDataflowProvides, ...provides },
      handle
    );
  }
};
