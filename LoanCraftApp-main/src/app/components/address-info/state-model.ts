export interface StateApiResponse {
    status: string;
    message: string;
    data: StateModel[];
    pagesize: number;
    timeStamp: string;
  }
  
export class StateModel {
    stateId!: number;
    stateCode!: string;
    state!: string;
    prefixMin!: number;
    prefixMax!: number;
}
