import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification, UnreadCountResponse } from '../../shared/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = environment.apiUrl;

  private unreadCount$ = new BehaviorSubject<number>(0);
  unreadCount = this.unreadCount$.asObservable();

  constructor(private http: HttpClient) {}

  getMyNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/api/notifications/user/${userId}`);
  }

  getUnreadCount(userId: number): Observable<UnreadCountResponse> {
    return this.http.get<UnreadCountResponse>(
      `${this.apiUrl}/api/notifications/user/${userId}/unread-count`
    ).pipe(tap(res => this.unreadCount$.next(res.unreadCount)));
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/api/notifications/${id}/read`, {}).pipe(
      tap(() => this.unreadCount$.next(Math.max(0, this.unreadCount$.value - 1)))
    );
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/api/notifications/user/${userId}/read-all`, {}
    ).pipe(tap(() => this.unreadCount$.next(0)));
  }

  refreshCount(userId: number): void {
    this.getUnreadCount(userId).subscribe({ error: () => {} });
  }
}
