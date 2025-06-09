import { Component } from '@angular/core';
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
export class Home {



}
