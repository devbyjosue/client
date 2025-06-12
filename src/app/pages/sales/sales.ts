import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule , DxFormModule, DxTextBoxModule } from 'devextreme-angular';
import { capitalize } from '../../../utils/capitalize';
import { SalesService } from '../../services/sales.service'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sales',
  imports: [
    CommonModule, 
    DxDataGridModule, DxButtonModule, 
    DxSelectBoxModule, DxFormModule,
    DxTextBoxModule 
  ],
  templateUrl: './sales.html',
  styleUrl: './sales.css'
})
export class Sales {



  sectionSignal = signal("" as string | null);
  subSectionSignal = signal("" as string | null); 
  formSignal = signal(false);
  gridKeyField = signal<string>("salesOrderId");

  dataSource = signal<any[]>([]); 
  columnConfigurations = signal<any[]>([]);
  rolesAvailables = signal<any>([])

  constructor(
    private route: ActivatedRoute,
    private salesService: SalesService 
    ) {

    }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const section = params.get('section');
      const subSection = params.get('subSection');
      this.sectionSignal.set(section);
      this.subSectionSignal.set(subSection);

 



      this.loadGridData();
    });
    
  }


  loadGridData(): void {

    this.salesService.getSalesOrdersHeaders().subscribe(salesOrders => { 
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

    //here to update letsgo
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

    //remove logic aaaaaaa
   
  }

  onRowInserting(entry: any){
    console.log("Form submitted with entry:", entry);

  
     //insert logic aaaaaaa
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
