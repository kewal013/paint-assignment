import { Injectable } from '@angular/core';
import * as svgpath from 'svgpath';
export const cmToPx: any = 37.795275591;
@Injectable()
export class EventService {
    selectedElement: any;   //selected element for scale
    editedShape: any;       //for recatngular border for scale
    rotateShape: any;
    rectangleBoundaryTop: any;
    rectangleBoundaryLeft: any;
    rectangleBorderWidth: any;
    rectangleBorderHeight: any;
    svgContainer: any;
    cursorX1: any;
    cursorY1: any;
    strokeWidth: any = 5;
    shapeId: number = 0;
    shapeColor: any = "rgba(255, 255, 255, 0)";
    strokeColor: any = "#000";
    circleX: any;
    circleY: any;
    rotateCircleX: any;
    rotateCircleY: any;
    rotateCircleRadius: any;
    smallCircleRadius: any;
    transformShape: any;
    widthTextX: any;
    widthTextY: any;
    heightTextX: any;
    heightTextY: any;
    rectangleWidth: any;
    rectangleHeight: any;
    pencilWidth: any = "5";
    freeHandDraw: boolean = false;
    shapeContainer: any;
    rotateCircleStrokeWidth: any;
    scaleCircleStrokeWidth: any;
    headerContainer: any;
    rotateLineX: any;
    rotateLineY: any;
    textContainerFirst: any;
    textContainerSecond: any;
    draggedItem: boolean = false;
    transformMatrix = "";
    eraserStart: boolean = false;
    displayMenu: boolean = false;
    multiSelectContainer: any = [];
    undoDataContainer: any = [];
    designData: Array<any>;   //stor multiple shapes
    //dynamic model binding using array
    parameter: any = [{
        radiusX: "",
        radiusY: "",
        size: "",
        width: "",
        height: "",
        base: "",
        side: "",
        color: ""
    }];
    //generate a path for ellipse and store related information in array
    createCirclePath() {
        if (this.parameter.radiusX == undefined || this.parameter.radiusX == null) {
            this.parameter.radiusX = this.parameter.radiusY;
        }
        if (this.parameter.radiusY == undefined || this.parameter.radiusY == null) {
            this.parameter.radiusY = this.parameter.radiusX;
        }
        this.parameter.radiusX = this.parameter.radiusX * cmToPx;
        this.parameter.radiusY = this.parameter.radiusY * cmToPx;
        var shapeContainer = {
            designDataPath: "M" + this.cursorX1 + "," + (this.cursorY1 + this.parameter.radiusY) + "a" + this.parameter.radiusX + "," + this.parameter.radiusY + " 0 1,0 " + this.parameter.radiusX * 2 + ",0"
            + "a" + this.parameter.radiusX + "," + this.parameter.radiusY + " 0 1,0 -" + this.parameter.radiusX * 2 + ",0",
            id: this.shapeId,
            // 'M100,100A20,20,0,0,1,50,70A20,20,0,0,1,100,100Z'
            fillColor: this.shapeColor,
            area: (Math.PI * this.parameter.radiusX * this.parameter.radiusY) / (cmToPx * cmToPx),  //area of ellipse
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
        }
        var newPath = svgpath(shapeContainer.designDataPath).scale(1, 1).toString();
        shapeContainer.designDataPath = newPath.toString();
        // console.log(shapeContainer.designDataPath)
        this.designData.push(shapeContainer);
        this.undoDataContainer.push(shapeContainer);
        this.shapeId++;
        this.createDynamicRect();
    }
    //generate a path for horizontal line and store related information in array
    createLinePath() {
        var x2 = this.cursorX1 + this.parameter.size * cmToPx;
        var y2 = this.cursorY1 + this.parameter.size * cmToPx;
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
        }
        this.designData.push(shapeContainer)
        this.undoDataContainer.push(shapeContainer);
        this.shapeId++;
        this.createDynamicRect();
    }
    //generate a path for rectangle or square and store related information in array
    createRectPath() {
        if (this.parameter.width == undefined || this.parameter.width == null) {
            this.parameter.width = this.parameter.height;
        }
        if (this.parameter.height == undefined || this.parameter.height == null) {
            this.parameter.height = this.parameter.width;
        }
        this.parameter.width = this.parameter.width * cmToPx;
        this.parameter.height = this.parameter.height * cmToPx;
        var shapeContainer = {
            designDataPath: "M" + this.cursorX1 + " " + this.cursorY1 + " h" + this.parameter.width + " v" + this.parameter.height + " h-" + this.parameter.width + "Z",
            id: this.shapeId,
            fillColor: this.shapeColor,
            area: (this.parameter.width * this.parameter.height) / (cmToPx * cmToPx),
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
        }
        this.designData.push(shapeContainer);
        this.undoDataContainer.push(shapeContainer);
        this.shapeId++;
        this.createDynamicRect();
    }
    //generate a path for triangle and store related information in array
    createTrianglePath() {
        if (this.parameter.height == undefined || this.parameter.height == null) {
            this.parameter.height = this.parameter.base;
        }
        if (this.parameter.base == undefined || this.parameter.base == null) {
            this.parameter.base = this.parameter.height;
        }
        this.parameter.base = this.parameter.base * cmToPx;
        this.parameter.height = this.parameter.height * cmToPx;
        var shapeContainer = {
            designDataPath: "M" + this.cursorX1 + " " + this.cursorY1 + " v" + this.parameter.height + " h" + this.parameter.base + "Z",
            id: this.shapeId,
            fillColor: this.shapeColor,
            area: (this.parameter.height * this.parameter.base) / (2 * (cmToPx * cmToPx)),
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
        }
        this.designData.push(shapeContainer);
        this.undoDataContainer.push(shapeContainer);
        this.shapeId++;
        this.createDynamicRect();
    }

    createDynamicRect() {
        this.designData.forEach(element => {
            if (this.selectedElement && element.id == this.selectedElement.id) {
                //reset all values of transform matrix for editable group
                this.editedShape.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                this.transformShape.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                this.rotateShape.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                this.textContainerFirst.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                this.textContainerSecond.setAttributeNS(null, "transform", "scale(1,1) translate(0,0) rotate(0)");
                this.rectangleBoundaryLeft = this.selectedElement.getBoundingClientRect().left - (this.shapeContainer.offsetWidth + 10) - (element.strokeWidth / 2);
                this.rectangleBoundaryTop = this.selectedElement.getBoundingClientRect().top - (this.headerContainer.offsetHeight + 3) - (element.strokeWidth / 2);
                this.rectangleBorderWidth = this.selectedElement.getBoundingClientRect().width + (element.strokeWidth);
                this.rectangleBorderHeight = this.selectedElement.getBoundingClientRect().height + (element.strokeWidth);
                //draw circle at last corner of editable rectangle
                this.circleX = this.rectangleBoundaryLeft + this.rectangleBorderWidth;
                this.circleY = this.rectangleBoundaryTop + this.rectangleBorderHeight;
                this.rotateCircleX = this.rectangleBoundaryLeft + this.rectangleBorderWidth / 2;
                this.rotateCircleY = this.rectangleBoundaryTop - 20;
                this.rotateLineX = this.rectangleBoundaryLeft + this.rectangleBorderWidth / 2;
                this.rotateLineY = this.rectangleBoundaryTop;
                this.smallCircleRadius = 5;
                //text for width and height of rectangle
                this.widthTextX = this.rectangleBoundaryLeft + this.rectangleBorderWidth;
                this.widthTextY = this.rectangleBoundaryTop + this.rectangleBorderHeight / 2;
                this.heightTextX = this.rectangleBoundaryLeft + this.rectangleBorderWidth / 2;
                this.heightTextY = this.rectangleBoundaryTop + this.rectangleBorderHeight;
                this.rectangleWidth = this.rectangleBorderWidth / cmToPx;
                this.rectangleHeight = this.rectangleBorderHeight / cmToPx;
            }
        })
    }
}