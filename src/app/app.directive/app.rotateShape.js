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
var RotateDirective = (function () {
    function RotateDirective(eventService) {
        this.eventService = eventService;
        this.rotatable = false;
        this.currentX = 0;
        this.currentY = 0;
    }
    RotateDirective.prototype.onmousedown = function (event) {
        this.eventService.displayMenu = false;
        this.rotatable = true;
        this.currentX = event.offsetX;
        this.currentY = event.offsetY;
        this.rotateAngle = 0;
        this.eventService.rotateCircleStrokeWidth = 1000;
        this.translateX = (this.eventService.selectedElement.getBoundingClientRect().left - (this.eventService.shapeContainer.offsetWidth) + this.eventService.selectedElement.getBoundingClientRect().width / 2);
        this.translateY = (this.eventService.selectedElement.getBoundingClientRect().top - (this.eventService.headerContainer.offsetHeight) + this.eventService.selectedElement.getBoundingClientRect().height / 2);
        // add element in undocontainer
        // this.eventService.designData.forEach(element => {
        //     if (this.eventService.selectedElement && element.shapeType == "freeHand" && element.id == this.eventService.selectedElement.id) {
        //         this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
        //     }
        // })
    };
    RotateDirective.prototype.onmousemove = function (event) {
        var _this = this;
        if (this.rotatable) {
            var dx = (this.currentX - this.translateX);
            var dy = (this.currentY - this.translateY);
            var rotationStartAngle = Math.atan2(dy, dx) * 180 / Math.PI;
            this.eventService.designData.forEach(function (element) {
                var diffX = (event.offsetX - _this.translateX);
                var diffY = (event.offsetY - _this.translateY);
                //rotate angle between two points
                var rotationEndAngle = Math.atan2(diffY, diffX) * 180 / Math.PI;
                var angleDifference = rotationEndAngle - rotationStartAngle;
                if ((_this.eventService.selectedElement.getBoundingClientRect().left - _this.eventService.shapeContainer.offsetWidth) < 0) {
                    angleDifference = 0;
                }
                if (_this.eventService.selectedElement.getBoundingClientRect().top - _this.eventService.headerContainer.offsetHeight < 0) {
                    angleDifference = 0;
                }
                _this.rotateAngle += angleDifference;
                if (element.id == _this.eventService.selectedElement.id) {
                    //transformed value for rotation
                    _this.eventService.selectedElement.setAttributeNS(null, "transform", "translate(" + _this.translateX + "," + _this.translateY + ") rotate(" + _this.rotateAngle + ") translate(-" + _this.translateX + ",-" + _this.translateY + ")");
                    _this.eventService.editedShape.setAttributeNS(null, "transform", "translate(" + _this.translateX + "," + _this.translateY + ") rotate(" + _this.rotateAngle + ") translate(-" + _this.translateX + ",-" + _this.translateY + ")");
                }
            });
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    };
    RotateDirective.prototype.onmouseup = function (event) {
        if (this.rotatable && this.eventService.selectedElement) {
            this.rotatable = false;
            this.afterRotation();
            //reset editable group after rotation
            this.eventService.rotateCircleStrokeWidth = 0;
            this.eventService.editedShape.setAttributeNS(null, "transform", "");
            this.eventService.selectedElement.setAttributeNS(null, "transform", "");
        }
    };
    RotateDirective.prototype.onmouseout = function (event) {
        if (this.rotatable && this.eventService.selectedElement) {
            this.rotatable = false;
            this.afterRotation();
            this.eventService.rotateCircleStrokeWidth = 0;
            this.eventService.selectedElement.setAttributeNS(null, "transform", "");
        }
    };
    RotateDirective.prototype.afterRotation = function () {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (element.id == _this.eventService.selectedElement.id) {
                //change path after rotation
                var newPath = svgpath(element.designDataPath).transform("translate(" + _this.translateX + "," + _this.translateY + ") rotate(" + _this.rotateAngle + ") translate(-" + _this.translateX + ",-" + _this.translateY + ")").toString();
                element.designDataPath = newPath;
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                if (element.shapeType == "multiSelect") {
                    var newDesignData = element.designDataPath.split("M");
                    element.designDataPath = "M" + newDesignData[1];
                    element.shapeType = _this.eventService.multiSelectContainer[0].oldShapeType;
                    //if multiselected is rotated after rotation break shapes
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
            }
        });
    };
    return RotateDirective;
}());
__decorate([
    core_1.HostListener('mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RotateDirective.prototype, "onmousedown", null);
__decorate([
    core_1.HostListener('mousemove', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RotateDirective.prototype, "onmousemove", null);
__decorate([
    core_1.HostListener('mouseup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RotateDirective.prototype, "onmouseup", null);
__decorate([
    core_1.HostListener('mouseout', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RotateDirective.prototype, "onmouseout", null);
RotateDirective = __decorate([
    core_1.Directive({
        selector: '[rotateElement]'
    }),
    __metadata("design:paramtypes", [app_eventService_1.EventService])
], RotateDirective);
exports.RotateDirective = RotateDirective;
//# sourceMappingURL=app.rotateShape.js.map