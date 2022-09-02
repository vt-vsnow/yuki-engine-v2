import { Dataflow } from "./Dataflow";
import type { EmitFunc, InjectFunc, DataflowHandle } from "./Dataflow";
import type { Camera } from "three";

const renderDataflowProps = {
  loading: 0,
  suspending: 0,
  count: 0,
  renderRequired: false,
  loadings: {} as { [key: string]: number },
  suspendings: {} as { [key: string]: number },
  counts: {} as { [key: string]: number },
  renderRequireds: {} as { [key: string]: boolean },
  updateLoadings: null as null | [string, number],
  updateSuspendings: null as null | [string, number],
  updateCounts: null as null | [string, number],
  updateRenderRequired: null as null | [string, boolean],
  addCallback: null as null | [string, number],
  removeCallback: null as null | string,
};
const newRenderDataflowProvides = () => ({
  renderer: useWebGLRenderer(),
  camera: useDefaultCamera() as Camera,
  element: document.body,
});
type RenderDataflowProps = typeof renderDataflowProps;
type RenderDataflowProvides = ReturnType<typeof newRenderDataflowProvides>;
export type ToplevelRenderDataflow<PROPS, PROVIDES> = Dataflow<
  RenderDataflowProps & PROPS,
  RenderDataflowProvides & PROVIDES,
  {},
  {}
>;
export type RenderDataflow<PROPS, PROVIDES, EMITS, INJECTS> = Dataflow<
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

  // addCallback
  watchEffect(
    () => {
      if (self.props.addCallback) {
        const key = self.props.addCallback[0];
        self.props.loadings[key] = -1;
        self.props.suspendings[key] = 0;
        self.props.counts[key] = self.props.addCallback[1];
        self.props.renderRequireds[key] = false;
        self.props.addCallback = null;
      }
    },
    { flush: "sync" }
  );
  // removeCallback
  watchEffect(
    () => {
      if (self.props.removeCallback) {
        const key = self.props.removeCallback;
        delete self.props.loadings[key];
        delete self.props.suspendings[key];
        delete self.props.counts[key];
        delete self.props.renderRequireds[key];
        self.props.removeCallback = null;
      }
    },
    { flush: "sync" }
  );

  // updateRenderRequired
  watchEffect(
    () => {
      if (self.props.updateRenderRequired) {
        self.props.renderRequireds[self.props.updateRenderRequired[0]] =
          self.props.updateRenderRequired[1];
        self.props.updateRenderRequired = null;
      }
    },
    { flush: "sync" }
  );

  // -1
  watch(
    toRef(self.props, "loading"),
    () => {
      if (self.props.loading === -1) {
        for (const key in self.props.loadings) {
          self.props.loadings[key] = -1;
        }
      }
    },
    { flush: "sync" }
  );
  watch(
    toRef(self.props, "suspending"),
    () => {
      if (self.props.suspending === -1) {
        for (const key in self.props.suspendings) {
          self.props.suspendings[key] = -1;
        }
      }
    },
    { flush: "sync" }
  );
  watch(
    toRef(self.props, "count"),
    () => {
      if (self.props.count === -1) {
        for (const key in self.props.counts) {
          self.props.counts[key] = -1;
        }
      }
    },
    { flush: "sync" }
  );
  watch(
    toRef(self.props, "renderRequired"),
    () => {
      if (self.props.renderRequired) {
        for (const key in self.props.renderRequireds) {
          self.props.renderRequireds[key] = true;
        }
      }
    },
    { flush: "sync" }
  );

  // 集計
  watchEffect(
    () => {
      self.props.loading = objectReduce(self.props.loadings, (val, key) =>
        val === -1 ? self.props.counts[key] : val
      );
    },
    { flush: "sync" }
  );
  watchEffect(
    () => {
      self.props.suspending = objectReduce(self.props.suspendings, (val, key) =>
        val === -1 ? self.props.counts[key] : val
      );
    },
    { flush: "sync" }
  );
  watchEffect(
    () => {
      self.props.count = objectReduce(self.props.counts, (val) => val);
    },
    { flush: "sync" }
  );
  watchEffect(
    () => {
      self.props.renderRequired = Object.values(
        self.props.renderRequireds
      ).some((val) => val);
    },
    { flush: "sync" }
  );
};

export const useRenderDataflow = <PROPS, PROVIDES>(
  props: PROPS,
  provides: PROVIDES
) => {
  type COMBINED_PROPS = RenderDataflowProps & PROPS;
  type COMBINED_PROVIDES = RenderDataflowProvides & PROVIDES;
  type COMBINED_EMITS = {};
  type COMBINED_INJECTS = {};
  const ret = new Dataflow<
    COMBINED_PROPS,
    COMBINED_PROVIDES,
    COMBINED_EMITS,
    COMBINED_INJECTS
  >(
    { ...props, ...renderDataflowProps },
    { ...provides, ...newRenderDataflowProvides() },
    handle
  );
  ret.newChild = <CHILD_PROPS, CHILD_PROVIDES>(
    props: CHILD_PROPS,
    provides: CHILD_PROVIDES,
    handle?: DataflowHandle<
      CHILD_PROPS,
      CHILD_PROVIDES,
      COMBINED_PROPS,
      COMBINED_PROVIDES & COMBINED_INJECTS
    >,
    emit?: EmitFunc<COMBINED_PROPS>,
    inject?: InjectFunc<COMBINED_PROVIDES>
  ) => {
    return Dataflow.prototype.newChild.call(
      ret,
      props,
      provides,
      handle,
      emit,
      inject
    );
  };
  return ret;
};
