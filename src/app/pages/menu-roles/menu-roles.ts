import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule , DxFormModule, DxTextBoxModule } from 'devextreme-angular';
import { capitalize } from '../../../utils/capitalize';
import { MenuService } from '../../services/menu.service'; 
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-menu-roles',
  imports: [
    CommonModule, 
    DxDataGridModule, DxButtonModule, 
    DxSelectBoxModule, DxFormModule,
    DxTextBoxModule 
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

  constructor(
    private route: ActivatedRoute, 
    private menuService: MenuService
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

   
    this.menuService.getMenuRoles().subscribe(menuRoles => { 
      console.log("MenuRoles:", menuRoles);
        this.dataSource.set(menuRoles);
        this.columnConfigurations.set(
          [
          { dataField: 'id', caption: 'ID', visible: false },
          { dataField: 'name', caption: 'Menus' },
          { dataField: 'roles', caption: 'Roles' },

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

    this.menuService.updateMenuRoles(e.key, e.newData.roles).subscribe(menuRole =>{ 
      console.log(menuRole)
      if (menuRole && menuRole.length > 0){ 
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

        // const newMenu: Menu = {
        //   name: entry.data.name,
        //   createdAt: new Date().toISOString(),
        //   updatedAt: new Date().toISOString()
        // }
        // this.menuService.createMenu(newMenu).subscribe(createdMenu => { 
        //   if (createdMenu) {
        //     console.log('Menu created successfully:', createdMenu);
        //     this.loadGridData(currentSubSection);
        //     this.closeTheForm();
        //   } else {
        //     console.error('Failed to create menu');
        //   }
        // });
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
