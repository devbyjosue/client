import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule , DxFormModule, DxTextBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { capitalize } from '../../../utils/capitalize';
import { MenuService } from '../../services/menu.service'; 
import { ActivatedRoute } from '@angular/router';
import { RoleService } from 'src/app/services/role.service';



@Component({
  selector: 'app-menu-roles',
  imports: [
    CommonModule, 
    DxDataGridModule, DxButtonModule, 
    DxSelectBoxModule, DxFormModule,
    DxTextBoxModule , DxCheckBoxModule
  ],
  templateUrl: './menu-roles.html',
  styleUrl: './menu-roles.css'
})
export class MenuRoles {



  sectionSignal = signal("" as string | null);
  subSectionSignal = signal("" as string | null); 
  formSignal = signal(false);
  gridKeyField = signal<string>("id");

  dataSource = signal<any[]>([]); 
  columnConfigurations = signal<any[]>([]);
  rolesAvailables = signal<any>([])

  selectedRole = signal<any>('')

  constructor(
    private menuService: MenuService,
    private roleService: RoleService
    ) {

    }

  ngOnInit(): void {

    this.roleService.getRoles().subscribe(roles => {
      const rolesName = roles.map(role => role.name)
      this.rolesAvailables.set(rolesName)
      // console.log("roleees",rolesName)
      this.loadGridData();
    })


    
  }


loadGridData(): void {
  if (this.selectedRole() === '') return

  this.menuService.getMenuRoles().subscribe(menuRoles => {
    console.log(menuRoles)

    const currentSelectedMenuData = menuRoles.filter(m => m.roleName == this.selectedRole())
    const notCurrentSelectedMenuData = menuRoles.filter(m => m.roleName != this.selectedRole())

    console.log(currentSelectedMenuData)
    console.log(notCurrentSelectedMenuData)
    
  
    const allMenus = [
      ...currentSelectedMenuData,
      ...notCurrentSelectedMenuData.map(menu => ({
        ...menu,
        canView: false,
        canEdit: false
      }))
    ];
    
    
    // const menusWithRole = menuRoles.filter(m => m.roles.includes(this.selectedRole()));

    // console.log(menusWithRole)

    // const menusWithoutRole = menuRoles.filter(m => !m.roles.includes(this.selectedRole()));
    // const allMenus = [
    //   ...menusWithRole,
    //   ...menusWithoutRole.map(menu => ({
    //     ...menu,
    //     canView: false,
    //     canEdit: false
    //   }))
    // ];
    
    // console.log(allMenus)
    
    this.dataSource.set(allMenus);
    this.columnConfigurations.set([
      { dataField: 'id', caption: 'ID', visible: false },
      { dataField: 'menuName', caption: 'Menus' },
      { dataField: 'canView', caption: 'View', dataType: 'boolean', editorOptions: { enableThreeStateBehavior: false}},
      { dataField: 'canEdit', caption: 'Edit', dataType: 'boolean', editorOptions: { enableThreeStateBehavior: false}}
    ]);
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

  onRoleSelected(e:any){
    this.selectedRole.set(e.value)
    this.loadGridData()
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

    const updatedMenuRole = {
        id: e.key,
        canView: e.newData.hasOwnProperty('canView') ? e.newData.canView : e.oldData.canView,
        canEdit: e.newData.hasOwnProperty('canEdit') ? e.newData.canEdit : e.oldData.canEdit
    }
    console.log(updatedMenuRole)

    this.menuService.updateMenuRoles(e.key, updatedMenuRole).subscribe(menuRole => { 
        console.log(menuRole)
        if (menuRole && menuRole.length > 0) { 
            console.log('MenuRole updated successfully')
            this.loadGridData();
        } else {
            console.error('Failed to update MenuRole or no roles returned')
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

    
  //   this.menuService.deleteMenu(idToDelete).subscribe(success => { 
  //     if (success) {
  //         console.log('Menu deleted successfully');
  //         this.loadGridData(this.subSectionSignal()); 
  //     } else {
  //         console.error('Failed to delete menu');
  //     }
  // });
   
  }

  onRowInserting(entry: any){
    console.log("Form submitted with entry:", entry);

    
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

  saveChanges() {
    // const changes = this.dataSource().filter(item => item.view !== item.originalView || item.edit !== item.originalEdit);
    // changes.forEach(change => {
    //   this.menuService.updateMenuRoles(change.id, { view: change.view, edit: change.edit }).subscribe({
    //     next: () => console.log(`Changes saved for menu role ID: ${change.id}`),
    //     error: err => console.error(`Failed to save changes for menu role ID: ${change.id}`, err)
    //   });
    // });
  }
}
