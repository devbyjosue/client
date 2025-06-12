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
export class Header implements OnInit {

  headerTitle = signal("" as string | null);
  
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        const urlSegments = currentUrl.split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];
        this.headerTitle.set(capitalize(lastSegment));
    });
  }

  navigateTo(route: string): void {
    console.log("Navigating to:", route);
    this.router.navigate([route], { relativeTo: this.route });
  
  }
}
