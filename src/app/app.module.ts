import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Add this
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



// Import your components here
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CentralNavigationComponent } from './central-navigation/central-navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AddClientComponent } from './client-management/add-client/add-client.component';
import { ExistingClientsComponent } from './client-management/existing-clients/existing-clients.component';
import { SalesManagementComponent } from './sales-management/sales-management.component'; // ✅ Import this
import { ProfitComponent } from './profit/profit.component';
import { ViewHistoryComponent } from './view-history/view-history.component';
import { ViewSalesComponent } from './view-sales/view-sales.component';
import { SendPdfComponent } from './send-pdf/send-pdf.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './auth/forgetpassword/forgetpassword.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CentralNavigationComponent,
    AddClientComponent,
    ExistingClientsComponent,
    SalesManagementComponent, // ✅ Add this
    ProfitComponent,
    ViewHistoryComponent,
    ViewSalesComponent,
    SendPdfComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
