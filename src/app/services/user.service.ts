import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { user } from '../../types'; 
import notify from 'devextreme/ui/notify';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:44320/api/users';
  private mockUsers: user[] = [
    { id: 1, name: 'Alice Wonderland', voucher: 'VOUCHER001', roleName: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Bob The Builder', voucher: 'VOUCHER002', roleName: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Charlie Chaplin', voucher: 'VOUCHER003', roleName: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  private nextUserId = 4;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<user[]>{
    return this.http.get<user[]>(this.baseUrl,  { withCredentials: true }).pipe( 
      catchError(err => {
        console.error('Error fetching users:', err);
        return of([]); 
      })
    );
  }

  getUserById(id: number): Observable<user | undefined>{
    return of();
  }
  getUserByName(name: string): Observable<user>{
    return this.http.get<user>(this.baseUrl + "/name/"+ name,  { withCredentials: true }).pipe( 
      catchError(err => {
        console.error('Error fetching users:', err);
        return of(); 
      })
    );
  }

  getUserByvBadge(vBadge: string): Observable<user>{
    return this.http.get<user>(this.baseUrl + "/vBadge/"+ vBadge,  { withCredentials: true }).pipe( 
      catchError(err => {
        console.error('Error fetching auth user:', err);
        return of(); 
      })
    );
  }

  createUser(newUser: user | any): Observable<user>{
    const userWithId: user = { 
        ...newUser, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
    };

    return this.http.post<user>(this.baseUrl, userWithId,  { withCredentials: true }).pipe(
      catchError(err => {
        notify("User Already Exists", "error", 3000)
        throw err; 
      })
    );
  }

  updateUser(userToUpdate: user | any): Observable<user | undefined>{
   return this.http.put<user>(`${this.baseUrl}/${userToUpdate.id}`, userToUpdate,  { withCredentials: true }).pipe(
    catchError(err => {
      console.error('Error updating user:', err);
      throw err;
    })
   );
  }

  deleteUser(id: number): Observable<boolean>{ 
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`,  { withCredentials: true }).pipe(
      map(() => true), 
      catchError(err => {
        console.error('Error deleting User from server:', err);
        return of(false); 
      })
    );
  }
}