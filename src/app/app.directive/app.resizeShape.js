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
var app_eventService_2 = require("../app.services/app.eventService");
var ResizeShapeDirective = (function () {
    function ResizeShapeDirective(eventService) {
        this.eventService = eventService;
        this.currentX = 0;
        this.currentY = 0;
        this.currentMatrix = 0;
    }
    ResizeShapeDirective.prototype.onmousedown = function (event) {
        if (!this.resizable && this.eventService.selectedElement) {
            this.eventService.displayMenu = false;
            this.resizable = true;
            //set current target and mouse pointer coordinates
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
            // this.eventService.selectedElement=event.target;
            this.scaleX = 1;
            this.scaleY = 1;
            this.eventService.scaleCircleStrokeWidth = 100;
            //find left and top point of the shape for scaling from top left corner
            this.translateX = (this.eventService.selectedElement.getBoundingClientRect().left - this.eventService.shapeContainer.offsetWidth);
            this.translateY = (this.eventService.selectedElement.getBoundingClientRect().top - this.eventService.headerContainer.offsetHeight);
            this.width = this.eventService.selectedElement.getBoundingClientRect().width;
            this.height = this.eventService.selectedElement.getBoundingClientRect().height;
        }
    };
    ResizeShapeDirective.prototype.onmousemove = function (event) {
        var _this = this;
        if (this.resizable && this.eventService.selectedElement) {
            //find difference between current cursor position to next position
            var dx = (event.offsetX - this.currentX);
            var dy = (event.offsetY - this.currentY);
            this.eventService.designData.forEach(function (element) {
                if (element.id == _this.eventService.selectedElement.id) {
                    //prevent resizing in negative side
                    if (_this.eventService.selectedElement.getBoundingClientRect().left - _this.eventService.shapeContainer.offsetWidth > event.offsetX) {
                        dx = 0;
                    }
                    if (_this.eventService.selectedElement.getBoundingClientRect().top - _this.eventService.headerContainer.offsetHeight > event.offsetY) {
                        dy = 0;
                    }
                    //calculate scaling factor
                    _this.scaleX += (dx / _this.width);
                    _this.scaleY += (dy / _this.height);
                    var scaleshapeX = 1 + (dx / _this.eventService.selectedElement.getBoundingClientRect().width);
                    var scaleshapeY = 1 + (dy / _this.eventService.selectedElement.getBoundingClientRect().height);
                    _this.eventService.rectangleWidth = _this.eventService.selectedElement.getBoundingClientRect().width / app_eventService_2.cmToPx;
                    _this.eventService.rectangleHeight = _this.eventService.selectedElement.getBoundingClientRect().height / app_eventService_2.cmToPx;
                    //scale path using svgpath module
                    var newPath = svgpath(element.designDataPath).transform("translate(" + _this.translateX + "," + _this.translateY + ") scale(" + scaleshapeX + "," + scaleshapeY + ") translate(-" + _this.translateX + ",-" + _this.translateY + ")").toString();
                    element.designDataPath = newPath;
                    _this.eventService.editedShape.setAttributeNS(null, "transform", "translate(" + _this.translateX + "," + _this.translateY + ") scale(" + _this.scaleX + "," + _this.scaleY + ") translate(-" + _this.translateX + ",-" + _this.translateY + ")");
                    _this.eventService.transformShape.setAttributeNS(null, "transform", " scale(" + (1 / _this.scaleX) + "," + (1 / _this.scaleY) + ")");
                    _this.eventService.transformShape.setAttributeNS(null, "transform-origin", "50% 50%");
                    _this.eventService.rotateShape.setAttributeNS(null, "transform", " scale(" + (1 / _this.scaleX) + "," + (1 / _this.scaleY) + ")");
                    _this.eventService.rotateShape.setAttributeNS(null, "transform-origin", "100% 100%");
                    _this.eventService.textContainerFirst.setAttributeNS(null, "transform", " scale(" + (1 / _this.scaleX) + "," + (1 / _this.scaleY) + ")");
                    _this.eventService.textContainerFirst.setAttributeNS(null, "transform-origin", "0% 0%");
                    _this.eventService.textContainerSecond.setAttributeNS(null, "transform", " scale(" + (1 / _this.scaleX) + "," + (1 / _this.scaleY) + ")");
                    _this.eventService.textContainerSecond.setAttributeNS(null, "transform-origin", "0% 0%");
                }
            });
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    };
    ResizeShapeDirective.prototype.onmouseup = function (event) {
        if (this.resizable && this.eventService.selectedElement) {
            this.resizable = false;
            this.eventService.scaleCircleStrokeWidth = 0;
            this.scaledValue();
            //Re-set transform and transform origin 
            this.eventService.selectedElement.setAttributeNS(null, "transform", "");
            this.eventService.editedShape.setAttributeNS(null, "transform", "");
            this.eventService.transformShape.setAttributeNS(null, "transform", "");
            this.eventService.transformShape.setAttributeNS(null, "transform-origin", "");
            this.eventService.rotateShape.setAttributeNS(null, "transform", "");
            this.eventService.rotateShape.setAttributeNS(null, "transform-origin", "");
            this.eventService.textContainerFirst.setAttributeNS(null, "transform", "");
            this.eventService.textContainerFirst.setAttributeNS(null, "transform-origin", "");
            this.eventService.textContainerSecond.setAttributeNS(null, "transform", "");
            this.eventService.textContainerSecond.setAttributeNS(null, "transform-origin", "");
        }
    };
    ResizeShapeDirective.prototype.onmouseout = function (event) {
        if (this.resizable && this.eventService.selectedElement) {
            this.resizable = false;
            this.eventService.scaleCircleStrokeWidth = 0;
            this.scaledValue();
            this.eventService.selectedElement.setAttributeNS(null, "transform", "");
        }
    };
    ResizeShapeDirective.prototype.scaledValue = function () {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (element.id == _this.eventService.selectedElement.id) {
                switch (element.shapeType) {
                    //value changes according to scale
                    case "circle":
                        element.radiusX = element.radiusX * _this.scaleX;
                        element.radiusY = element.radiusX * _this.scaleY;
                        element.area = (Math.PI * element.radiusX * element.radiusY) / (app_eventService_2.cmToPx * app_eventService_2.cmToPx);
                        break;
                    case "line":
                        element.length = element.length * _this.scaleX;
                        element.area = element.length;
                        break;
                    case "rectangle":
                        element.width = element.width * _this.scaleX;
                        element.height = element.height * _this.scaleY;
                        element.area = (element.width * element.height) / (app_eventService_2.cmToPx * app_eventService_2.cmToPx);
                        break;
                    case "triangle":
                        element.base = element.base * _this.scaleX;
                        element.height = element.height * _this.scaleY;
                        element.area = (element.base * element.height) / (app_eventService_2.cmToPx * app_eventService_2.cmToPx);
                        break;
                }
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                if (element.shapeType == "multiSelect") {
                    var newDesignData = element.designDataPath.split("M");
                    element.designDataPath = "M" + newDesignData[1];
                    element.shapeType = _this.eventService.multiSelectContainer[0].oldShapeType;
                    for (var index = 1; index < _this.eventService.multiSelectContainer.length; index++) {
                        _this.eventService.multiSelectContainer[index].designDataPath = "M" + newDesignData[index + 1];
                        _this.eventService.multiSelectContainer[index].strokeColor = element.strokeColor;
                        _this.eventService.multiSelectContainer[index].strokeWidth = element.strokeWidth;
                        _this.eventService.multiSelectContainer[index].fillColor = element.fillColor;
                        _this.eventService.designData.push(_this.eventService.multiSelectContainer[index]);
                    }
                    for (var index = 0; index < _this.eventService.multiSelectContainer.length; index++) {
                        switch (_this.eventService.multiSelectContainer[index].shapeType) {
                            //value changes according to scale
                            case "circle":
                                _this.eventService.multiSelectContainer[index].radiusX = _this.eventService.multiSelectContainer[index].radiusX * _this.scaleX;
                                _this.eventService.multiSelectContainer[index].radiusY = _this.eventService.multiSelectContainer[index].radiusX * _this.scaleY;
                                _this.eventService.multiSelectContainer[index].area = (Math.PI * _this.eventService.multiSelectContainer[index].radiusX * _this.eventService.multiSelectContainer[index].radiusY) / (app_eventService_2.cmToPx * app_eventService_2.cmToPx);
                                break;
                            case "line":
                                _this.eventService.multiSelectContainer[index].length = _this.eventService.multiSelectContainer[index].length * _this.scaleX;
                                _this.eventService.multiSelectContainer[index].area = _this.eventService.multiSelectContainer[index].length;
                                break;
                            case "rectangle":
                                _this.eventService.multiSelectContainer[index].width = _this.eventService.multiSelectContainer[index].width * _this.scaleX;
                                _this.eventService.multiSelectContainer[index].height = _this.eventService.multiSelectContainer[index].height * _this.scaleY;
                                _this.eventService.multiSelectContainer[index].area = (_this.eventService.multiSelectContainer[index].width * _this.eventService.multiSelectContainer[index].height) / (app_eventService_2.cmToPx * app_eventService_2.cmToPx);
                                break;
                            case "triangle":
                                _this.eventService.multiSelectContainer[index].base = _this.eventService.multiSelectContainer[index].base * _this.scaleX;
                                _this.eventService.multiSelectContainer[index].height = _this.eventService.multiSelectContainer[index].height * _this.scaleY;
                                _this.eventService.multiSelectContainer[index].area = (_this.eventService.multiSelectContainer[index].base * _this.eventService.multiSelectContainer[index].height) / (app_eventService_2.cmToPx * app_eventService_2.cmToPx);
                                break;
                        }
                        _this.eventService.designData.push(_this.eventService.multiSelectContainer[index]);
                    }
                    _this.eventService.designData.splice(_this.eventService.designData.indexOf(element), 1);
                    _this.eventService.multiSelectContainer = [];
                }
            }
        });
    };
    return ResizeShapeDirective;
}());
__decorate([
    core_1.HostListener('mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResizeShapeDirective.prototype, "onmousedown", null);
__decorate([
    core_1.HostListener('mousemove', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResizeShapeDirective.prototype, "onmousemove", null);
__decorate([
    core_1.HostListener('mouseup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResizeShapeDirective.prototype, "onmouseup", null);
__decorate([
    core_1.HostListener('mouseout', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResizeShapeDirective.prototype, "onmouseout", null);
ResizeShapeDirective = __decorate([
    core_1.Directive({
        selector: '[resizable]'
    }),
    __metadata("design:paramtypes", [app_eventService_1.EventService])
], ResizeShapeDirective);
exports.ResizeShapeDirective = ResizeShapeDirective;
//# sourceMappingURL=app.resizeShape.js.map