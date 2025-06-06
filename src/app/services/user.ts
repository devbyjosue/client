// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';


// type user = {
//   id?: number;
//   name: string;
//   email: string;
//   voucher: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
  
//   constructor(private http: HttpClient) { }
  
//   baseUrl = "http://localhost:5178/api/users";
//   getUserHeaders(){
//     console.log("getting headers")
//     return ["Name", "Email", "Voucher"];
//   }

//   getUsers(){
//     return this.http.get(this.baseUrl);
//   }

//   getUserById(id: number){
//     return this.http.get(`${this.baseUrl}/${id}`);
//   }

//   createUser(user: user){
//     return this.http.post(this.baseUrl, user);
//   }

//   updateUser(user: user){
//     return this.http.put(`${this.baseUrl}/${user.id}`, user);
//   }

//   deleteUser(id: number){
//     return this.http.delete(`${this.baseUrl}/${id}`);
//   }
// }
