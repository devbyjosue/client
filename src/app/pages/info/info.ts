import { Component, Input, OnInit, signal } from '@angular/core';
import { Table } from '../../components/table/table';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Role, TableData, user } from '../../../types';
import { rolesHeaders, sections, subSections, usersHeaders } from '../../../mocks';
import { TableForm } from "../../components/table-form/table-form";



@Component({
  selector: 'app-info',
  imports: [Table, CommonModule, HttpClientModule, TableForm],
  templateUrl: './info.html',
  styleUrl: './info.css'
})
export class Info implements OnInit {

  sectionSignal = signal("" as string | null);
  formSignal = signal(false);
  editDataSignal = signal(null as any);
  isFormToEdit = signal(true);

  tableDataInput = {
    headers: [''],
    data: ['']
  } as any | null

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
    ) {}

  ngOnInit(): void {

    // const currentRouteArray = this.router.url.split('/');
    // const section = currentRouteArray[1];
    // const subSection = currentRouteArray[2];

    //   this.sectionSignal.set(section);
      
    //   this.getTableData(section,subSection, (tableData) => {
    //    this.tableDataInput = tableData;
    //    });
    // this.route.url.forEach(url => {
    //   const section = url[0].path;
    //   const subSection = url[1].path;

    //   this.sectionSignal.set(section);
      
    //   this.getTableData(section,subSection, (tableData) => {
    //    this.tableDataInput = tableData;
    //    });
    // });

    
    this.route.paramMap.subscribe(params => {
      const section = params.get('section');
      const subSection = params.get('subSection');
      this.sectionSignal.set(section);
      
      this.getTableData(section,subSection, (tableData) => {
       this.tableDataInput = tableData;
       });

    });
  }

  
getTableData(tableName: any,
  subSection: any, 
  callback: (data: any) => void): void {

 if (!tableName) return;
 if (!subSection) return;

  if ((tableName in sections)) return;
  if ((subSection in subSections)) return;
  
  switch(subSection){
    case "users": {
        const tableHeaders = this.getUserHeaders();

        this.getUsers().subscribe(users => {
          const formattedData = users.map(user => [user.name, user.voucher, user.roleId, user.createdAt, user.updatedAt]);
            callback({
              headers: tableHeaders,
              data: formattedData
          });
        });
        break;
    }
    case "roles": {
      const tableHeaders = this.getRoleHeaders();
      
      this.getRoles().subscribe(roles => {
          const formattedData = roles.map(role => [role.name, role.createdAt, role.updatedAt]);
            callback({
                headers: tableHeaders,
                data: formattedData
            });
          });
          break;
        }

  }


 
}

openForm(command: boolean){
  this.formSignal.set(!command);
}

submitForm(entry: any){
  console.log("HELLO",entry);
  
  if (entry.table === "users"){
    const postUser: user = {
      name: entry.value1,
      voucher: entry.value2,
      roleId: parseInt(entry.value3),
    }
    this.createUser(postUser);
  }
  if (entry.table === "roles"){
    console.log("ROL");
    const postRole: Role = {
      name: entry.value1,
    }
    this.createRoles(postRole);
  }
}



  
  baseUrl = "http://localhost:5178/api/users";
  baseUrlRoles = "http://localhost:5178/api/roles";


  // FORM ACTIONS
  deleteAction(data: any){
     this.route.paramMap.subscribe(params => {
      const section = params.get('section');
      const subSection = params.get('subSection');
      
      if (subSection === "users"){
        this.deleteUser(data[0]);
      }
      if (subSection === "roles"){
        this.deleteRole(data[0]);
      }
      console.log(data[0]);
      // this.deleteRole(data[0]);

    });
  }
  editAction(data: any){

    console.log(data[0]);
    this.isFormToEdit.set(true);
    this.formSignal.set(true);
    this.editDataSignal.set(data);


    // this.route.paramMap.subscribe(params => {
    //   const section = params.get('section');
    //   const subSection = params.get('subSection');
      
    //   if (subSection === "users"){
    //     this.updateUser(data);
    //   }
    //   if (subSection === "roles"){
    //     this.updateRole(data);
    //   }
    //   console.log(data[0]);

    // });
  }


  getUserHeaders(){
    return usersHeaders;
  }

  getUsers(): Observable<user[]>{
    return this.http.get<user[]>(this.baseUrl)
  }

  getUserById(id: number){
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createUser(user: user){
    return this.http.post(this.baseUrl, user).subscribe(data => {
      console.log(data);
      window.location.reload();
    });
  }

  updateUser(user: user){
    return this.http.put(`${this.baseUrl}/${user.id}`, user);
  }

  deleteUser(name: string){
    return this.http.delete(`${this.baseUrl}/name/${name}`).subscribe(data => {
      console.log(data);
      window.location.reload();
    });
  }

  getRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(this.baseUrlRoles)
  }
  
  getRoleHeaders(){
    return rolesHeaders;
  }

  createRoles(role: Role){
    return this.http.post(this.baseUrlRoles, role).subscribe(data => {
      console.log(data);
      this.reloadComponent();
    });
  }
  deleteRole(name: string){
    return this.http.delete(`${this.baseUrlRoles}/name/${name}`).subscribe(data => {
      console.log(data);
      this.reloadComponent();
    });
  }
  updateRole(role: Role){
    return this.http.put(`${this.baseUrlRoles}/name/${role.name}`, role).subscribe(data => {
      console.log(data);
      this.reloadComponent();
    });
  }

  reloadComponent() {

    window.location.reload();
    // this.route.paramMap.subscribe(params => {
      
    //     this.router.navigateByUrl(this.router.url).then(() => {
    //     this.router.navigate([this.router.url]);
    //   });
    // });

     
    }

}
