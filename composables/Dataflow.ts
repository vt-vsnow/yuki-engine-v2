export type EmitFunc<EMITS> = {
  <T extends keyof EMITS>(e: T, val: EMITS[T]): void;
};
export type InjectFunc<INJECTS> = {
  <T extends keyof INJECTS>(e: T): INJECTS[T];
};
export type DataflowHandle<PROPS, PROVIDES, EMITS, INJECTS> = (
  flow: Dataflow<PROPS, PROVIDES, EMITS, INJECTS>
) => void;

/**
 * 上下方向へのデータのフローを提供します。
 */
export class Dataflow<
  PROPS extends {},
  PROVIDES extends {},
  EMITS extends {},
  INJECTS extends {}
> {
  /**
   * このフローが保持するProps
   */
  public readonly props: PROPS;
  /**
   * このフローが保持するProvides
   */
  public readonly provides: PROVIDES;
  /**
   * 上のフローへのEmit
   */
  public readonly emit: EmitFunc<EMITS>;
  /**
   * 上のフローからのInject
   */
  public readonly inject: InjectFunc<INJECTS>;
  /**
   * props,providesと、handle,emit,inject関数(optional)からインスタンスを初期化します。
   */
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
  /**
   * このインスタンスのpropsを変更するemit関数を返します。
   */
  getEmitfunc(): EmitFunc<PROPS> {
    return (e, val) => {
      this.props[e] = val;
    };
  }
  /**
   * このインスタンスおよびその上のフローからのprovideをinjectする関数を返します。
   */
  getInjectfunc(): InjectFunc<PROVIDES & INJECTS> {
    // @ts-ignore
    return (e) => this.provides[e] || this.inject(e);
  }
  /**
   * 新しい子フローを作成して返します。
   */
  newChild<CHILD_PROPS, CHILD_PROVIDES>(
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
    return new Dataflow(
      props,
      provides,
      handle,
      emit || this.getEmitfunc(),
      inject || this.getInjectfunc()
    );
  }
}
