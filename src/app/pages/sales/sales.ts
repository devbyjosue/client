import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule , 
  DxFormModule, DxTextBoxModule } from 'devextreme-angular';
import { capitalize } from '../../../utils/capitalize';
import notify from 'devextreme/ui/notify';
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
  gridKeyField = signal<string>("salesOrderID");

  dataSource = signal<any[]>([]); 
  columnConfigurations = signal<any[]>([]);
  rolesAvailables = signal<any>([])

  getDetailGridDataSource = signal<any[]>([])
  detailColumnConfigurations = signal<any[]>([])

  productsAvailable = signal<any[]>([])
  productsObjectAvailables = signal<any[]>([])
  customersAvailable = signal<any[]>([])
  customersObjectAvailables = signal<any[]>([])

  productsCounter = signal<any[]>([{ products: '', quantity: '' }])


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
        // console.log("Sales Orders:", salesOrders);
        this.dataSource.set(salesOrders);
        this.columnConfigurations.set(
          [
          { dataField: 'salesOrderID', caption: 'ID', visible: true, alignment: 'left', headerAlignment: 'left'},
          { dataField: 'revisionNumber', caption: 'Revision Number', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'orderDate', caption: 'Order Date', dataType: 'datetime', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'dueDate', caption: 'Due Date', dataType: 'datetime', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'shipDate', caption: 'Ship Date', dataType: 'datetime', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'status', caption: 'Status', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Customer', caption: 'Customers', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product', caption: 'Products', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'salesOrderNumber', caption: 'Sales Order Number', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'purchaseOrderNumber', caption: 'Purchase Order Number', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'accountNumber', caption: 'Account Number', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'subTotal', caption: 'Sub Total', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'taxAmt', caption: 'Tax Amt', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'freight', caption: 'Freight', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'totalDue', caption: 'TotalDue', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'comment', caption: 'Comment', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'modifiedDate', caption: 'Modified Date', dataType: 'datetime', alignment: 'left', headerAlignment: 'left' },
          { type: 'buttons', buttons: ['edit', 'delete'], alignment: 'left', headerAlignment: 'left' }
        ]
        )
      });

      this.detailColumnConfigurations.set(
        [
          { dataField: 'salesOrderDetailId', caption: 'Detail ID', visible: false, alignment: 'left'},
          { dataField: 'salesOrderID', caption: 'Detail ID', visible: false, alignment: 'left'},
          { dataField: 'carrierTrackingNumber', caption: 'Detail ID', visible: false, alignment: 'left'},
          { dataField: 'orderQty', caption: 'Order Quantity', alignment: 'left' },
          { dataField: 'productName', caption: 'Product Name', alignment: 'left' },
          { dataField: 'unitPrice', caption: 'Unit Price', alignment: 'left' },
          { dataField: 'unitPriceDiscount', caption: 'Unit Price Discount', alignment: 'left' },
          { dataField: 'lineTotal', caption: 'Line Total', alignment: 'left' },
          { dataField: 'modifiedDate', caption: 'Modified Date', dataType: 'datetime', alignment: 'left' }
        ]
      );

      this.salesService.getProducts().subscribe(products => {
        this.productsObjectAvailables.set(products)

        const productNames = products.map(p => p.name)
        this.productsAvailable.set(productNames)
      })
   
    this.salesService.getCustomers().subscribe(customers => {
      this.customersObjectAvailables.set(customers)

      const customersName = customers.map(p => p.name)
      this.customersAvailable.set(customersName)
    })

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

  onRowClick(e: any) {
    const salesOrderID = e.data.salesOrderID;
    // console.log(salesOrderID)
    if (!salesOrderID) {
        console.error('Cannot load details without Sales Order ID');
        return;
    }

    this.salesService.getSalesOrderDetails(salesOrderID).subscribe(details => {
        console.log('SaleOrderID:', salesOrderID);
        console.log('Sales Order Details:', details);
        console.log(e)

        this.getDetailGridDataSource.set(details);
    });
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
    console.log('Row removing:', e.data.salesOrderID); 
    const idToDelete = e.data.salesOrderID; 
    console.log(idToDelete)
    if (!idToDelete) {
        console.error('Cannot delete item without ID');
        e.cancel = true; 
        return;
    }

    this.salesService.deleteSaleOrder(idToDelete).subscribe(
      so => notify("Deleted Sucessfully", "success", 3000)
      
    )
   
  }

  onRowInserting(entry: any){
    console.log("Form submitted with entry:", entry);

    const product = this.productsObjectAvailables().filter(p => p.name == entry.data.Product)[0]
    console.log(product)
    const customer = this.customersObjectAvailables().filter(c => c.name == entry.data.Customer)[0]
    const subTotal = entry.data.Quantity * product.standardCost
    const taxAmt = 123

  
    const sale = {
      SalesOrderHeader: { 
        salesOrderID: 75139,
        OrderDate: new Date().toISOString(), 
        DueDate: new Date().toISOString(),
        CustomerID: customer.customerID,
        TotalDue: subTotal - taxAmt,
        ModifiedDate: new Date().toISOString(),
      },
      SalesOrderDetail: [
        {
          salesOrderID: 75139,
          CarrierTrackingNumber: "XYZ123456",
          OrderQty: entry.data.Quantity,
          ProductId: product.productID,
          SpecialOfferId: null,
          UnitPrice: product.standardCost,
          UnitPriceDiscount: 0.00,
          LineTotal: 249.90,
          ModifiedDate: new Date().toISOString(),
        }
      ]
    };


    console.log(sale)
 
    // this.salesService.createSaleOrder(sale).subscribe(s => {
    //   console.log("done",s)
    //   notify("Added Sucessfully", "success", 3000)

    // })
     
  }

  addProduct(){
    console.log("Adding product to the form");
    this.productsCounter.set(this.productsCounter().concat([{ products: '', quantity: '' }]))
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
