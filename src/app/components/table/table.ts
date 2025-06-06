import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';


@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  @Input() tableDataInput: any | undefined | null = null;
  @Output() deleteAction = new EventEmitter<any>();
  @Output() editAction = new EventEmitter<any>();


  constructor() { }

  deleteRow(data: any){
    this.deleteAction.emit(data);
  }
  editRow(data: any){
    this.editAction.emit(data);
  }

}
