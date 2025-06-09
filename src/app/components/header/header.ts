import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { capitalize } from '../../../utils/capitalize';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit{

  headerTitle = signal("" as string | null);
  
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
  this.router.events
 .pipe(filter(event => event instanceof NavigationEnd))
 .subscribe(() => {
 let currentRoute = this.route.root;
 while (currentRoute.firstChild) {
 currentRoute = currentRoute.firstChild;
 }
      currentRoute.paramMap.subscribe(params => {
          const section = params.get('section');
          const subSection = params.get('subSection');
          const concat = capitalize(section) + " " + capitalize(subSection);
          this.headerTitle.set(concat);
});
 });
 }


 navigateTo(route: string): void {
  console.log("Navigating to:", route);
  this.router.navigate([route], { relativeTo: this.route });
  // this.headerTitle.set(null);
  // window.scrollTo(0, 0);

 }
}
