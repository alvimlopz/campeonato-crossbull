import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const autorizado = localStorage.getItem('acesso') === 'ok';
    if (!autorizado) this.router.navigate(['/acesso']);
    return autorizado;
  }
}
