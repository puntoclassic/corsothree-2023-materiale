import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Scena2Component } from "src/app/scena2/scena2.component";
import { Scena4Component } from "src/app/scena4/scena4.component";
import { Scena6Component } from "src/app/scena6/scena6.component";

import { AppComponent } from "./app.component";

import { CoreComponent } from "./core/core.component";

@NgModule({
  declarations: [
    AppComponent,
    CoreComponent,
    Scena2Component,
    Scena4Component,
    Scena6Component,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
