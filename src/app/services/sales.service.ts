import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseUrlSales = 'http://localhost:5178/api/sales'; // Copied from info.ts

  constructor(private http: HttpClient) { }

  getSalesOrdersHeaders(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrlSales).pipe( 
      catchError(err => {
        console.error("Error fetching sales order headers:", err);
        return of([]); 
      })
    );
  }
}