import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { Menu, MenuRole, Role, TableData, user } from '../../../types';
import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule , DxFormModule, DxTextBoxModule } from 'devextreme-angular';
import { capitalize } from '../../../utils/capitalize';
import { MenuService } from '../../services/menu.service'; 
import { DxoBackgroundColorComponent } from 'devextreme-angular/ui/nested';
import { UserService } from '../../services/user.service'; 
import { RoleService } from '../../services/role.service'; 
import { SalesService } from '../../services/sales.service'; 


@Component({
  selector: 'app-info',
  imports: [
    CommonModule, 
    DxDataGridModule, DxButtonModule, 
    DxSelectBoxModule, DxFormModule,
    DxTextBoxModule 
  ],
  templateUrl: './info.html',
  styleUrl: './info.css'
})
export class Info implements OnInit {



  sectionSignal = signal("" as string | null);
  subSectionSignal = signal("" as string | null); 
  formSignal = signal(false);
  gridKeyField = signal<string>("id");

  dataSource = signal<any[]>([]); 
  columnConfigurations = signal<any[]>([]);
  rolesAvailables = signal<any>([])

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService, 
    private roleService: RoleService, 
    private menuService: MenuService, 
    private salesService: SalesService 
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


  loadGridData(subSection: string | null): void {
    if (!subSection) return;

    if (subSection === "users") {
        this.userService.getUsers().subscribe(users => { // Use userService
          this.dataSource.set(users);
          this.columnConfigurations.set(
            [
            { dataField: 'id', caption: 'ID', visible: false, class: "dx-datagrid-headers" }, 
            { dataField: 'name', caption: 'Name',  class: "dx-datagrid-headers"},
            { dataField: 'voucher', caption: 'UserID' },
            { dataField: 'roleName', caption: 'Role Name' },
            { dataField: 'createdAt', caption: 'Created At', dataType: 'datetime' , editorOptions: { value: new Date(), readOnly: true } },
            { dataField: 'updatedAt', caption: 'Updated At', dataType: 'datetime' , editorOptions: { value: new Date(), readOnly: true }},
            { type: 'buttons', buttons: ['edit', 'delete'] } 
          ]
          )
        });
    } else if (subSection === "roles") {
      this.roleService.getRoles().subscribe(roles => { // Use roleService
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
    this.salesService.getSalesOrdersHeaders().subscribe(salesOrders => { // Use salesService
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
      this.menuService.getMenus().subscribe(menus => { // Use menuService
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
      this.menuService.getMenuRoles().subscribe(menuRoles => { // Use menuService
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

  onEditorPreparing(e:any) {
    if (e.dataField === "id" || e.dataField === "updatedAt") {
      e.editorOptions.visible = false;
      e.editorOptions.label = { visible: false };
      e.editorOptions.label.visible = false
      console.log(e)
    }
  }
  

  openForm(isEditing = false, data: any = null){
    this.formSignal.set(true);
  }

  closeTheForm(){
    this.formSignal.set(false);
  }

  
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
      const baseUpdatedUser = {
        id: e.key,
        name: e.newData.name ?? e.oldData.name,
        voucher: e.newData.voucher ?? e.oldData.voucher,
        createdAt: e.oldData.createdAt,
        updatedAt: new Date().toISOString()
      };

      // Get role name from either new or old data
      const roleName = e.newData.roleName ?? e.oldData.roleName;

      // First get the roleId by searching for the role name
      this.roleService.getRoleByName(roleName).subscribe({
        next: (role) => {
          if (!role) {
            console.error('Role not found');
            return;
          }

          const updatedUser = {
            ...baseUpdatedUser,
            roleId: role.id
          };

          this.userService.updateUser(updatedUser).subscribe({ // Use userService
            next: (response) => {
              console.log('User updated successfully');
              this.loadGridData(this.subSectionSignal());
            },
            error: (error) => {
              console.error('Failed to update user:', error);
            }
          });
        },
        error: (error) => {
          console.error('Failed to get role by name:', error);
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
        this.roleService.updateRole(updatedRole).subscribe(updatedRoleResponse => { // Use roleService
            if (updatedRoleResponse) {
                console.log('Role updated successfully');
                this.loadGridData(this.subSectionSignal());
            } else {
                console.error('Failed to update role');
                e.cancel = true;
            }
        });
    } else if (currentSubSection === "menus"){
      const updatedMenu: Menu = {
        id: e.key,
        name: e.newData.name ? e.newData.name : e.oldData.name,
        createdAt: e.oldData.createdAt,
        updatedAt: new Date().toISOString() 
      }
      this.menuService.updateMenu(updatedMenu).subscribe(updatedMenuResponse => { // Use menuService
        if (updatedMenuResponse) {
            console.log('Menu updated successfully');
            this.loadGridData(this.subSectionSignal());
        } else {
            console.error('Failed to update menu');
            e.cancel = true;
        }
    });
      
    } else if (currentSubSection === "menu-roles"){
     
      this.menuService.updateMenuRoles(e.key, e.newData.roles).subscribe(menuRole =>{ // Use menuService
        console.log(menuRole)
        if (menuRole && menuRole.length > 0){ // Check if menuRole is not empty
          console.log('MenuRole updated successfully')
          this.loadGridData(this.subSectionSignal());
        } else {
          console.error('Failed to update MenuRole or no roles returned')
          e.cancel = true;
        }
      })
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
        this.userService.deleteUser(idToDelete).subscribe(success => { 
            if (success) {
                console.log('User deleted successfully');
                 this.loadGridData(this.subSectionSignal()); 
            } else {
                console.error('Failed to delete user');
            }
        });
    } else if (currentSubSection === "roles"){
        this.roleService.deleteRole(idToDelete).subscribe(success => { 
            if (success) {
                console.log('Role deleted successfully');
                this.loadGridData(this.subSectionSignal()); 
            } else {
                console.error('Failed to delete role');
                e.cancel = true;
            }
        });
    } else if (currentSubSection === "menus"){
      this.menuService.deleteMenu(idToDelete).subscribe(success => { 
        if (success) {
            console.log('Menu deleted successfully');
            this.loadGridData(this.subSectionSignal()); 
        } else {
            console.error('Failed to delete menu');
        }
    });
    } 
   
  }

  onRowInserting(entry: any){
    console.log("Form submitted with entry:", entry);
    const currentSubSection = this.subSectionSignal();

  
        if (currentSubSection === "users"){
          //HERE I NEED TO GET THE ROLEID BACK 
            this.roleService.getRoleByName(entry.data.roleName).subscribe(role => {
              if (!role){
                alert("Unable to create User, not a valid role")
                return 
              }
              const newUser = {
                  name: entry.data.name,
                  voucher: entry.data.voucher,
                  roleId: role?.id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
              };

              console.log(newUser)
              this.userService.createUser(newUser).subscribe({
                next: (createdUser) => {
                  console.log('User created successfully:', createdUser);
                  this.loadGridData(currentSubSection);
                  this.closeTheForm();
                },
                error: (error) => {
                  console.error('Failed to create user:', error);
                }
              });
            })
        } else if (currentSubSection === "roles"){

          const newRole: Role = {
            name: entry.data.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
            this.roleService.createRole(newRole).subscribe(createdRole => { 
              if (createdRole) {
                console.log('Role created successfully:', createdRole);
                this.loadGridData(currentSubSection);
                this.closeTheForm();
              } else {
                console.error('Failed to create role');
              }
            });
            
        }
        else if (currentSubSection === "menus"){
          const newMenu: Menu = {
            name: entry.data.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          this.menuService.createMenu(newMenu).subscribe(createdMenu => { 
            if (createdMenu) {
              console.log('Menu created successfully:', createdMenu);
              this.loadGridData(currentSubSection);
              this.closeTheForm();
            } else {
              console.error('Failed to create menu');
            }
          });
        }
  }

  onCellPrepared(e: any) : void {

    if (e.rowType === 'header') {
      e.cellElement.style.cssText = 'background-color: #004b78; color: white;';
    }
    if (e.rowType === "data" && e.column.command === "edit") {
      const deleteButton = e.cellElement.querySelector(".dx-icon-trash");
      if (deleteButton) {
          deleteButton.style.cssText = "color: red;"; 
      }
  }
  }


}
