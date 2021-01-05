"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var svgpath = require("svgpath");
exports.cmToPx = 37.795275591;
var EventService = (function () {
    function EventService() {
        this.strokeWidth = 5;
        this.shapeId = 0;
        this.shapeColor = "rgba(255, 255, 255, 0)";
        this.strokeColor = "#000";
        this.pencilWidth = "5";
        this.freeHandDraw = false;
        this.draggedItem = false;
        this.transformMatrix = "";
        this.eraserStart = false;
        this.displayMenu = false;
        this.multiSelectContainer = [];
        this.undoDataContainer = [];
        //dynamic model binding using array
        this.parameter = [{
                radiusX: "",
                radiusY: "",
                size: "",
                width: "",
                height: "",
                base: "",
                side: "",
                color: ""
            }];
    }
    //generate a path for ellipse and store related information in array
    EventService.prototype.createCirclePath = function () {
        if (this.parameter.radiusX == undefined || this.parameter.radiusX == null) {
            this.parameter.radiusX = this.parameter.radiusY;
        }
        if (this.parameter.radiusY == undefined || this.parameter.radiusY == null) {
            this.parameter.radiusY = this.parameter.radiusX;
        }
        this.parameter.radiusX = this.parameter.radiusX * exports.cmToPx;
        this.parameter.radiusY = this.parameter.radiusY * exports.cmToPx;
        var shapeContainer = {
            designDataPath: "M" + this.cursorX1 + "," + (this.cursorY1 + this.parameter.radiusY) + "a" + this.parameter.radiusX + "," + this.parameter.radiusY + " 0 1,0 " + this.parameter.radiusX * 2 + ",0"
                + "a" + this.parameter.radiusX + "," + this.parameter.radiusY + " 0 1,0 -" + this.parameter.radiusX * 2 + ",0",
            id: this.shapeId,
            // 'M100,100A20,20,0,0,1,50,70A20,20,0,0,1,100,100Z'
            fillColor: this.shapeColor,
            area: (Math.PI * this.parameter.radiusX * this.parameter.radiusY) / (exports.cmToPx * exports.cmToPx),
            strokeWidth: this.strokeWidth,
            strokeColor: this.strokeColor,
            shapeType: "circle",
            oldShapeType: "circle",
            shapeAttribute: "Area is",
            transformMatrix: "scale(1,1) translate(0,0) rotate(0)",
            radiusX: this.parameter.radiusX,
            radiusY: this.parameter.radiusY,
            cursorX1: this.cursorX1,
            cursorY1: this.cursorY1 + this.parameter.radiusY
        };
        var newPath = svgpath(shapeContainer.designDataPath).scale(1, 1).toString();
        shapeContainer.designDataPath = newPath.toString();
        // console.log(shapeContainer.designDataPath)
        this.designData.push(shapeContainer);
        this.undoDataContainer.push(shapeContainer);
        this.shapeId++;
        this.createDynamicRect();
    };
    //generate a path for horizontal line and store related information in array
    EventService.prototype.createLinePath = function () {
        var x2 = this.cursorX1 + this.parameter.size * exports.cmToPx;
        var y2 = this.cursorY1 + this.parameter.size * exports.cmToPx;
        var shapeContainer = {
            designDataPath: "M " + this.cursorX1 + " " + this.cursorY1 + " L " + x2 + " " + y2,
            id: this.shapeId,
            fillColor: this.shapeColor,
            area: this.parameter.size,
            strokeWidth: this.strokeWidth,
            strokeColor: this.strokeColor,
            shapeType: "line",
            oldShapeType: "line",
            shapeAttribute: "Line Length is",
            x2: x2,
            y2: y2,
            length: this.parameter.size,
            cursorX1: this.cursorX1,
            transformMatrix: "scale(1,1) translate(0,0) rotate(0)",
            cursorY1: this.cursorY1
        };
        this.designData.push(shapeContainer);
        this.undoDataContainer.push(shapeContainer);
        this.shapeId++;
        this.createDynamicRect();
    };
    //generate a path for rectangle or square and store related information in array
    EventService.prototype.createRectPath = function () {
        if (this.parameter.width == undefined || this.parameter.width == null) {
            this.parameter.width = this.parameter.height;
        }
        if (this.parameter.height == undefined || this.parameter.height == null) {
            this.parameter.height = this.parameter.width;
        }
        this.parameter.width = this.parameter.width * exports.cmToPx;
        this.parameter.height = this.parameter.height * exports.cmToPx;
        var shapeContainer = {
            designDataPath: "M" + this.cursorX1 + " " + this.cursorY1 + " h" + this.parameter.width + " v" + this.parameter.height + " h-" + this.parameter.width + "Z",
            id: this.shapeId,
            fillColor: this.shapeColor,
            area: (this.parameter.width * this.parameter.height) / (exports.cmToPx * exports.cmToPx),
            strokeWidth: this.strokeWidth,
            strokeColor: this.strokeColor,
            shapeType: "rectangle",
            oldShapeType: "rectangle",
            shapeAttribute: "Area is",
            width: this.parameter.width,
            height: this.parameter.height,
            transformMatrix: "scale(1,1) translate(0,0) rotate(0)",
            cursorX1: this.cursorX1,
            cursorY1: this.cursorY1
        };
        this.designData.push(shapeContainer);
        this.undoDataContainer.push(shapeContainer);
        this.shapeId++;
        this.createDynamicRect();
    };
    //generate a path for triangle and store related information in array
    EventService.prototype.createTrianglePath = function () {
        if (this.parameter.height == undefined || this.parameter.height == null) {
            this.parameter.height = this.parameter.base;
        }
        if (this.parameter.base == undefined || this.parameter.base == null) {
            this.parameter.base = this.parameter.height;
        }
        this.parameter.base = this.parameter.base * exports.cmToPx;
        this.parameter.height = this.parameter.height * exports.cmToPx;
        var shapeContainer = {
            designDataPath: "M" + this.cursorX1 + " " + this.cursorY1 + " v" + this.parameter.height + " h" + this.parameter.base + "Z",
            id: this.shapeId,
            fillColor: this.shapeColor,
            area: (this.parameter.height * this.parameter.base) / (2 * (exports.cmToPx * exports.cmToPx)),
            strokeWidth: this.strokeWidth,
            strokeColor: this.strokeColor,
            shapeType: "triangle",
            oldShapeType: "triangle",
            shapeAttribute: "Area is",
            base: this.parameter.base,
            height: this.parameter.height,
            transformMatrix: "scale(1,1) translate(0,0) rotate(0)",
            cursorX1: this.cursorX1,
            cursorY1: this.cursorY1
        };
        this.designData.push(shapeContainer);
        this.undoDataContainer.push(shapeContainer);
        this.shapeId++;
        this.createDynamicRect();
    };
    EventService.prototype.createDynamicRect = function () {
        var _this = this;
        this.designData.forEach(function (element) {
            if (_this.selectedElement && element.id == _this.selectedElement.id) {
                //reset all values of transform matrix for editable group
                _this.editedShape.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                _this.transformShape.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                _this.rotateShape.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                _this.textContainerFirst.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                _this.textContainerSecond.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                _this.rectangleBoundaryLeft = _this.selectedElement.getBoundingClientRect().left - (_this.shapeContainer.offsetWidth + 10) - (element.strokeWidth / 2);
                _this.rectangleBoundaryTop = _this.selectedElement.getBoundingClientRect().top - (_this.headerContainer.offsetHeight + 3) - (element.strokeWidth / 2);
                _this.rectangleBorderWidth = _this.selectedElement.getBoundingClientRect().width + (element.strokeWidth);
                _this.rectangleBorderHeight = _this.selectedElement.getBoundingClientRect().height + (element.strokeWidth);
                //draw circle at last corner of editable rectangle
                _this.circleX = _this.rectangleBoundaryLeft + _this.rectangleBorderWidth;
                _this.circleY = _this.rectangleBoundaryTop + _this.rectangleBorderHeight;
                _this.rotateCircleX = _this.rectangleBoundaryLeft + _this.rectangleBorderWidth / 2;
                _this.rotateCircleY = _this.rectangleBoundaryTop - 20;
                _this.rotateLineX = _this.rectangleBoundaryLeft + _this.rectangleBorderWidth / 2;
                _this.rotateLineY = _this.rectangleBoundaryTop;
                _this.smallCircleRadius = 5;
                //text for width and height of rectangle
                _this.widthTextX = _this.rectangleBoundaryLeft + _this.rectangleBorderWidth;
                _this.widthTextY = _this.rectangleBoundaryTop + _this.rectangleBorderHeight / 2;
                _this.heightTextX = _this.rectangleBoundaryLeft + _this.rectangleBorderWidth / 2;
                _this.heightTextY = _this.rectangleBoundaryTop + _this.rectangleBorderHeight;
                _this.rectangleWidth = _this.rectangleBorderWidth / exports.cmToPx;
                _this.rectangleHeight = _this.rectangleBorderHeight / exports.cmToPx;
            }
        });
    };
    return EventService;
}());
EventService = __decorate([
    core_1.Injectable()
], EventService);
exports.EventService = EventService;
//# sourceMappingURL=app.eventService.js.map