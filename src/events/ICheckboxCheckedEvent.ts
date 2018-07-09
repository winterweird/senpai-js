import { IWorkerEvent } from "./IWorkerEvent";

export interface ICheckboxCheckedEvent extends IWorkerEvent {
  type: "checkbox-checked";
  props: {
    id: string;
    checked: boolean;
  };
}
