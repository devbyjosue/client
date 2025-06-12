import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { user } from '../../types'; // Assuming 'user' type is in '../../types'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:5178/api/users'; // Copied from info.ts
  private mockUsers: user[] = [
    { id: 1, name: 'Alice Wonderland', voucher: 'VOUCHER001', roleName: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Bob The Builder', voucher: 'VOUCHER002', roleName: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Charlie Chaplin', voucher: 'VOUCHER003', roleName: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  private nextUserId = 4;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<user[]>{
    return this.http.get<user[]>(this.baseUrl).pipe( 
      catchError(err => {
        console.error('Error fetching users:', err);
        return of([]); 
      })
    );
  }

  getUserById(id: number): Observable<user | undefined>{
    // const user = this.mockUsers.find(u => u.id === id);
    return of();
  }
  getUserByName(name: string): Observable<user>{
    return this.http.get<user>(this.baseUrl + "/name/"+ name).pipe( 
      catchError(err => {
        console.error('Error fetching users:', err);
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

    return this.http.post<user>(this.baseUrl, userWithId).pipe(
      catchError(err => {
        alert("Error creating user: It Already Exists");
        throw err; // Re-throw the error to be caught by the subscriber if needed
      })
    );
  }

  updateUser(userToUpdate: user | any): Observable<user | undefined>{
   return this.http.put<user>(`${this.baseUrl}/${userToUpdate.id}`, userToUpdate).pipe(
    catchError(err => {
      console.error('Error updating user:', err);
      throw err;
    })
   );
  }

  deleteUser(id: number): Observable<boolean>{ 
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`).pipe(
      map(() => true), // If delete is successful, map to true
      catchError(err => {
        console.error('Error deleting User from server:', err);
        return of(false); // On error, return an observable of false
      })
    );
  }
}