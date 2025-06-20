import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { capitalize } from 'src/utils/capitalize';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule , DxFormModule, DxTextBoxModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import notify from 'devextreme/ui/notify';


@Component({
  selector: 'app-users',
  imports: [
    CommonModule, 
    DxDataGridModule, DxButtonModule, 
    DxSelectBoxModule, DxFormModule,
    DxTextBoxModule 
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {



  sectionSignal = signal("" as string | null);
  subSectionSignal = signal("" as string | null); 
  formSignal = signal(false);
  gridKeyField = signal<string>("id");

  dataSource = signal<any[]>([]); 
  columnConfigurations = signal<any[]>([]);
  rolesAvailables = signal<any>([])

  constructor(
    private route: ActivatedRoute,
    private userService: UserService, 
    private roleService: RoleService
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


      this.roleService.getRoles().subscribe(roles => {
        const rolesName = roles.map(role => role.name)
        this.rolesAvailables.set(rolesName)
        // console.log("roleees",rolesName)
      })

      this.loadGridData();
    });

    
    
  }

  loadGridData(): void {

    this.userService.getUsers().subscribe(users => { 
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
    
    const idToUpdate = e.key; 
     if (!idToUpdate) {
        console.error('Cannot update item without ID');
        e.cancel = true; 
        return;
    }

    const baseUpdatedUser = {
      id: e.key,
      name: e.newData.name ?? e.oldData.name,
      voucher: e.newData.voucher ?? e.oldData.voucher,
      createdAt: e.oldData.createdAt,
      updatedAt: new Date().toISOString()
    };

    const roleName = e.newData.roleName ?? e.oldData.roleName;

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
        console.log('Updated user:', updatedUser);

        this.userService.updateUser(updatedUser).subscribe({ 
          next: (response) => {
            notify("Updated Sucessfully", "success", 3000)
            console.log('User updated successfully');
            this.loadGridData();
          },
          error: (error) => {
            notify("Error Updating", "error", 3000)
            console.error('Failed to update user:', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to get role by name:', error);
      }
    });
  }

  onRowRemoving(e: any) {
    console.log('Row removing:', e.data); 
    const idToDelete = e.data.id; 

    if (!idToDelete) {
        console.error('Cannot delete item without ID');
        e.cancel = true; 
        return;
    }

    this.userService.deleteUser(idToDelete).subscribe(success => { 
        if (success) {
            notify("Deleted Sucessfully", "success", 3000)
            console.log('User deleted successfully');
             this.loadGridData(); 
        } else {
            console.error('Failed to delete user');
        }
    });
   
   
  }

  onRowInserting(entry: any){
    console.log("Form submitted with entry:", entry);

    this.roleService.getRoleByName(entry.data.roleName).subscribe(role => {
      if (!role){
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
          notify("Created Sucessfully", "success", 3000)
          console.log('User created successfully:', createdUser);
          this.loadGridData();
          this.closeTheForm();
        },
        error: (error) => {
          console.error('Failed to create user:', error);
        }
      });
    })
  
       
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
