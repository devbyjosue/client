export type user = {
  id?: number;
  name: string;
  voucher: string;
  roleId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type Role = {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TableData = {
  headers: string[];
  data: (string | number)[][];
};



