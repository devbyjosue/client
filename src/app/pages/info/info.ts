import { Component, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Menu, MenuRole, Role, TableData, user } from '../../../types';
import { rolesHeaders, sections, subSections, usersHeaders } from '../../../mocks';
import { TableForm } from "../../components/table-form/table-form";
import { DxDataGridModule, DxButtonModule, DxColorBoxComponent } from 'devextreme-angular';
import { capitalize } from '../../../utils/capitalize';
import { DxoBackgroundColorComponent } from 'devextreme-angular/ui/nested';


@Component({
  selector: 'app-info',
  imports: [CommonModule, HttpClientModule, DxDataGridModule, DxButtonModule],
  templateUrl: './info.html',
  styleUrl: './info.css'
})
export class Info implements OnInit {

  
  private mockUsers: user[] = [
    { id: 1, name: 'Alice Wonderland', voucher: 'VOUCHER001', roleName: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Bob The Builder', voucher: 'VOUCHER002', roleName: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Charlie Chaplin', voucher: 'VOUCHER003', roleName: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  private nextUserId = 4;

  private mockRoles: Role[] = [
    { id: 1, name: 'Admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Editor', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Viewer', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  private nextRoleId = 4;

  sectionSignal = signal("" as string | null);
  subSectionSignal = signal("" as string | null); 
  formSignal = signal(false);
  gridKeyField = signal<string>("id");

  dataSource = signal<any[]>([]); 
  columnConfigurations = signal<any[]>([]);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, 
    private router: Router,
    ) {

    }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const section = params.get('section');
      const subSection = params.get('subSection');
      this.sectionSignal.set(section);
      this.subSectionSignal.set(subSection);

      if (subSection === 'sales') {
        this.gridKeyField.set('salesOrderId');
      } else if (subSection === 'users' || subSection === 'roles') {
        this.gridKeyField.set('id');
      } else {
        this.gridKeyField.set('id');
      }



      this.loadGridData(this.subSectionSignal());
    });
    
  }

  ngOnChanges(){
    this.loadGridData(this.subSectionSignal());
  }


  loadGridData(subSection: string | null): void {
    if (!subSection) return;

    if (subSection === "users") {
        this.getUsers().subscribe(users => {
          this.dataSource.set(users);
          this.columnConfigurations.set(
            [
            { dataField: 'id', caption: 'ID', visible: false, class: "dx-datagrid-headers" }, 
            { dataField: 'name', caption: 'Name',  class: "dx-datagrid-headers"},
            { dataField: 'voucher', caption: 'UserID' },
            { dataField: 'roleName', caption: 'Role Name' },
            { dataField: 'createdAt', caption: 'Created At', dataType: 'datetime' },
            { dataField: 'updatedAt', caption: 'Updated At', dataType: 'datetime' },
            { type: 'buttons', buttons: ['edit', 'delete'] } 
          ]
          )
        });
    } else if (subSection === "roles") {
      this.getRoles().subscribe(roles => {
          this.dataSource.set(roles);
          this.columnConfigurations.set(
            [
            { dataField: 'id', caption: 'ID', visible: false },
            { dataField: 'name', caption: 'Name' },
            { dataField: 'createdAt', caption: 'Created At', dataType: 'datetime' },
            { dataField: 'updatedAt', caption: 'Updated At', dataType: 'datetime' },
            { type: 'buttons', buttons: ['edit', 'delete'] }
          ]
          )
        });
    }else if (subSection === "sales") {
    this.getSalesOrdersHeaders().subscribe(salesOrders => {
        console.log("Sales Orders:", salesOrders);
        this.dataSource.set(salesOrders);
        this.columnConfigurations.set(
          [
          { dataField: 'salesOrderId', caption: 'ID', visible: false},
          { dataField: 'revisionNumber', caption: 'Revision Number' },
          { dataField: 'orderDate', caption: 'Order Date', dataType: 'datetime' },
          { dataField: 'dueDate', caption: 'Due Date', dataType: 'datetime' },
          { dataField: 'shipDate', caption: 'Ship Date', dataType: 'datetime' },
          { dataField: 'status', caption: 'Status' },
          { dataField: 'salesOrderNumber', caption: 'Sales Order Number' },
          { dataField: 'purchaseOrderNumber', caption: 'Purchase Order Number' },
          { dataField: 'accountNumber', caption: 'Account Number' },
          { dataField: 'subTotal', caption: 'Sub Total' },
          { dataField: 'taxAmt', caption: 'Tax Amt' },
          { dataField: 'freight', caption: 'Freight' },
          { dataField: 'totalDue', caption: 'TotalDue' },
          { dataField: 'comment', caption: 'Comment' },
          { dataField: 'modifiedDate', caption: 'Modified Date', dataType: 'datetime' },
          { type: 'buttons', buttons: ['edit', 'delete'] }
        ]
        )
      });
    
    }
    if (subSection === "menus"){
      this.getMenus().subscribe(menus => {
        console.log("Menus:", menus);
          this.dataSource.set(menus);
          this.columnConfigurations.set(
            [
            { dataField: 'id', caption: 'ID', visible: false },
            { dataField: 'name', caption: 'Name' },
            { dataField: 'createdAt', caption: 'Created At', dataType: 'datetime' },
            { dataField: 'updatedAt', caption: 'Updated At', dataType: 'datetime' },
            { type: 'buttons', buttons: ['edit', 'delete'] }
          ]
          )
        });
    }
    if (subSection === "menu-roles"){
      this.getMenuRoles().subscribe(menuRoles => {
        console.log("MenuRoles:", menuRoles);
          this.dataSource.set(menuRoles);
          this.columnConfigurations.set(
            [
            { dataField: 'id', caption: 'ID', visible: false },
            { dataField: 'name', caption: 'Menus' },
            { dataField: 'roles', caption: 'Roles' },

            // { dataField: 'createdAt', caption: 'Created At', dataType: 'datetime' },
            // { dataField: 'updatedAt', caption: 'Updated At', dataType: 'datetime' },
            { type: 'buttons', buttons: ['edit', 'delete'] }
          ]
          )
        });
    }
    

  }

  capitalize = capitalize;


  openForm(isEditing = false, data: any = null){
    this.formSignal.set(true);
  }

  closeTheForm(){
    this.formSignal.set(false);
  }

  submitForm(entry: any){
    console.log("Form submitted with entry:", entry);
    const currentSubSection = this.subSectionSignal();

  
        if (currentSubSection === "users"){
          //HERE I NEED TO GET THE ROLEID BACK 

            const newUser: user = {
                id: this.nextUserId++,
                name: entry.data.name,
                voucher: entry.data.voucher,
                roleName: entry.data.roleName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            console.log(newUser)

            this.createUser(newUser)
            this.loadGridData(currentSubSection);

            
            this.closeTheForm();
        } else if (currentSubSection === "roles"){

          const newRole: Role = {
            id: this.nextRoleId++,
            name: entry.data.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
            this.createRoles(newRole)
            this.loadGridData(currentSubSection);

            
            this.closeTheForm();
        }
    
  }
  
  baseUrl = "http://localhost:5178/api/users";
  baseUrlRoles = "http://localhost:5178/api/roles";
  baseUrlSales = "http://localhost:5178/api/sales";
  baseUrlMenus = "http://localhost:5178/api/menus";

  onRowUpdating(e: any) {
    
    console.log('Row updating:', e);
    
    const currentSubSection = this.subSectionSignal();
    const idToUpdate = e.key; 
     if (!idToUpdate) {
        console.error('Cannot update item without ID');
        e.cancel = true; 
        return;
    }

    if (currentSubSection === "users"){
      const updatedUser: user = {
        id: e.key,
        name: e.newData.name ? e.newData.name : e.oldData.name,
        voucher: e.newData.voucher ? e.newData.voucher : e.oldData.voucher,
        roleName: e.newData.roleName ? e.newData.roleName : e.oldData.roleName,
        createdAt: e.oldData.createdAt,
        updatedAt: new Date().toISOString() 
      }
        this.updateUser(updatedUser).subscribe(updatedUser => {
            if (updatedUser) {
                console.log('User updated successfully from mock');
            } else {
                console.error('Failed to update user from mock');
            }
        });
    }
    else if (currentSubSection === "roles"){
      const updatedRole: Role ={
        id: e.key,
        name: e.newData.name ? e.newData.name : e.oldData.name,
        createdAt: e.oldData.createdAt,
        updatedAt: new Date().toISOString() 
      }
        this.updateRole(updatedRole).subscribe(updatedRole => {
            if (updatedRole) {
                console.log('Role updated successfully from mock');
            } else {
                console.error('Failed to update role from mock');
                e.cancel = true;
            }
        });
    }
  }

  onRowRemoving(e: any) {
    console.log('Row removing:', e.data); 
    const currentSubSection = this.subSectionSignal();
    const idToDelete = e.data.id; 

    if (!idToDelete) {
        console.error('Cannot delete item without ID');
        e.cancel = true; 
        return;
    }

    if (currentSubSection === "users"){
        this.deleteUser(idToDelete).subscribe(success => {
            if (success) {
                console.log('User deleted successfully from mock');
            } else {
                console.error('Failed to delete user from mock');
            }
        });
    } else if (currentSubSection === "roles"){
        this.deleteRole(idToDelete).subscribe(success => {
            if (success) {
                console.log('Role deleted successfully from mock');
            } else {
                console.error('Failed to delete role from mock');
                e.cancel = true;
            }
        });
    }
   
  }

  onRowInserting(e: any){
    this.submitForm(e)
  }

  onCellPrepared(e: any) : void {
    //color
    if (e.rowType === 'header') {
      e.cellElement.style.cssText = 'background-color: #004b78; color: white;';
      e.cellElement.css('color', 'white');
    }
  }
  
  
  getSalesOrdersHeaders(){
    const salesOrdersHeaders: any[] = []

    this.http.get<any>(this.baseUrlSales).subscribe({
      next: salesOrders => {
        salesOrdersHeaders.push(...salesOrders);
      },
      error: (err) => {
        console.error("Error fetching headers:", err);
      }
    })
    return of(salesOrdersHeaders);
  }


  getUserHeaders(){
    return usersHeaders; 
  }

  getUsers(): Observable<user[]>{
     const currentUsers: user[] = []

    this.http.get<user[]>(this.baseUrl).subscribe({
      next: users => {
        currentUsers.push(...users)
      },
      error: err => {
        console.error('Error fetching users:', err)
      }
    })

    return of(currentUsers)
  }

  getUserById(id: number): Observable<user | undefined>{
    // return this.http.get(`${this.baseUrl}/${id}`);
    const user = this.mockUsers.find(u => u.id === id);
    return of(user);
  }

  // getUserByName(name: string): Observable<user | undefined>{
  //   const currentUser: user[] = []
  //   this.http.get<user>(this.baseUrl + "/" + "userName"+ "/" + name).subscribe({
  //     next: user => {
  //       currentUser.push(user);
  //       console.log("User:", user);
  //     },
  //     error: err => {
  //       console.error("Error fetching user:", err);
  //     }
  //   })
  //   return of(currentUser[0]);
  // }

  createUser(newUser: user): Observable<user>{
    // this.getUsers().subscribe(users => {
    //   console.log("newuser:", newUser.name);
    //   const userExists = users.some(user => {
    //     console.log("user:", user.name);
    //     return user.name.toLowerCase() == newUser.name.toLowerCase()
    //   });     
    //   userExists 
    //     ? alert("User already exists") 
    //     : console.log("User does not exist, creating new user");
    // });

    const userWithId: user = { 
        ...newUser, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
    };

    this.http.post<Role[]>(this.baseUrl, userWithId).subscribe({
      next: (response: any) => {
        console.log('User created and added to array:', response)
        this.loadGridData(this.subSectionSignal())
      },
      error: (err) => {
        alert("Error creating user: It Aready Exists");
      }
    })
    return of(userWithId);
  }

  updateUser(userToUpdate: user): Observable<user | undefined>{
    console.log('Updating User:', userToUpdate);
   this.http.put<user>(this.baseUrl + "/" + userToUpdate.id, userToUpdate).subscribe({
    next: (res) => {
      console.log('User updated and added to array:', res)
      this.loadGridData(this.subSectionSignal())
    }
   })

   return of(userToUpdate);
  }

  deleteUser(id: number): Observable<boolean>{ 
     this.http.delete(this.baseUrl+ "/" + id).subscribe({
      next: () => {
        console.log('User deleted successfully from server');
      },
      error: (err) => {
        console.error('Error deleting User from server:', err);
      }
    })
    return of(true);
  }

  getRoles(): Observable<Role[]>{
    const currentRoles: Role[] = []

    this.http.get<Role[]>(this.baseUrlRoles).subscribe({
      next: roles => {
        currentRoles.push(...roles)
      },
      error: err => {
        console.error('Error fetching roles:', err)
      }
    })

    return of(currentRoles)
  }
  
  getRoleHeaders(){
    return rolesHeaders; 
  }

  // getRoleById(id: number): Observable<Role | undefined>{
  //   const role = this.mockRoles.find(r => r.id === id);
  //   return of(role);
  // }

  createRoles(newRole: Role): Observable<Role>{
    const roleWithId: Role = { 
        ...newRole, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
    };

    this.http.post<Role>(this.baseUrlRoles, roleWithId).subscribe({
      next: (response) => {
        console.log('Role created and added to array:', response)
        this.loadGridData(this.subSectionSignal())
      },
      error: (err) => {
        console.error('Error creating rol:', err)
        alert("Error creating user: It Aready Exists");
      }
    })
    this.mockRoles.push(roleWithId);
    console.log('Created role (mock):', roleWithId);
    return of(roleWithId);
  }

  updateRole(roleToUpdate: Role): Observable<Role | undefined>{
    console.log('Updating role:', roleToUpdate);
   this.http.put<Role>(this.baseUrlRoles + "/" + roleToUpdate.id, roleToUpdate).subscribe({
    next: (res) => {
      console.log('Role updated and added to array:', res)
      this.loadGridData(this.subSectionSignal())
    }
   })

   return of(roleToUpdate);
  }

  deleteRole(id: number): Observable<boolean>{ 

    this.http.delete(this.baseUrlRoles+ "/" + id).subscribe({
      next: () => {
        console.log('Role deleted successfully from server');
      },
      error: (err) => {
        console.error('Error deleting role from server:', err);
      }
    })
    const initialLength = this.mockRoles.length;
    return of(true);
  }


  getMenus(): Observable<Menu[]>{
    const currentMenus: Menu[] = []

   this.http.get<Menu[]>(this.baseUrlMenus).subscribe({
     next: menus => {
      currentMenus.push(...menus)
     },
     error: err => {
       console.error('Error fetching menus:', err)
     }
   })

   return of(currentMenus)
 }

 getMenuRoles(): Observable<MenuRole[]>{
  const currentMenuRoles: MenuRole[] = []

 this.http.get<MenuRole[]>(this.baseUrlMenus+"/"+"menu-roles").subscribe({
   next: menuRoles => {
    currentMenuRoles.push(...menuRoles)
   },
   error: err => {
     console.error('Error fetching menuRoles:', err)
   }
 })

 return of(currentMenuRoles)
}
}
