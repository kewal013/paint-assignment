import { Directive, EventEmitter, HostListener } from '@angular/core';
import { EventService } from '../app.services/app.eventService';
import * as svgpath from 'svgpath';
import { cmToPx } from '../app.services/app.eventService';
@Directive({
    selector: '[resizable]'
})
export class ResizeShapeDirective {
    private resizable: boolean;
    private currentX: any = 0;
    private currentY: any = 0;
    private currentMatrix: any = 0;
    private scaleX: any;
    private scaleY: any;
    private translateX: any;
    private translateY: any;
    private width: any;
    private height: any;
    constructor(private eventService: EventService) {
    }

    @HostListener('mousedown', ['$event'])
    onmousedown(event: any) {
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
            // add element in undocontainer
            // this.eventService.designData.forEach(element => {
            //     if (this.eventService.selectedElement && element.shapeType == "freeHand" && element.id == this.eventService.selectedElement.id) {
            //         this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            //     }
            // })
        }
    }
    @HostListener('mousemove', ['$event'])
    onmousemove(event: any) {
        if (this.resizable && this.eventService.selectedElement) {
            //find difference between current cursor position to next position
            var dx = (event.offsetX - this.currentX);
            var dy = (event.offsetY - this.currentY);

            this.eventService.designData.forEach(element => {
                if (element.id == this.eventService.selectedElement.id) {
                    //prevent resizing in negative side
                    if (this.eventService.selectedElement.getBoundingClientRect().left - this.eventService.shapeContainer.offsetWidth > event.offsetX) {
                        dx = 0;
                    }
                    if (this.eventService.selectedElement.getBoundingClientRect().top - this.eventService.headerContainer.offsetHeight > event.offsetY) {
                        dy = 0;
                    }
                    //calculate scaling factor
                    this.scaleX += (dx / this.width);
                    this.scaleY += (dy / this.height);
                    var scaleshapeX = 1 + (dx / this.eventService.selectedElement.getBoundingClientRect().width);
                    var scaleshapeY = 1 + (dy / this.eventService.selectedElement.getBoundingClientRect().height);
                    this.eventService.rectangleWidth = this.eventService.selectedElement.getBoundingClientRect().width / cmToPx;
                    this.eventService.rectangleHeight = this.eventService.selectedElement.getBoundingClientRect().height / cmToPx;
                    //scale path using svgpath module
                    var newPath = svgpath(element.designDataPath).transform("translate(" + this.translateX + "," + this.translateY + ") scale(" + scaleshapeX + "," + scaleshapeY + ") translate(-" + this.translateX + ",-" + this.translateY + ")").toString();
                    element.designDataPath = newPath;
                    this.eventService.editedShape.setAttributeNS(null, "transform", "translate(" + this.translateX + "," + this.translateY + ") scale(" + this.scaleX + "," + this.scaleY + ") translate(-" + this.translateX + ",-" + this.translateY + ")");
                    this.eventService.transformShape.setAttributeNS(null, "transform", " scale(" + (1 / this.scaleX) + "," + (1 / this.scaleY) + ")");
                    this.eventService.transformShape.setAttributeNS(null, "transform-origin", "50% 50%");
                    this.eventService.rotateShape.setAttributeNS(null, "transform", " scale(" + (1 / this.scaleX) + "," + (1 / this.scaleY) + ")");
                    this.eventService.rotateShape.setAttributeNS(null, "transform-origin", "100% 100%");
                    this.eventService.textContainerFirst.setAttributeNS(null, "transform", " scale(" + (1 / this.scaleX) + "," + (1 / this.scaleY) + ")");
                    this.eventService.textContainerFirst.setAttributeNS(null, "transform-origin", "0% 0%");
                    this.eventService.textContainerSecond.setAttributeNS(null, "transform", " scale(" + (1 / this.scaleX) + "," + (1 / this.scaleY) + ")");
                    this.eventService.textContainerSecond.setAttributeNS(null, "transform-origin", "0% 0%");
                }
            })
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    }
    @HostListener('mouseup', ['$event'])
    onmouseup(event: any) {
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
    }

    @HostListener('mouseout', ['$event']) onmouseout(event: any) {
        if (this.resizable && this.eventService.selectedElement) {
            this.resizable = false;
            this.eventService.scaleCircleStrokeWidth = 0;
            this.scaledValue();
            this.eventService.selectedElement.setAttributeNS(null, "transform", "");
        }
    }

    private scaledValue() {
        this.eventService.designData.forEach(element => {
            if (element.id == this.eventService.selectedElement.id) {
                switch (element.shapeType) {
                    //value changes according to scale
                    case "circle":
                        element.radiusX = element.radiusX * this.scaleX;
                        element.radiusY = element.radiusX * this.scaleY;
                        element.area = (Math.PI * element.radiusX * element.radiusY) / (cmToPx * cmToPx);
                        break;
                    case "line":
                        element.length = element.length * this.scaleX;
                        element.area = element.length;
                        break;
                    case "rectangle":
                        element.width = element.width * this.scaleX;
                        element.height = element.height * this.scaleY;
                        element.area = (element.width * element.height) / (cmToPx * cmToPx);
                        break;
                    case "triangle":
                        element.base = element.base * this.scaleX;
                        element.height = element.height * this.scaleY;
                        element.area = (element.base * element.height) / (cmToPx * cmToPx);
                        break;
                }
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                if (element.shapeType == "multiSelect") {
                    var newDesignData = element.designDataPath.split("M");
                    element.designDataPath = "M" + newDesignData[1];
                    element.shapeType = this.eventService.multiSelectContainer[0].oldShapeType;
                    for (var index = 1; index < this.eventService.multiSelectContainer.length; index++) {
                        this.eventService.multiSelectContainer[index].designDataPath = "M" + newDesignData[index + 1];
                        this.eventService.multiSelectContainer[index].strokeColor = element.strokeColor;
                        this.eventService.multiSelectContainer[index].strokeWidth = element.strokeWidth;
                        this.eventService.multiSelectContainer[index].fillColor = element.fillColor;
                        this.eventService.designData.push(this.eventService.multiSelectContainer[index]);
                    }
                    for (var index = 0; index < this.eventService.multiSelectContainer.length; index++) {
                        switch (this.eventService.multiSelectContainer[index].shapeType) {
                            //value changes according to scale
                            case "circle":
                                this.eventService.multiSelectContainer[index].radiusX = this.eventService.multiSelectContainer[index].radiusX * this.scaleX;
                                this.eventService.multiSelectContainer[index].radiusY = this.eventService.multiSelectContainer[index].radiusX * this.scaleY;
                                this.eventService.multiSelectContainer[index].area = (Math.PI * this.eventService.multiSelectContainer[index].radiusX * this.eventService.multiSelectContainer[index].radiusY) / (cmToPx * cmToPx);
                                break;
                            case "line":
                                this.eventService.multiSelectContainer[index].length = this.eventService.multiSelectContainer[index].length * this.scaleX;
                                this.eventService.multiSelectContainer[index].area = this.eventService.multiSelectContainer[index].length;
                                break;
                            case "rectangle":
                                this.eventService.multiSelectContainer[index].width = this.eventService.multiSelectContainer[index].width * this.scaleX;
                                this.eventService.multiSelectContainer[index].height = this.eventService.multiSelectContainer[index].height * this.scaleY;
                                this.eventService.multiSelectContainer[index].area = (this.eventService.multiSelectContainer[index].width * this.eventService.multiSelectContainer[index].height) / (cmToPx * cmToPx);
                                break;
                            case "triangle":
                                this.eventService.multiSelectContainer[index].base = this.eventService.multiSelectContainer[index].base * this.scaleX;
                                this.eventService.multiSelectContainer[index].height = this.eventService.multiSelectContainer[index].height * this.scaleY;
                                this.eventService.multiSelectContainer[index].area = (this.eventService.multiSelectContainer[index].base * this.eventService.multiSelectContainer[index].height) / (cmToPx * cmToPx);
                                break;
                        }
                        this.eventService.designData.push(this.eventService.multiSelectContainer[index]);
                    }
                    this.eventService.designData.splice(this.eventService.designData.indexOf(element), 1);
                    this.eventService.multiSelectContainer = [];
                }
            }
        })
    }
}

