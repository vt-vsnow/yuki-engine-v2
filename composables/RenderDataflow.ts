import { Dataflow } from "./Dataflow";
import { watchEffect, watch, toRef } from "vue";
const renderDataflowProps = {
  loading: 0,
  suspending: 0,
  count: 0,
  updateLoadings: null as null | [string, number],
  updateSuspendings: null as null | [string, number],
  updateCounts: null as null | [string, number],
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
  fn: (val, key) => number
) => {
  let sum = 0;
  for (const key in o) {
    sum += fn(o[key], key);
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
  // updateLoading
  watchEffect(
    () => {
      if (self.props.updateLoadings) {
        self.props.loadings[self.props.updateLoadings[0]] =
          self.props.updateLoadings[1];
        self.props.updateLoadings = null;
      }
    },
    { flush: "sync" }
  );

  // updateSuspending
  watchEffect(
    () => {
      if (self.props.updateSuspendings) {
        self.props.suspendings[self.props.updateSuspendings[0]] =
          self.props.updateSuspendings[1];
        self.props.updateSuspendings = null;
      }
    },
    { flush: "sync" }
  );

  // updateCount
  watchEffect(
    () => {
      if (self.props.updateCounts) {
        self.props.counts[self.props.updateCounts[0]] =
          self.props.updateCounts[1];
        self.props.updateCounts = null;
      }
    },
    { flush: "sync" }
  );

  // -1
  watch(toRef(self.props, "loading"), () => {
    if (self.props.loading === -1) {
      for (const key in self.props.loadings) {
        self.props.loadings[key] = -1;
      }
    }
  });
  watch(toRef(self.props, "suspending"), () => {
    if (self.props.suspending === -1) {
      for (const key in self.props.suspendings) {
        self.props.suspendings[key] = -1;
      }
    }
  });
  watch(toRef(self.props, "count"), () => {
    if (self.props.count === -1) {
      for (const key in self.props.counts) {
        self.props.counts[key] = -1;
      }
    }
  });

  // 集計
  watchEffect(() => {
    self.props.loading = objectReduce(self.props.loadings, (val, key) =>
      val === -1 ? self.props.counts[key] : val
    );
  });
  watchEffect(() => {
    self.props.suspending = objectReduce(self.props.suspendings, (val, key) =>
      val === -1 ? self.props.counts[key] : val
    );
  });
  watchEffect(() => {
    self.props.count = objectReduce(self.props.counts, (val) => val);
  });
};

export const useRenderDataflow = <PROPS, PROVIDES>(
  props: PROPS,
  provides: PROVIDES,
  parent?: RenderDataflow<
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
