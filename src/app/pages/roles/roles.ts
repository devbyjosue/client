import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule , DxFormModule, DxTextBoxModule } from 'devextreme-angular';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/types';
import { capitalize } from 'src/utils/capitalize';


@Component({
  selector: 'app-roles',
  imports: [
    CommonModule, 
    DxDataGridModule, DxButtonModule, 
    DxSelectBoxModule, DxFormModule,
    DxTextBoxModule 
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles {

  sectionSignal = signal("" as string | null);
  subSectionSignal = signal("" as string | null); 
  formSignal = signal(false);
  gridKeyField = signal<string>("id");

  dataSource = signal<any[]>([]); 
  columnConfigurations = signal<any[]>([]);
  rolesAvailables = signal<any>([])

  constructor(
    private route: ActivatedRoute,
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



      this.loadGridData();
    });
    
  }


  loadGridData(): void {

    this.roleService.getRoles().subscribe(roles => { 
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

    const updatedRole: Role ={
      id: e.key,
      name: e.newData.name ? e.newData.name : e.oldData.name,
      createdAt: e.oldData.createdAt,
      updatedAt: new Date().toISOString() 
    }
      this.roleService.updateRole(updatedRole).subscribe(updatedRoleResponse => { 
          if (updatedRoleResponse) {
              console.log('Role updated successfully');
              this.loadGridData();
          } else {
              console.error('Failed to update role');
              e.cancel = true;
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

    this.roleService.deleteRole(idToDelete).subscribe(success => { 
        if (success) {
            console.log('Role deleted successfully');
            this.loadGridData(); 
        } else {
            console.error('Failed to delete role');
            e.cancel = true;
        }
    });
  
   
  }

  onRowInserting(entry: any){
    console.log("Form submitted with entry:", entry);
  
    const newRole: Role = {
      name: entry.data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
      this.roleService.createRole(newRole).subscribe(createdRole => { 
        if (createdRole) {
          console.log('Role created successfully:', createdRole);
          this.loadGridData();
          this.closeTheForm();
        } else {
          console.error('Failed to create role');
        }
      });
       
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
