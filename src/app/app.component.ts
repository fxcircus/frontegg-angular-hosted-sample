// app.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FronteggAppService, FronteggAuthService, ContextHolder } from '@frontegg/angular';
import { ITeamUserRole } from '@frontegg/rest-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = true;
  loadingSubscription: Subscription;
  user?: any;
  selectedTenantId: string = ''; // Initialize to an empty string

  constructor(
    private fronteggAuthService: FronteggAuthService,
    private fronteggAppService: FronteggAppService
  ) {
    this.loadingSubscription = fronteggAppService.isLoading$.subscribe((isLoading) => (this.isLoading = isLoading));
  }

  ngOnInit(): void {
    this.fronteggAuthService?.teamState$.subscribe((teamState) => {
      const newRoles: ITeamUserRole[] = teamState.roles.filter((role: ITeamUserRole) => role.name !== 'New');
      this.fronteggAuthService.setTeamState({ roles: newRoles });
    });

    this.fronteggAuthService?.user$.subscribe((user) => {
      this.user = user;
    });
  }

  switchTenant(): void {
    this.fronteggAuthService.switchTenant({ tenantId: this.selectedTenantId });
  }

  loginWithRedirect(): void {
    this.fronteggAuthService.loginWithRedirect({ prompt: 'login' });
  }

  loginToTenantX(): void {
    this.loginWithRedirectToTenant('36ad8775-ea37-4b60-8032-8738af07be87');
  }

  private loginWithRedirectToTenant(tenantId: string): void {
    console.log(`Logging in to Tenant ${tenantId}`);
    this.fronteggAuthService.loginWithRedirect({ tenantId: tenantId, prompt: 'login'});
  }

  logOut(): void {
    const baseUrl = ContextHolder.getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  refreshToken(): void {
    this.fronteggAuthService.requestAuthorize()
  }
}
