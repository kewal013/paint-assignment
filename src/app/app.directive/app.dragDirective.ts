import { Directive, HostListener } from '@angular/core';
import { EventService } from '../app.services/app.eventService';
import * as svgpath from 'svgpath';
@Directive({
    selector: '[dragElement]'
})

export class DragDirective {
    private selectedElement: any;
    private draggedElement: boolean;
    private currentX: any = 0;
    private currentY: any = 0;
    private translateX: any;
    private translateY: any;
    constructor(private eventService: EventService) {
    }
    @HostListener('mousedown', ['$event']) onmousedown(event: any) {
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
            // add element in undocontainer
            // this.eventService.designData.forEach(element => {
            //     if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
            //         this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            //     }
            // })
        }
    }
    @HostListener('mousemove', ['$event']) onmousemove(event: any) {
        if (this.draggedElement) {
            var dx = event.clientX - this.currentX;
            var dy = event.clientY - this.currentY;
            this.eventService.designData.forEach(element => {
                if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
                    //stop dragging out side the svg container
                    //stop dragging outside the container
                    if ((this.eventService.selectedElement.getBoundingClientRect().left < (this.eventService.shapeContainer.offsetWidth + 17) && dx < 0) || (this.eventService.selectedElement.getBoundingClientRect().left + this.eventService.selectedElement.getBoundingClientRect().width - (this.eventService.shapeContainer.offsetWidth)) > this.eventService.svgContainer.offsetWidth && dx > 0) {
                        dx = 0;
                    }
                    if ((this.eventService.selectedElement.getBoundingClientRect().top < (this.eventService.headerContainer.offsetHeight + 35) && dy < 0) || (this.eventService.selectedElement.getBoundingClientRect().top + this.eventService.selectedElement.getBoundingClientRect().height - (this.eventService.headerContainer.offsetHeight)) > this.eventService.svgContainer.offsetHeight && dy > 0) {
                        dy = 0
                    }
                    this.translateX += dx;
                    this.translateY += dy;
                    this.eventService.selectedElement.setAttributeNS(null, "transform", "translate(" + this.translateX + "," + this.translateY + ")");
                    this.eventService.editedShape.setAttributeNS(null, "transform", "translate(" + this.translateX + "," + this.translateY + ")");
                }
            })
            this.currentX = event.clientX;
            this.currentY = event.clientY;
        }
    }
    @HostListener('mouseup', ['$event'])
    onmouseup(event: any) {
        if (this.draggedElement && this.eventService.selectedElement) {
            this.draggedElement = false;
            this.afterDragged();
        }
    }
    @HostListener('mouseout', ['$event']) onmouseout(event: any) {
        if (this.draggedElement && this.eventService.selectedElement) {
            this.draggedElement = false;
            this.eventService.rectangleBorderWidth = null;   //remove width and height of editable rectangle
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
    }
    private afterDragged() {
        this.eventService.designData.forEach(element => {
            if (element.id == this.eventService.selectedElement.id) {
                //change path after translation
                var newPath = svgpath(element.designDataPath).translate(this.translateX, this.translateY).toString();
                element.designDataPath = newPath;
                this.eventService.selectedElement.setAttributeNS(null, "transform", "");
                this.eventService.editedShape.setAttributeNS(null, "transform", "");
                if (element.shapeType == "multiSelect") {
                    var newDesignData = element.designDataPath.split("M");
                    element.designDataPath = "M" + newDesignData[1];
                    element.shapeType = this.eventService.multiSelectContainer[0].oldShapeType;
                    //break multiselect dragged
                    for (var index = 1; index < this.eventService.multiSelectContainer.length; index++) {
                        this.eventService.multiSelectContainer[index].designDataPath = "M" + newDesignData[index + 1];
                        this.eventService.multiSelectContainer[index].strokeColor = element.strokeColor;
                        this.eventService.multiSelectContainer[index].strokeWidth = element.strokeWidth;
                        this.eventService.multiSelectContainer[index].fillColor = element.fillColor;
                        this.eventService.designData.push(this.eventService.multiSelectContainer[index]);
                    }
                    // this.eventService.designData.splice(this.eventService.designData.indexOf(element), 1);
                    this.eventService.multiSelectContainer = [];
                }
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        })
    }
}
