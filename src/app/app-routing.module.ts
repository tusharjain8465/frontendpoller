import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CentralNavigationComponent } from './central-navigation/central-navigation.component';

import { ClientManagementComponent } from './client-management/client-management.component';
import { SalesManagementComponent } from './sales-management/sales-management.component';
import { ProfitComponent } from './profit/profit.component';
import { ViewHistoryComponent } from './view-history/view-history.component';
import { ViewSalesComponent } from './view-sales/view-sales.component';
import { SendPdfComponent } from './send-pdf/send-pdf.component';
import { AddClientComponent } from './client-management/add-client/add-client.component';
import { ExistingClientsComponent } from './client-management/existing-clients/existing-clients.component';
import { ForgotPasswordComponent } from './auth/forgetpassword/forgetpassword.component';
import { AuthGuard } from './auth/auth.guard'; // 👈 Import the guard

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forget-password', component: ForgotPasswordComponent },

  // 👇 All protected with AuthGuard
  { path: 'central-navigation', component: CentralNavigationComponent, canActivate: [AuthGuard] },
  { path: 'client-management', component: ClientManagementComponent, canActivate: [AuthGuard] },
  { path: 'sales-management', component: SalesManagementComponent, canActivate: [AuthGuard] },
  { path: 'profit', component: ProfitComponent, canActivate: [AuthGuard] },
  { path: 'view-history', component: ViewHistoryComponent, canActivate: [AuthGuard] },
  { path: 'view-sales', component: ViewSalesComponent, canActivate: [AuthGuard] },
  { path: 'send-pdf', component: SendPdfComponent, canActivate: [AuthGuard] },
  { path: 'add-client', component: AddClientComponent, canActivate: [AuthGuard] },
  { path: 'existing-clients', component: ExistingClientsComponent, canActivate: [AuthGuard] },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
