import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, AsyncPipe, MatIconModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  displayName: string | null = null;
  unreadCount: number = 0;

  loggedIn$!: ReturnType<AuthService['loggedIn$']['pipe']>;
  role$!: ReturnType<AuthService['role$']['pipe']>;

  private subs = new Subscription();

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggedIn$ = this.authService.loggedIn$;
    this.role$ = this.authService.role$;
    this.displayName = this.authService.getFullName() || this.authService.getEmail();

    this.subs.add(
      this.notificationService.unreadCount.subscribe(count => this.unreadCount = count)
    );

    if (this.authService.isLoggedIn()) {
      this.notificationService.refreshCount(this.authService.getUserId());
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
