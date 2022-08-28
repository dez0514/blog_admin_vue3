import mitt, { Emitter } from 'mitt';

type Events = {
  pageScrollCallback: HTMLDivElement // 事件名与事件对应的参数类型，类型也可以是interface,type
};

export const emitter: Emitter<Events> = mitt<Events>();
