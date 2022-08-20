type EmitFunc<EMITS> = { <T extends keyof EMITS>(e: T, val: EMITS[T]): void };
type InjectFunc<INJECTS> = { <T extends keyof INJECTS>(e: T): INJECTS[T] };
type DataflowHandle<PROPS, PROVIDES, EMITS, INJECTS> = (
  flow: Dataflow<PROPS, PROVIDES, EMITS, INJECTS>
) => void;

export class Dataflow<
  PROPS extends {},
  PROVIDES extends {},
  EMITS extends {},
  INJECTS extends {}
> {
  public readonly props: PROPS;
  public readonly provides: PROVIDES;
  public readonly emit: EmitFunc<EMITS>;
  public readonly inject: InjectFunc<INJECTS>;
  constructor(
    props: PROPS,
    provides: PROVIDES,
    handle?: DataflowHandle<PROPS, PROVIDES, EMITS, INJECTS>,
    emit?: EmitFunc<EMITS>,
    inject?: InjectFunc<INJECTS>
  ) {
    this.props = reactive(props) as PROPS;
    this.provides = reactive(provides) as PROVIDES;
    this.emit = emit;
    this.inject = inject;
    handle && handle(this);
  }
  getEmitfunc(): EmitFunc<PROPS> {
    return (e, val) => {
      this.props[e] = val;
    };
  }
  getInjectfunc(): InjectFunc<PROVIDES & INJECTS> {
    // @ts-ignore
    return (e) => this.provides[e] || this.inject(e);
  }
  addChild<CHILD_PROPS, CHILD_PROVIDES>(
    props: CHILD_PROPS,
    provides: CHILD_PROVIDES,
    handle?: DataflowHandle<
      CHILD_PROPS,
      CHILD_PROVIDES,
      PROPS,
      PROVIDES & INJECTS
    >,
    emit?: EmitFunc<PROPS>,
    inject?: InjectFunc<PROVIDES & INJECTS>
  ): Dataflow<CHILD_PROPS, CHILD_PROVIDES, PROPS, PROVIDES & INJECTS> {
    const ret = new Dataflow(
      props,
      provides,
      handle,
      emit || this.getEmitfunc(),
      inject || this.getInjectfunc()
    );
    return ret;
  }
}
