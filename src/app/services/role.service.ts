import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Role } from '../../types'; // Assuming 'Role' type is in '../../types'

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrlRoles = 'http://localhost:5178/api/roles'; // Copied from info.ts
  private mockRoles: Role[] = [
    { id: 1, name: 'Admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Editor', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Viewer', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  private nextRoleId = 4;

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(this.baseUrlRoles).pipe( 
      catchError(err => {
        console.error('Error fetching roles:', err);
        return of([]); 
      })
    );
  }

  getRoleByName(name: string): Observable<Role|undefined > {
    return this.http.get<Role>(`${this.baseUrlRoles}/name/${name}`).pipe(
      map(role => {
        console.log(role)
        return role
      })
    );
  }
  
  createRole(newRole: Role): Observable<Role>{
    const roleWithId: Role = { 
        ...newRole, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
    };

    return this.http.post<Role>(this.baseUrlRoles, roleWithId).pipe(
      catchError(err => {
        console.error('Error creating role:', err);
        alert("Error creating role: It Already Exists");
        return of(err); // Or handle error appropriately
      })
    );
  }

  updateRole(roleToUpdate: Role): Observable<Role | undefined>{
    console.log('Updating role:', roleToUpdate);
   return this.http.put<Role>(this.baseUrlRoles + "/" + roleToUpdate.id, roleToUpdate).pipe(
    catchError(err => {
      console.error('Error updating role:', err);
      return of(undefined); // Or handle error appropriately
    })
   );
  }

  deleteRole(id: number): Observable<boolean>{ 
    return this.http.delete(this.baseUrlRoles+ "/" + id).pipe(
      map(() => true),
      catchError(err => {
        console.error('Error deleting role from server:', err);
        return of(false);
      })
    );
  }
}