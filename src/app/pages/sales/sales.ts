import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule , 
  DxFormModule, DxTextBoxModule, DxPopupModule, 
  DxFormComponent} from 'devextreme-angular';
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

  isFormPopupVisible = signal(false);
  formData = signal<any>({});
  currentSelectedProduct = signal<any>(null)
  currentSelectedQuantity = signal<number>(1)



  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;
  @ViewChild('dxForm', { static: false }) dxForm!: DxFormComponent;

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
          { dataField: 'Product2', caption: 'Product 3', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product3', caption: 'Product 4', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product4', caption: 'Product 5', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product5', caption: 'Product 6', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product6', caption: 'Product 7', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product7', caption: 'Product 8', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product8', caption: 'Product 9', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product9', caption: 'Product 10', visible: false, alignment: 'left', headerAlignment: 'left' },
          { dataField: 'Product10', caption: 'Product 11', visible: false, alignment: 'left', headerAlignment: 'left' },

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
        if (products.length === 0) products = [
          {productID:  1, name: "Product A", standardCost: 100 },
          {productID:  2, name: "Product B", standardCost: 200 },
        ];
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

    openAddForm(): void {
      // this.productsArray.set([{}]); 
      this.formData.set({});
      this.isFormPopupVisible.set(true);
  }
  cancelForm(): void {
    this.isFormPopupVisible.set(false);
    this.confirmationDetails().length = 0;
    this.confirmationTotal.set(0);
    } 

    
    handleFormSubmit(event: any): void {
      event.preventDefault();
      const validation = this.dxForm.instance.validate();
      if (!validation.isValid) return;
      const entryData = this.formData();

      this.pendingSaleEntry.set(entryData);
      console.log(entryData)
      // console.log(this.confirmationDetails())
      // console.log(this.confirmationTotal())
      
      const products = this.productsObjectAvailables().filter(p => {
        return this.confirmationDetails().find(c => c.product === p.name)
      })
      console.log(products)

      const customer = this.customersObjectAvailables().find(c => c.name === event.Customer);
      const subTotal = this.confirmationTotal();
      const taxAmt = 123; 
      
      const saleOrderDetails = products.map(p => ({
        salesOrderID: 75139,
        CarrierTrackingNumber: "XYZ123456",
        OrderQty: p.quantity,
        ProductId: this.productsObjectAvailables().find(prod => prod.name === p.name).productID,
        SpecialOfferId: 1,
        UnitPrice: p.unitPrice,
        UnitPriceDiscount: 0.00,
        LineTotal: p.total,
        ModifiedDate: new Date().toISOString(),
      }));

      console.log(saleOrderDetails)

      // const productsToConfirm = this.productsArray().map((_, index) => {
      //     const productNameFull = entryData[`Product${index}`];
      //     const quantity = entryData[`Quantity${index}`];
      //     if (!productNameFull || !quantity) return null;

      //     const productName = String(productNameFull).split(" - $")[0];
      //     const product = this.productsObjectAvailables().find(p => p.name === productName);
      //     return {
      //         product: product.name, productId: product.productID, quantity: parseInt(quantity, 10),
      //         unitPrice: product.standardCost, total: parseInt(quantity, 10) * product.standardCost,
      //     };
      // }).filter(p => p !== null);

      // if (productsToConfirm.length === 0) {
      //     notify("Please select at least one product.", "error", 3000);
      //     return;
      // }

      // this.confirmationDetails.set(productsToConfirm as any[]);
      // this.confirmationTotal.set(productsToConfirm.reduce((sum, p) => sum + p.total, 0));
      // this.confirmationPopupVisible.set(true);
    }


  capitalize = capitalize;


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
      ProductId: this.productsObjectAvailables().find(prod => prod.name === p.name).productID,
      SpecialOfferId: 1,
      UnitPrice: p.unitPrice,
      UnitPriceDiscount: 0.00,
      LineTotal: p.total || 0,
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
    const productName = this.currentSelectedProduct()//'placeholder';
    const quantity = this.currentSelectedQuantity()//1;
    
    //obtain the rest of the product object by name and add to it the quantity
    const product = this.productsObjectAvailables().find(p => p.name === productName);
    console.log(product)

    const productToPush = {
      product: product.name, 
      quantity: quantity,
      unitPrice: product.standardCost,
      total: quantity * product.standardCost,
    }
    this.confirmationTotal.set(this.confirmationTotal() + productToPush.total)

    console.log("Adding product to the form");
    this.confirmationDetails().push(productToPush)
    console.log(this.confirmationDetails())
    this.cdRef.detectChanges();
  }

  removeProduct() {
  if (this.productsArray().length === 1) return;
  const productDataField = "Product" + (this.productsArray().length);
  console.log(productDataField)
  const grid = this.getGridInstance();







  this.productsArray().pop();
  this.cdRef.detectChanges();

  }

  onProductValueChanged = (e:any) => {
    this.currentSelectedProduct.set(e.value);
  }
  // onQuantityValueChanged(e:any){
  //   this.currentSelectedQuantity.set(e.value);
  // }
  onQuantityValueChanged = (e:any) => {
    this.currentSelectedQuantity.set(e.value);
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