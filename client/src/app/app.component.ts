import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarVisible = false;

  onToggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
