import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'angular2-color-picker';
import { DropdownModule } from "ng2-dropdown";
import { HttpModule } from '@angular/http';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { AppComponent } from './app.component/app.component';
import { GetJsonService } from './app.services/app.getJsonService';
import { EventService } from './app.services/app.eventService';
import { HttpCall } from './app.services/app.httpCalls';
import { DragDirective } from './app.directive/app.dragDirective';
import { ResizeShapeDirective } from './app.directive/app.resizeShape';
import { HandDrawingDirective } from './app.directive/app.freeHandDrawing';
import { RotateDirective } from './app.directive/app.rotateShape';
import { EraserDirective } from './app.directive/app.eraserDrawing';

@NgModule({
    imports: [BrowserModule, ColorPickerModule, FormsModule, HttpModule, Ng2DragDropModule.forRoot(), DropdownModule],
    declarations: [AppComponent, DragDirective, ResizeShapeDirective, EraserDirective, HandDrawingDirective, RotateDirective],
    providers: [GetJsonService, HttpCall, EventService],
    bootstrap: [AppComponent]
})
export class AppModule { }
