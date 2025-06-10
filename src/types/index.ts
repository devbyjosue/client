export type user = {
  id?: number;
  name: string;
  voucher: string;
  roleName: string;
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

export type SalesOrder = {
  id?: number;
  revisionNumber: number;
  orderDate: string;
  dueDate: string;
  shipDate: string;
  status: string;
  salesOrderNumber: string;
  purchaseOrderNumber: string;
  accountNumber: string;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  comment: string;
  modifiedDate: string;
}

export type Menu = {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MenuRole = {
  id?: number;
  menuId: number;
  menu: Menu;
  roleId: number;
  role: Role;
  
}


