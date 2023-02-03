import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Materiale4Component } from "src/app/materiale4/materiale4.component";

import { AppComponent } from "./app.component";
import { Materiale1Component } from "./materiale1/materiale1.component";
import { Materiale2Component } from "./materiale2/materiale2.component";
import { Materiale3Component } from "./materiale3/materiale3.component";
import { CoreComponent } from "./core/core.component";
import { Materiale5Component } from "./materiale5/materiale5.component";
import { Materiale6Component } from "src/app/materiale6/materiale6.component";
import { Materiale7Component } from "src/app/materiale7/materiale7.component";
import { Materiale8Component } from "src/app/materiale8/materiale8.component";
import { Materiale9Component } from "src/app/materiale9/materiale9.component";
import { Materiale10Component } from "src/app/materiale10/materiale10.component";

@NgModule({
  declarations: [
    AppComponent,
    CoreComponent,
    Materiale1Component,
    Materiale2Component,
    Materiale3Component,
    Materiale4Component,
    Materiale5Component,
    Materiale6Component,
    Materiale7Component,
    Materiale8Component,
    Materiale9Component,
    Materiale10Component,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
