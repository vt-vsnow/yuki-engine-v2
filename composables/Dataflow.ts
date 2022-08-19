class Dataflow<
  PROPS extends { [key: string]: any },
  PROVIDES extends { [key: string]: any },
  EMITS extends {},
  INJECTS extends {}
> {
  public readonly props: PROPS;
  public readonly provides: PROVIDES;
  public readonly emit: {
    <T extends keyof EMITS>(e: T, val: EMITS[T]): void;
  };
  public readonly inject: { <T extends keyof INJECTS>(e: T): INJECTS[T] };
  constructor(
    props: PROPS,
    provides: PROVIDES,
    emit?: {
      <T extends keyof EMITS>(e: T, val: EMITS[T]): void;
    },
    inject?: { <T extends keyof INJECTS>(e: T): INJECTS[T] }
  ) {
    this.props = reactive(props);
    this.provides = reactive(provides);
    this.emit = emit;
    this.inject = inject;
  }
  public children: Dataflow<{}, {}, PROPS, INJECTS & PROVIDES>[] = [];
  public add<
    CHILD_PROPS extends { [key: string]: any },
    CHILD_PROVIDES extends { [key: string]: any }
  >(childProps: CHILD_PROPS, childProvides: CHILD_PROVIDES) {
    const newChild = new Dataflow<
      CHILD_PROPS,
      CHILD_PROVIDES,
      PROPS,
      INJECTS & PROVIDES
    >(
      childProps,
      childProvides,
      <PROP_NAME extends keyof PROPS>(e: PROP_NAME, val) => {
        this.props[e] = val;
      },
      ((e) => this.provides[e] || this.inject(e)) as ((
        e: keyof INJECTS
      ) => (INJECTS & PROVIDES)[keyof INJECTS] &
        (INJECTS & PROVIDES)[keyof PROVIDES]) &
        ((e: keyof PROVIDES) => (INJECTS & PROVIDES)[keyof PROVIDES])
    );
    this.children.push(newChild);
    return newChild;
  }
  remove(e) {
    this.children.splice(this.children.indexOf(e), 1);
  }
}
export const newDataflow = <
  PROPS extends { [key: string]: any },
  PROVIDES extends { [key: string]: any }
>(
  props?: PROPS,
  provides?: PROVIDES
) => new Dataflow(props, provides);
