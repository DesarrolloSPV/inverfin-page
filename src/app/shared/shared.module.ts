import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopInfoComponent } from './components/pop-info/pop-info.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { MenuComponent } from './components/menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsFabComponent } from './components/buttons-fab/buttons-fab.component';
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { PopServicesComponent } from './components/pop-services/pop-services.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    PopInfoComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    ContactFormComponent,
    ButtonsFabComponent,
    PopServicesComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    IonicModule,
    CommonModule,
    ContactFormComponent,
    ButtonsFabComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class SharedModule {}
