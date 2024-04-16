import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FronteggAppService, FronteggAuthService, ContextHolder } from '@frontegg/angular';
import { ITeamUserRole, setTabTenantInSessionStorage } from '@frontegg/rest-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = true;
  loadingSubscription: Subscription;
  user?: any;
  selectedTenantId: string = '';
  tenantState?: any;

  constructor(
    private fronteggAuthService: FronteggAuthService,
    private fronteggAppService: FronteggAppService
  ) {
    this.loadingSubscription = this.fronteggAppService.isLoading$.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
  }

  ngOnInit(): void {
    this.fronteggAuthService.teamState$.subscribe((teamState) => {
      const newRoles: ITeamUserRole[] = teamState.roles.filter((role: ITeamUserRole) => role.name !== 'New');
      this.fronteggAuthService.setTeamState({ roles: newRoles });
    });

    this.fronteggAuthService.user$.subscribe((user) => {
      this.user = user;
    });

    this.fronteggAuthService.loadTenants();
    this.fronteggAuthService.tenantsState$.subscribe((tenants) => {
      this.tenantState = tenants;
      console.log('Tenant State Loaded:', this.tenantState);  // Log tenant state after loading
    });
  }

  switchTenant(): void {
    console.log('Switching to Tenant ID:', this.selectedTenantId);  // Log the tenant ID on switch
    this.fronteggAuthService.switchTenant({ tenantId: this.selectedTenantId });
  }

  loginWithRedirect(): void {
    this.fronteggAuthService.loginWithRedirect({ prompt: 'login' });
  }

  loginToTenantX(): void {
    this.loginWithRedirectToTenant('your-tenant-id');
  }

  private loginWithRedirectToTenant(tenantId: string): void {
    console.log(`Logging in to Tenant ${tenantId}`);
    this.fronteggAuthService.loginWithRedirect({ tenantId, prompt: 'login' });
  }

  logOut(): void {
    setTabTenantInSessionStorage("");
    const baseUrl = ContextHolder.getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  refreshToken(): void {
    this.fronteggAuthService.requestAuthorize();
  }
}
