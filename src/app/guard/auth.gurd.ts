// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    // auth.guard.ts
    canActivate(): boolean {
        const loggedIn = this.authService.isLoggedIn();
        console.log("AuthGuard - loggedIn:", loggedIn);
        if (!loggedIn) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }



}
