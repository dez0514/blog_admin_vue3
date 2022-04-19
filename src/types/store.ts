export interface State {
  comments: number;
  typeId: string;
  showName: boolean;
  count: number;
  user: {
    name: string;
    pwd: string;
  }
}