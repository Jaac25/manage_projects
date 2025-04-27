export interface IUser {
  id?: number;
  type: number;
  email: string;
  firstName: string;
  lastName: string;
}

export const USER_TYPES = {
  CLIENT: 1,
  MANAGER: 2,
  DESIGNER: 3,
};

export const USER_TYPES_BY_ID = {
  0: "Desconocido",
  1: "Cliente",
  2: "Manager",
  3: "Diseñador",
};
