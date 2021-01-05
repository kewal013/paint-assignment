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
var HandDrawingDirective = (function () {
    function HandDrawingDirective(eventService) {
        this.eventService = eventService;
        this.currentX = 0;
        this.currentY = 0;
        this.handDraw = false;
        this.buffer = [];
        this.savePoints = [];
    }
    HandDrawingDirective.prototype.onmousedown = function (event) {
        if (this.eventService.freeHandDraw) {
            this.handDraw = true;
            //for remove editable shape when dragging 
            this.eventService.rectangleBorderWidth = null;
            this.eventService.rectangleBorderHeight = null;
            this.eventService.smallCircleRadius = 0;
            //set current target and mouse pointer coordinates
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
            //create a new shape and push it into design array 
            this.shapeContainer = {
                designDataPath: "M" + this.currentX + " " + this.currentY + "L" + event.offsetX + " " + event.offsetY,
                id: this.eventService.shapeId,
                cursorX1: this.currentX,
                cursorY1: this.currentY,
                fillColor: "transparent",
                strokeWidth: this.eventService.strokeWidth,
                oldShapeType: "freeHand",
                transformMatrix: "scale(1,1) translate(0,0) rotate(0)",
                strokeColor: this.eventService.strokeColor,
                shapeType: "freeHand"
            };
            this.handShapeId = this.eventService.shapeId;
            this.eventService.shapeId++;
            this.eventService.designData.push(this.shapeContainer);
        }
    };
    HandDrawingDirective.prototype.onmousemove = function (event) {
        var _this = this;
        if (this.handDraw && this.eventService.freeHandDraw) {
            this.eventService.designData.forEach(function (element) {
                if (element.id == _this.handShapeId) {
                    //points object
                    var points = {
                        x: _this.currentX,
                        y: _this.currentY
                    };
                    // buffer is used to fill mid points from one point to next point
                    _this.buffer.push(points);
                    _this.savePoints.push(points);
                    while (_this.buffer.length > 2) {
                        _this.buffer.shift();
                    }
                    if (_this.getAveragePoint(0)) {
                        element.designDataPath = element.designDataPath + " " + _this.getAveragePoint(0).x + " " + _this.getAveragePoint(0).y;
                        for (var offset = 2; offset < _this.buffer.length; offset += 2) {
                            var getPoints = _this.getAveragePoint(offset);
                            _this.savePoints.push(getPoints);
                            element.designDataPath = element.designDataPath + " " + points.x + " " + points.y;
                        }
                    }
                    element.pointsBuffer = _this.savePoints;
                }
            });
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    };
    HandDrawingDirective.prototype.onmouseup = function (event) {
        var _this = this;
        if (this.handDraw && this.eventService.freeHandDraw) {
            this.eventService.designData.forEach(function (element) {
                if (element.id == _this.handShapeId && _this.buffer.length > 1) {
                    element.designDataPath = svgpath(element.designDataPath).toString();
                    _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                }
            });
        }
        this.handDraw = false;
        this.buffer = [];
        this.savePoints = [];
        this.eventService.createDynamicRect();
        // this.eventService.freeHandDraw = false;
    };
    //getAveragePoint is for getting average points between the corrospoinding points
    HandDrawingDirective.prototype.getAveragePoint = function (offset) {
        var len = this.buffer.length;
        if (len % 7 === 1 || len >= 2) {
            var totalX = 0;
            var totalY = 0;
            var points;
            var i;
            var count = 0;
            for (i = offset; i < len; i++) {
                count++;
                points = this.buffer[i];
                totalX += points.x;
                totalY += points.y;
            }
            return {
                x: totalX / count,
                y: totalY / count
            };
        }
        return null;
    };
    return HandDrawingDirective;
}());
__decorate([
    core_1.HostListener('mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HandDrawingDirective.prototype, "onmousedown", null);
__decorate([
    core_1.HostListener('mousemove', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HandDrawingDirective.prototype, "onmousemove", null);
__decorate([
    core_1.HostListener('mouseup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HandDrawingDirective.prototype, "onmouseup", null);
HandDrawingDirective = __decorate([
    core_1.Directive({
        selector: '[freeHandDrawing]'
    }),
    __metadata("design:paramtypes", [app_eventService_1.EventService])
], HandDrawingDirective);
exports.HandDrawingDirective = HandDrawingDirective;
//# sourceMappingURL=app.freeHandDrawing.js.map