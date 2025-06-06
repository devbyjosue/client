import { Component, EventEmitter, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  isSidebarOpen = signal(false);
  toggleSidebar(command: boolean){
    this.isSidebarOpen.set(command);
  }
  handleSidebarToggle(event: any){
    this.isSidebarOpen.set(event);
  }
}
