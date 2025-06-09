import { Component, Input, OnInit, signal } from '@angular/core';
import { Table } from '../../components/table/table'; // Removed Table component
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Role, TableData, user } from '../../../types';
import { rolesHeaders, sections, subSections, usersHeaders } from '../../../mocks';
import { TableForm } from "../../components/table-form/table-form";
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular'; // Added DevExtreme imports
import { capitalize } from '../../../utils/capitalize';


@Component({
  selector: 'app-info',
  // Removed Table from imports, Added DxDataGridModule, DxButtonModule
  imports: [CommonModule, HttpClientModule, TableForm, DxDataGridModule, DxButtonModule],
  templateUrl: './info.html',
  styleUrl: './info.css'
})
export class Info implements OnInit {

  // Mock data
  private mockUsers: user[] = [
    { id: 1, name: 'Alice Wonderland', voucher: 'VOUCHER001', roleId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Bob The Builder', voucher: 'VOUCHER002', roleId: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Charlie Chaplin', voucher: 'VOUCHER003', roleId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  private nextUserId = 4;

  private mockRoles: Role[] = [
    { id: 1, name: 'Admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Editor', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Viewer', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
  private nextRoleId = 4;

  sectionSignal = signal("" as string | null);
  subSectionSignal = signal("" as string | null); // Added for easier access in template
  formSignal = signal(false);

  // Adjusted for DxDataGrid: dataSource will hold the array of objects directly
  dataSource: any[] = []; 
  // columnHeaders will be used to configure DxDataGrid columns
  columnConfigurations: any[] = []; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, // Keep for potential future use
    private router: Router
    ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const section = params.get('section');
      const subSection = params.get('subSection');
      this.sectionSignal.set(section);
      this.subSectionSignal.set(subSection);
      this.loadGridData(subSection);
    });
  }

  loadGridData(subSection: string | null): void {
    if (!subSection) return;

    if (subSection === "users") {
        this.getUsers().subscribe(users => {
          this.dataSource = users;
          // Define column configurations for users
          this.columnConfigurations = [
            { dataField: 'id', caption: 'ID', visible: false }, // Hide ID by default, but useful for operations
            { dataField: 'name', caption: 'Name' },
            { dataField: 'voucher', caption: 'Voucher' },
            { dataField: 'roleId', caption: 'Role ID' },
            { dataField: 'createdAt', caption: 'Created At', dataType: 'datetime' },
            { dataField: 'updatedAt', caption: 'Updated At', dataType: 'datetime' },
            { type: 'buttons', buttons: ['edit', 'delete'] } // Add command buttons
          ];
        });
    } else if (subSection === "roles") {
      this.getRoles().subscribe(roles => {
          this.dataSource = roles;
          // Define column configurations for roles
          this.columnConfigurations = [
            { dataField: 'id', caption: 'ID', visible: false },
            { dataField: 'name', caption: 'Name' },
            { dataField: 'createdAt', caption: 'Created At', dataType: 'datetime' },
            { dataField: 'updatedAt', caption: 'Updated At', dataType: 'datetime' },
            { type: 'buttons', buttons: ['edit', 'delete'] }
          ];
        });
    }
  }

  capitalize = capitalize;

  // getTableData is replaced by loadGridData and direct dataSource binding
  // The old getTableData can be removed or commented out if no longer needed by other parts.

  openForm(isEditing = false, data: any = null){
    this.formSignal.set(true);
  }

  closeTheForm(){
    this.formSignal.set(false);
  }

  submitForm(entry: any){
    console.log("Form submitted with entry:", entry);
    const currentSubSection = this.subSectionSignal();

  
        if (currentSubSection === "users"){
            const newUser: user = {
                id: this.nextUserId++,
                name: entry.value1,
                voucher: entry.value2,
                roleId: parseInt(entry.value3),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };


            this.mockUsers.unshift(newUser);
            this.dataSource = [...this.mockUsers]; // Update dataSource to trigger UI refresh
            console.log('User created and added to array:', newUser);
            this.closeTheForm();
        } else if (currentSubSection === "roles"){
            const newRole: Role = {
                id: this.nextRoleId++,
                name: entry.value1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.mockRoles.unshift(newRole);
            this.dataSource = [...this.mockRoles]; 
            console.log('Role created and added to array:', newRole);
            this.closeTheForm();
        }
    
  }
  
  baseUrl = "http://localhost:5178/api/users";
  baseUrlRoles = "http://localhost:5178/api/roles";

  onRowUpdating(e: any) {
    
    console.log('Row updating:', e);
  }

  onRowRemoving(e: any) {
    console.log('Row removing:', e.data); 
    const currentSubSection = this.subSectionSignal();
    const idToDelete = e.data.id; 

    if (!idToDelete) {
        console.error('Cannot delete item without ID');
        e.cancel = true; 
        return;
    }

    if (currentSubSection === "users"){
        this.deleteUser(idToDelete).subscribe(success => {
            if (success) {
                console.log('User deleted successfully from mock');
            } else {
                console.error('Failed to delete user from mock');
            }
        });
    } else if (currentSubSection === "roles"){
        this.deleteRole(idToDelete).subscribe(success => {
            if (success) {
                console.log('Role deleted successfully from mock');
            } else {
                console.error('Failed to delete role from mock');
                e.cancel = true;
            }
        });
    }
   
  }
  
  

  getUserHeaders(){
    return usersHeaders; 
  }

  getUsers(): Observable<user[]>{
    // return this.http.get<user[]>(this.baseUrl)
    return of(this.mockUsers);
  }

  getUserById(id: number): Observable<user | undefined>{
    // return this.http.get(`${this.baseUrl}/${id}`);
    const user = this.mockUsers.find(u => u.id === id);
    return of(user);
  }

  createUser(newUser: user): Observable<user>{
    const userWithId: user = { 
        ...newUser, 
        id: this.nextUserId++, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
    };
    this.mockUsers.push(userWithId);
    console.log('Created user (mock):', userWithId);
    // window.location.reload(); // Replaced with loadGridData
    return of(userWithId);
  }

  updateUser(userToUpdate: user): Observable<user | undefined>{
    const index = this.mockUsers.findIndex(u => u.id === userToUpdate.id);
    if (index !== -1) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...userToUpdate, updatedAt: new Date().toISOString() };
      console.log('Updated user (mock):', this.mockUsers[index]);
      return of(this.mockUsers[index]);
    }
    console.error('User not found for update (mock):', userToUpdate);
    return of(undefined); 
  }

  deleteUser(id: number): Observable<boolean>{ // Changed identifier to id: number for clarity
    const initialLength = this.mockUsers.length;
    this.mockUsers = this.mockUsers.filter(u => u.id !== id);
    if (this.mockUsers.length < initialLength) {
        console.log('Deleted user (mock) with id:', id);
        return of(true);
    }
    console.error('User not found for deletion (mock) with id:', id);
    return of(false);
  }

  getRoles(): Observable<Role[]>{
    // return this.http.get<Role[]>(this.baseUrlRoles)
    return of(this.mockRoles);
  }
  
  getRoleHeaders(){
    return rolesHeaders; // Still can be used for reference
  }

  getRoleById(id: number): Observable<Role | undefined>{
    // return this.http.get(`${this.baseUrlRoles}/${id}`);
    const role = this.mockRoles.find(r => r.id === id);
    return of(role);
  }

  createRoles(newRole: Role): Observable<Role>{
    const roleWithId: Role = { 
        ...newRole, 
        id: this.nextRoleId++, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
    };
    this.mockRoles.push(roleWithId);
    console.log('Created role (mock):', roleWithId);
    // window.location.reload(); // Replaced with loadGridData
    return of(roleWithId);
  }

  updateRole(roleToUpdate: Role): Observable<Role | undefined>{
    const index = this.mockRoles.findIndex(r => r.id === roleToUpdate.id);
    if (index !== -1) {
      this.mockRoles[index] = { ...this.mockRoles[index], ...roleToUpdate, updatedAt: new Date().toISOString() };
      console.log('Updated role (mock):', this.mockRoles[index]);
      return of(this.mockRoles[index]);
    }
    console.error('Role not found for update (mock):', roleToUpdate);
    return of(undefined);
  }

  deleteRole(id: number): Observable<boolean>{ // Changed identifier to id: number for clarity
    const initialLength = this.mockRoles.length;
    this.mockRoles = this.mockRoles.filter(r => r.id !== id);
    if (this.mockRoles.length < initialLength) {
        console.log('Deleted role (mock) with id:', id);
        return of(true);
    }
    console.error('Role not found for deletion (mock) with id:', id);
    return of(false);
  }
}
