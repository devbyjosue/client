import { Component, OnInit, signal } from '@angular/core';
import { DxButtonModule, DxDataGridModule} from 'devextreme-angular';


interface Product {
  ID: number;
  Name: string;
  Category: string;
  Price: number;
  InStock: boolean;
}

@Component({
  selector: 'app-home',
  imports: [DxButtonModule, DxDataGridModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

toggleAccess = signal(false);
isAuthenticated = signal(localStorage.getItem('isAuthenticated'));

ngOnInit(): void {

}

changeAccessStatus(status: boolean){
  if (this.isAuthenticated()){
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticated.set(null);
  }
  else{
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
    this.isAuthenticated.set(JSON.stringify(true));
    this.toggleAccess.set(status);
  }
}



}
