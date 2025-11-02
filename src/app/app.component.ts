import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { DisplayComponent } from './display/display.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgIf,
    DisplayComponent,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  host: {
    class: 'mat-app-background'
  },
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Revision';
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
