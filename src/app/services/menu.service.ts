import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Menu, MenuRole } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private baseUrlMenus = 'http://localhost:5178/api/menus'; 

  constructor(private http: HttpClient) { }

  getMenus(): Observable<Menu[]>{
    return this.http.get<Menu[]>(this.baseUrlMenus).pipe(
      catchError(err => {
        console.error('Error fetching menus:', err);
        return of([]); 
      })
    );
  }

  createMenu(menu: Menu): Observable<Menu>{
    return this.http.post<Menu>(this.baseUrlMenus, menu).pipe(
      catchError(err => {
        console.error('Error creating menu:', err);
        return of(err);
      })
    );
  }

  deleteMenu(id: number): Observable<boolean>{
    return this.http.delete(this.baseUrlMenus+ "/" + id).pipe(
      map(() => true),
      catchError(err => {
        console.error('Error deleting menu from server:', err);
        return of(false);
      })
    );
  }

  updateMenu(menuToUpdate : Menu): Observable<Menu | undefined>{
    console.log('Updating menu:', menuToUpdate);
    return this.http.put<Menu>(this.baseUrlMenus + "/" + menuToUpdate.id, menuToUpdate).pipe(
      catchError(err => {
        console.error('Error updating menu:', err);
        return of(undefined); 
      })
    );
  }

  getMenuRoles(): Observable<any[]>{
    return this.http.get<MenuRole[]>(this.baseUrlMenus+"/"+"menu-roles").pipe( 
      catchError(err => {
        console.error('Error fetching menuRoles:', err);
        return of([]); 
      })
    );
  }

  createMenuRoles(){

  }



  updateMenuRoles(id: number, updatedMenu: { id: Number, canView: Boolean, canEdit: Boolean}): Observable<MenuRole[]> {

    return this.http.put<MenuRole[]>(`${this.baseUrlMenus}/menu-roles/${id}`, updatedMenu).pipe(
      catchError(err => {
        console.error(`Error updating the menu of id: ${id}`, err);
        return of([]);
      })
    );
    
  }
}