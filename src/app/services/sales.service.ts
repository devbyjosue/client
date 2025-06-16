import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseUrlSales = 'http://localhost:5178/api/sales'; 

  constructor(private http: HttpClient) { }

  getSalesOrdersHeaders(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrlSales).pipe( 
      catchError(err => {
        console.error("Error fetching sales order headers:", err);
        return of([]); 
      })
    );
  }

  getSalesOrderDetails(salesOrderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlSales}/details/${salesOrderId}`).pipe(
      catchError(err => {
        console.error(`Error fetching sales order details for ID ${salesOrderId}:`, err);
        return of([]);
      })
    );
  }

  createSaleOrder(saleOrder: any): Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrlSales}`, saleOrder).pipe(
      catchError(err => {
        console.error(`Error creating SaleOrder ${saleOrder}`, err);
        return of([]);
      })
    )
  }

  deleteSaleOrder(saleOrderId: number): Observable<any[]>{
    return this.http.delete<any[]>(`${this.baseUrlSales + '/' + saleOrderId}`).pipe(
      catchError(err => {
        console.error(`Error deleting SaleOrder ${saleOrderId}`, err);
        return of([]);
      })
    )
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlSales}/products`).pipe(
      catchError(err => {
        console.error(`Error fetching products`, err);
        return of([]);
      })
    );
  }

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlSales}/customers`).pipe(
      catchError(err => {
        console.error(`Error fetching customers`, err);
        return of([])
      })
    )
  }
}