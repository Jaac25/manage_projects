import { IUser } from "./user";

export interface IProject {
  id?: number;
  title: string;
  description: string;
  files: File[] | { id: number; name: string; url: string }[];
  designer: { idDesignPerProject: string } & IUser;
  deleted: boolean;
}
