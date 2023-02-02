import { Dataflow } from "./Dataflow";
import { Camera, Object3D, Scene } from "three";

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
  object3d: new Scene() as Object3D,
});
type RenderDataflowProps = typeof renderDataflowProps;
type RenderDataflowProvides = ReturnType<typeof newRenderDataflowProvides>;
export type ToplevelRenderDataflow<PROPS, PROVIDES> = Dataflow<
  RenderDataflowProps & PROPS,
  RenderDataflowProvides & PROVIDES,
  any,
  any
>;

const objectReduce = (
  o: { [key: string | number]: number },
  fn: (val: number, key: string | number) => number
) => {
  let sum = 0;
  for (const key in o) {
    sum += fn(o[key] || 0, key);
  }
  return sum;
};
const renderDataflowhandler = <PROPS, PROVIDES>(
  self: Dataflow<
    RenderDataflowProps & PROPS,
    RenderDataflowProvides & PROVIDES,
    any,
    any
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
        val === -1 ? self.props.counts[key] || 0 : val
      );
    },
    { flush: "sync" }
  );
  watchEffect(
    () => {
      self.props.suspending = objectReduce(self.props.suspendings, (val, key) =>
        val === -1 ? self.props.counts[key] || 0 : val
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

class RenderDataflowLocal<
  PROPS extends {},
  PROVIDES extends {}
> extends Dataflow<
  RenderDataflowProps & PROPS,
  RenderDataflowProvides & PROVIDES,
  RenderDataflowProps & PROPS,
  RenderDataflowProvides & PROVIDES
> {
  constructor(
    props: PROPS,
    provides: PROVIDES,
    _handler?: any,
    emit?: any,
    inject?: any
  ) {
    super(
      { ...renderDataflowProps, ...props },
      // @ts-ignore
      provides,
      renderDataflowhandler,
      emit,
      inject
    );
  }
  // @ts-ignore
  override newChild<CHILD_PROPS, CHILD_PROVIDES extends {}>(
    props: CHILD_PROPS,
    provides: CHILD_PROVIDES
  ) {
    return super.newChild(
      { ...renderDataflowProps, ...props },
      provides,
      // @ts-ignore
      renderDataflowhandler
    );
  }
}

export const useRenderDataflow = <PROPS extends {}, PROVIDES>(
  props: PROPS,
  provides: PROVIDES
) => {
  return new RenderDataflowLocal(props, {
    ...newRenderDataflowProvides(),
    ...provides,
  });
};

export { RenderDataflowLocal as RenderDataflow };
