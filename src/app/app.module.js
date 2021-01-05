"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var angular2_color_picker_1 = require("angular2-color-picker");
var ng2_dropdown_1 = require("ng2-dropdown");
var http_1 = require("@angular/http");
var ng2_drag_drop_1 = require("ng2-drag-drop");
var app_component_1 = require("./app.component/app.component");
var app_getJsonService_1 = require("./app.services/app.getJsonService");
var app_eventService_1 = require("./app.services/app.eventService");
var app_httpCalls_1 = require("./app.services/app.httpCalls");
var app_dragDirective_1 = require("./app.directive/app.dragDirective");
var app_resizeShape_1 = require("./app.directive/app.resizeShape");
var app_freeHandDrawing_1 = require("./app.directive/app.freeHandDrawing");
var app_rotateShape_1 = require("./app.directive/app.rotateShape");
var app_eraserDrawing_1 = require("./app.directive/app.eraserDrawing");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, angular2_color_picker_1.ColorPickerModule, forms_1.FormsModule, http_1.HttpModule, ng2_drag_drop_1.Ng2DragDropModule.forRoot(), ng2_dropdown_1.DropdownModule],
        declarations: [app_component_1.AppComponent, app_dragDirective_1.DragDirective, app_resizeShape_1.ResizeShapeDirective, app_eraserDrawing_1.EraserDirective, app_freeHandDrawing_1.HandDrawingDirective, app_rotateShape_1.RotateDirective],
        providers: [app_getJsonService_1.GetJsonService, app_httpCalls_1.HttpCall, app_eventService_1.EventService],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map