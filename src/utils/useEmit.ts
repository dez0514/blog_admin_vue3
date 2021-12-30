import mitt, { Emitter } from 'mitt';

type Events = {
//   foo: string;
//   bar?: number;
};

export const emitter: Emitter<Events> = mitt<Events>();
