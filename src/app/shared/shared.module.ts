import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopInfoComponent } from './components/pop-info/pop-info.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomeBlogComponent } from '../pages/home/home-blog/home-blog.component';

@NgModule({
  declarations: [PopInfoComponent, HeaderComponent, FooterComponent, MenuComponent],
  exports: [HeaderComponent, FooterComponent, MenuComponent, IonicModule, CommonModule],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SharedModule {}
