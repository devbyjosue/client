import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private baseUrl =  'https://localhost:44320/api/auth';

  constructor(private http: HttpClient) { }



  getAuthUser(): Observable<any>{
      return this.http.get<any>(this.baseUrl,  { withCredentials: true }).pipe( 
        catchError(err => {
          console.error('Error fetching userdId:', err);
          return of(null);
        })
      );
    }
}
