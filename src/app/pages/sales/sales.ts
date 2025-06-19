import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule , 
  DxFormModule, DxTextBoxModule, DxPopupModule } from 'devextreme-angular';
import { ChangeDetectorRef } from '@angular/core';
import { capitalize } from '../../../utils/capitalize';
import notify from 'devextreme/ui/notify';
import { SalesService } from '../../services/sales.service'; 
import { ActivatedRoute } from '@angular/router';
import { ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';


@Component({
  selector: 'app-sales',
  imports: [
    CommonModule, 
    DxDataGridModule, DxButtonModule, 
    DxSelectBoxModule, DxFormModule,
    DxTextBoxModule, DxPopupModule
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

  productsArray = signal<any[]>([{}])
  currentTotal = signal<number>(0);
  selectedProductValues = signal<any[]>([])


  confirmationPopupVisible = signal(false);
  confirmationDetails = signal<any[]>([]);
  confirmationTotal = signal<number>(0);
  pendingSaleEntry = signal<any>(null);

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;


  constructor(
    private route: ActivatedRoute,
    private salesService: SalesService,
    private cdRef: ChangeDetectorRef
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
          { dataField: 'salesOrderID', caption: 'ID', visible: false, alignment: 'left', headerAlignment: 'left'},
          { dataField: 'revisionNumber', caption: 'Revision Number', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'orderDate', caption: 'Order Date', dataType: 'datetime', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'dueDate', caption: 'Due Date', dataType: 'datetime', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'shipDate', caption: 'Ship Date', dataType: 'datetime', alignment: 'left', headerAlignment: 'left' },
          { dataField: 'status', caption: 'Status', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Customer', caption: 'Customers', visible: false, alignment: 'left', headerAlignment: 'left' },
          
          { dataField: 'Product0', caption: 'Product 1', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product1', caption: 'Product 2', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product2', caption: 'Products 3', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product3', caption: 'Products 4', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product4', caption: 'Products 5', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product5', caption: 'Products 6', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product6', caption: 'Products 7', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product7', caption: 'Products 8', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product8', caption: 'Products 9', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product9', caption: 'Products 10', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product10', caption: 'Products 11', visible: false, alignment: 'left', headerAlignment: 'left' },

          { dataField: 'Quantity0', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity1', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity2', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity3', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity4', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity5', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity6', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity7', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity8', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity9', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Quantity10', caption: 'Quantity', visible: false, alignment: 'left', headerAlignment: 'left' },
  
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
          { dataField: 'salesOrderDetailID', caption: 'Detail ID', visible: false, alignment: 'left'},
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

        const productNames = products.map(p => p.name + " - $" + p.standardCost.toFixed(2))
        this.productsAvailable.set(productNames)
      })
   
    this.salesService.getCustomers().subscribe(customers => {
      this.customersObjectAvailables.set(customers)

      const customersName = customers.map(p => p.name)
      this.customersAvailable.set(customersName)
    })

  }

  @ViewChild(DxDataGridComponent, { static: false }) dxDataGrid!: DxDataGridComponent;

    getGridInstance() {
        return this.dxDataGrid.instance;
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
    entry.cancel = true;
    const entryData = entry.data;

    if (entryData.Customer === undefined || entryData.Customer === null || entryData.Customer === "") {
      notify("Please select a customer", "error", 3000);
      return;
    }
    if (entryData.salesOrderNumber === undefined || entryData.salesOrderNumber === null || entryData.salesOrderNumber === "") {
      notify("Please enter a sales order number", "error", 3000);
      return;
    }
    if (entryData.purchaseOrderNumber === undefined || entryData.purchaseOrderNumber === null || entryData.purchaseOrderNumber === "") {
      notify("Please enter a purchase order number", "error", 3000);
      return;
    }
    if (entryData.accountNumber === undefined || entryData.accountNumber === null || entryData.accountNumber === "") {
      notify("Please enter an account number", "error", 3000);
      return;
    }



    
    this.pendingSaleEntry.set(entryData);
    const productsToConfirm = Object.entries(entryData)
    .filter(([key, val]) => key.startsWith('Product') && val)
    .map(([key, val]) => {
      const index = key.replace('Product', '');
      const quantity = entryData[`Quantity${index}`] || 1;
      const productName = String(val).split(" - $")[0];
      const product = this.productsObjectAvailables().find(p => p.name === productName);
      return {
        product: product.name,
        quantity: parseInt(quantity, 10),
        unitPrice: product.standardCost,
        total: parseInt(quantity, 10) * product.standardCost,
      };
    });
    const totalDue = productsToConfirm.reduce((sum, p) => sum + p.total, 0);

    
    if (productsToConfirm.length === 0) {
      notify("Please select at least one product", "error", 3000);
      this.productsArray().length = 1;
      return;
    }
    productsToConfirm.length = this.productsArray().length; 
    
    this.confirmationDetails.set(productsToConfirm);
    this.confirmationTotal.set(totalDue);
    this.confirmationPopupVisible.set(true);

    
    // this.productsArray().length = 1;
    // this.currentTotal.set(0);
    this.cdRef.detectChanges(); 

     
  }

  cancelInsert() {
    this.confirmationPopupVisible.set(false);
    this.pendingSaleEntry.set(null);
  }

  confirmInsert() {
    const entry = this.pendingSaleEntry();
    if (!entry) return;
  
    const products = this.confirmationDetails();
  
    const customer = this.customersObjectAvailables().find(c => c.name === entry.Customer);
    const subTotal = this.confirmationTotal();
    const taxAmt = 123; 
    
    const saleOrderDetails = products.map(p => ({
      salesOrderID: 75139,
      CarrierTrackingNumber: "XYZ123456",
      OrderQty: p.quantity,
      ProductId: this.productsObjectAvailables().find(prod => prod.name === p.product).productID,
      SpecialOfferId: 1,
      UnitPrice: p.unitPrice,
      UnitPriceDiscount: 0.00,
      LineTotal: p.total,
      ModifiedDate: new Date().toISOString(),
    }));
  
    const sale = {
      SalesOrderHeader: {
        salesOrderID: 75139,
        RevisionNumber: 1,
        OrderDate: new Date().toISOString(),
        DueDate: new Date().toISOString(),
        ShipDate: new Date().toISOString(),
        Status: 5,
        OnlineOrderFlag: true,
        SalesOrderNumber: entry.salesOrderNumber,
        PurchaseOrderNumber: entry.purchaseOrderNumber,
        AccountNumber: entry.accountNumber,
        CustomerID: customer.customerID,
        SalesPersonID: 279,
        TerritoryID: 6,
        BillToAddressID: 1074,
        ShipToAddressID: 921,
        ShipMethodID: 5,
        CreditCardID: 806,
        CreditCardApprovalCode: "1234Vi2345",
        CurrencyRateID: 4,
        SubTotal: subTotal,
        TaxAmt: taxAmt,
        Freight: 123,
        TotalDue: subTotal + taxAmt,
        Comment: entry.comment,
        ModifiedDate: new Date().toISOString(),
      },
      SalesOrderDetail: saleOrderDetails,
    };
  
    this.salesService.createSaleOrder(sale).subscribe(s => {
      notify("Added Successfully", "success", 3000);
      this.loadGridData();
      this.onFormClosed(); 
    });
    const grid = this.getGridInstance();
    grid.cancelEditData();
  
    this.confirmationPopupVisible.set(false);
    this.pendingSaleEntry.set(null);
  }

  addProduct(){
    console.log("Adding product to the form");
    this.productsArray().push({})
    console.log(this.productsArray())
    this.cdRef.detectChanges();
    //for refresh 
  }

  removeProduct() {
  if (this.productsArray().length === 1) return;
  const productDataField = "Product" + (this.productsArray().length);
  console.log(productDataField)
  const grid = this.getGridInstance();







  this.productsArray().pop();
  this.cdRef.detectChanges();

  }


  // onProductSelected = (e: any) => {
  //     console.log("Selected Product:", e);

  //     const gridInstance = this.dxDataGrid.instance as any;
  //     const selectedRowKeys = gridInstance.option("selectedRowKeys");
  //     const rowKey = selectedRowKeys.length ? selectedRowKeys[0] : null;
  //     const columnName = e.component.option("dataField");
  //     console.log(selectedRowKeys, rowKey, columnName);

  //     if (gridInstance && rowKey !== null && columnName) {
  //         let gridData = gridInstance.option("dataSource");

  //         let rowIndex = gridData.findIndex((row: any) => row.salesOrderID === rowKey);
  //         if (rowIndex !== -1) {
  //             gridData[rowIndex][columnName] = e.value;
  //             gridInstance.option("dataSource", gridData);
  //             gridInstance.refresh();
  //             console.log(`Updated ${columnName} in row ${rowIndex} with ${e.value}`);
  //         }
  //     }
  // };




  selectedProductValuesFunc = (index: number) => {
    return this.selectedProductValues()[index]
  }

  handleFieldChange(e: any) {
    console.log(e)
  }


  onFormClosed = () => {
    console.log("Form closed")
    this.selectedProductValues().length = 0;
    this.productsArray().length = 1;
    this.currentTotal.set(0);
    this.cdRef.detectChanges();
  }

  buttonOptions = signal(
    {
      icon: 'add',
      onClick: () => {
        this.addProduct();
      }
    }
  );

  removeButtonOptions = signal(
    {
      icon: 'trash',
      onClick: () => {
        this.removeProduct()
      }
    }
  );

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