"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var app_eventService_1 = require("../app.services/app.eventService");
var svgpath = require("svgpath");
var EraserDirective = (function () {
    function EraserDirective(eventService) {
        this.eventService = eventService;
        this.currentX = 0;
        this.currentY = 0;
    }
    EraserDirective.prototype.onmousedown = function (event) {
        if (!this.eraserinitiate && event.button != 2 && this.eventService.eraserStart) {
            this.eraserinitiate = true;
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    };
    EraserDirective.prototype.onmousemove = function (event) {
        var _this = this;
        if (this.eraserinitiate && this.eventService.selectedElement) {
            this.eventService.designData.forEach(function (element) {
                if (element.id == _this.eventService.selectedElement.id) {
                    var minX = _this.currentX;
                    var minY = _this.currentY;
                    var maxX = minX + 10;
                    var maxY = minY + 10;
                    var breakpoint = 0;
                    var newPath = svgpath(element.designDataPath).iterate(function (segment, index, x, y) {
                        if ((minX < segment[1] && segment[1] < maxX) && (minY < segment[2] && segment[2] < maxY)) {
                            segment = [];
                            breakpoint = 1;
                        }
                        else if (breakpoint == 1) {
                            segment[0] = "M";
                            breakpoint = 0;
                        }
                    });
                    element.designDataPath = newPath.toString();
                }
            });
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    };
    EraserDirective.prototype.onmouseup = function (event) {
        var _this = this;
        if (this.eraserinitiate) {
            this.eraserinitiate = false;
            // add element in undocontainer
            this.eventService.designData.forEach(function (element) {
                if (_this.eventService.selectedElement && element.shapeType == "freeHand" && element.id == _this.eventService.selectedElement.id) {
                    _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                }
            });
        }
    };
    return EraserDirective;
}());
__decorate([
    core_1.HostListener('mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EraserDirective.prototype, "onmousedown", null);
__decorate([
    core_1.HostListener('mousemove', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EraserDirective.prototype, "onmousemove", null);
__decorate([
    core_1.HostListener('mouseup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EraserDirective.prototype, "onmouseup", null);
EraserDirective = __decorate([
    core_1.Directive({
        selector: '[eraserDraw]'
    }),
    __metadata("design:paramtypes", [app_eventService_1.EventService])
], EraserDirective);
exports.EraserDirective = EraserDirective;
//# sourceMappingURL=app.eraserDrawing.js.map