import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MareFasulloComponent } from './mare-fasullo/mare-fasullo.component';
import { CuboConBordiComponent } from './cubo-con-bordi/cubo-con-bordi.component';

@NgModule({
  declarations: [
    AppComponent,
    MareFasulloComponent,
    CuboConBordiComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
