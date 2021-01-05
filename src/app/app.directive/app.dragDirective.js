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
var DragDirective = (function () {
    function DragDirective(eventService) {
        this.eventService = eventService;
        this.currentX = 0;
        this.currentY = 0;
    }
    DragDirective.prototype.onmousedown = function (event) {
        if (!this.draggedElement && event.button != 2 && !this.eventService.eraserStart) {
            this.eventService.displayMenu = false;
            this.draggedElement = true;
            this.selectedElement = event.target;
            // this.eventService.selectedElement = event.target;
            this.currentX = event.clientX;
            this.currentY = event.clientY;
            this.eventService.freeHandDraw = false;
            this.translateX = 0;
            this.translateY = 0;
        }
    };
    DragDirective.prototype.onmousemove = function (event) {
        var _this = this;
        if (this.draggedElement) {
            var dx = event.clientX - this.currentX;
            var dy = event.clientY - this.currentY;
            this.eventService.designData.forEach(function (element) {
                if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id) {
                    //stop dragging out side the svg container
                    //stop dragging outside the container
                    if ((_this.eventService.selectedElement.getBoundingClientRect().left < (_this.eventService.shapeContainer.offsetWidth + 17) && dx < 0) || (_this.eventService.selectedElement.getBoundingClientRect().left + _this.eventService.selectedElement.getBoundingClientRect().width - (_this.eventService.shapeContainer.offsetWidth)) > _this.eventService.svgContainer.offsetWidth && dx > 0) {
                        dx = 0;
                    }
                    if ((_this.eventService.selectedElement.getBoundingClientRect().top < (_this.eventService.headerContainer.offsetHeight + 35) && dy < 0) || (_this.eventService.selectedElement.getBoundingClientRect().top + _this.eventService.selectedElement.getBoundingClientRect().height - (_this.eventService.headerContainer.offsetHeight)) > _this.eventService.svgContainer.offsetHeight && dy > 0) {
                        dy = 0;
                    }
                    _this.translateX += dx;
                    _this.translateY += dy;
                    _this.eventService.selectedElement.setAttributeNS(null, "transform", "translate(" + _this.translateX + "," + _this.translateY + ")");
                    _this.eventService.editedShape.setAttributeNS(null, "transform", "translate(" + _this.translateX + "," + _this.translateY + ")");
                }
            });
            this.currentX = event.clientX;
            this.currentY = event.clientY;
        }
    };
    DragDirective.prototype.onmouseup = function (event) {
        if (this.draggedElement && this.eventService.selectedElement) {
            this.draggedElement = false;
            this.afterDragged();
        }
    };
    DragDirective.prototype.onmouseout = function (event) {
        if (this.draggedElement && this.eventService.selectedElement) {
            this.draggedElement = false;
            this.eventService.rectangleBorderWidth = null; //remove width and height of editable rectangle
            this.eventService.rectangleBorderHeight = null;
            this.eventService.smallCircleRadius = 0;
            this.eventService.rotateCircleRadius = 0;
            this.eventService.rotateCircleX = 0;
            this.eventService.rotateCircleY = 0;
            this.eventService.rotateLineX = 0;
            this.eventService.rotateLineY = 0;
            this.eventService.rectangleHeight = null;
            this.eventService.rectangleWidth = null;
            this.afterDragged();
        }
    };
    DragDirective.prototype.afterDragged = function () {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (element.id == _this.eventService.selectedElement.id) {
                //change path after translation
                var newPath = svgpath(element.designDataPath).translate(_this.translateX, _this.translateY).toString();
                element.designDataPath = newPath;
                _this.eventService.selectedElement.setAttributeNS(null, "transform", "");
                _this.eventService.editedShape.setAttributeNS(null, "transform", "");
                if (element.shapeType == "multiSelect") {
                    var newDesignData = element.designDataPath.split("M");
                    element.designDataPath = "M" + newDesignData[1];
                    element.shapeType = _this.eventService.multiSelectContainer[0].oldShapeType;
                    //break multiselect dragged
                    for (var index = 1; index < _this.eventService.multiSelectContainer.length; index++) {
                        _this.eventService.multiSelectContainer[index].designDataPath = "M" + newDesignData[index + 1];
                        _this.eventService.multiSelectContainer[index].strokeColor = element.strokeColor;
                        _this.eventService.multiSelectContainer[index].strokeWidth = element.strokeWidth;
                        _this.eventService.multiSelectContainer[index].fillColor = element.fillColor;
                        _this.eventService.designData.push(_this.eventService.multiSelectContainer[index]);
                    }
                    // this.eventService.designData.splice(this.eventService.designData.indexOf(element), 1);
                    _this.eventService.multiSelectContainer = [];
                }
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        });
    };
    return DragDirective;
}());
__decorate([
    core_1.HostListener('mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DragDirective.prototype, "onmousedown", null);
__decorate([
    core_1.HostListener('mousemove', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DragDirective.prototype, "onmousemove", null);
__decorate([
    core_1.HostListener('mouseup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DragDirective.prototype, "onmouseup", null);
__decorate([
    core_1.HostListener('mouseout', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DragDirective.prototype, "onmouseout", null);
DragDirective = __decorate([
    core_1.Directive({
        selector: '[dragElement]'
    }),
    __metadata("design:paramtypes", [app_eventService_1.EventService])
], DragDirective);
exports.DragDirective = DragDirective;
//# sourceMappingURL=app.dragDirective.js.map