//'set-texture' | 'move' | 'batch' | 'create-character'

/**
 * events?: Array<IWorkerEvent>,
    id?: string;
    name?: string;
    position?: number[];
    alpha?: number;
    z?: number;
    ease?: string;
    parent?: string;
    timespan?: number;
    texture?: string;
    font?: string;
    fontColor?: string;
    fontSize?: number;
    checked?: boolean;
    text?: string;
 */
export interface IWorkerEvent {
  type: string;
  props: { };
};
