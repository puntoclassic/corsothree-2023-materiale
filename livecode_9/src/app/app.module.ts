import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Scena1Component } from "src/app/scena1/scena1.component";
import { Scena2Component } from "src/app/scena2/scena2.component";
import { Scena3Component } from "src/app/scena3/scena3.component";
import { Scena4Component } from "src/app/scena4/scena4.component";
import { Scena5Component } from "src/app/scena5/scena5.component";
import { Scena6Component } from "src/app/scena6/scena6.component";

import { AppComponent } from "./app.component";

import { CoreComponent } from "./core/core.component";

@NgModule({
  declarations: [
    AppComponent,
    CoreComponent,
    Scena1Component,
    Scena2Component,
    Scena3Component,
    Scena4Component,
    Scena5Component,
    Scena6Component,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
