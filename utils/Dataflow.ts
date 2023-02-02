export type EmitFunc<EMITS> = {
  <T extends keyof EMITS>(e: T, val: EMITS[T]): void;
};
export type InjectFunc<INJECTS> = {
  <T extends keyof INJECTS>(e: T): INJECTS[T];
};
export type Dataflowhandler<
  PROPS extends {},
  PROVIDES extends {},
  EMITS extends {},
  INJECTS extends {}
> = (flow: Dataflow<PROPS, PROVIDES, EMITS, INJECTS>) => void;

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
  public readonly emit: EmitFunc<EMITS> | undefined;
  /**
   * 上のフローからのInject
   */
  public readonly inject: InjectFunc<INJECTS> | undefined;
  /**
   * props,providesと、handler,emit,inject関数(optional)からインスタンスを初期化します。
   */
  constructor(
    props: PROPS,
    provides: PROVIDES,
    handler?: Dataflowhandler<PROPS, PROVIDES, EMITS, INJECTS>,
    emit?: EmitFunc<EMITS>,
    inject?: InjectFunc<INJECTS>
  ) {
    this.props = reactive(props) as PROPS;
    this.provides = reactive(provides) as PROVIDES;
    this.emit = emit;
    this.inject = inject;
    handler && handler(this);
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
  newChild<CHILD_PROPS extends {}, CHILD_PROVIDES extends {}>(
    props: CHILD_PROPS,
    provides: CHILD_PROVIDES,
    handler?: Dataflowhandler<
      CHILD_PROPS,
      CHILD_PROVIDES,
      PROPS,
      PROVIDES & INJECTS
    >,
    emit?: EmitFunc<PROPS>,
    inject?: InjectFunc<PROVIDES & INJECTS>
  ): Dataflow<CHILD_PROPS, CHILD_PROVIDES, PROPS, PROVIDES & INJECTS> {
    // @ts-ignore
    return new this.constructor(
      props,
      provides,
      handler,
      emit || this.getEmitfunc(),
      inject || this.getInjectfunc()
    );
  }
}
