import { Directive, HostListener } from '@angular/core';
import { EventService } from '../app.services/app.eventService';
import * as svgpath from 'svgpath';
@Directive({
    selector: '[rotateElement]'
})

export class RotateDirective {
    private rotatable: boolean = false;
    private currentX: any = 0;
    private currentY: any = 0;
    private rotateAngle: any;
    private translateX: any;
    private translateY: any;
    constructor(private eventService: EventService) {
    }
    @HostListener('mousedown', ['$event'])
    onmousedown(event: any) {
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
    }
    @HostListener('mousemove', ['$event'])
    onmousemove(event: any) {
        if (this.rotatable) {
            var dx = (this.currentX - this.translateX);
            var dy = (this.currentY - this.translateY);
            var rotationStartAngle = Math.atan2(dy, dx) * 180 / Math.PI;
            this.eventService.designData.forEach(element => {
                var diffX = (event.offsetX - this.translateX);
                var diffY = (event.offsetY - this.translateY);
                //rotate angle between two points
                var rotationEndAngle = Math.atan2(diffY, diffX) * 180 / Math.PI;
                var angleDifference = rotationEndAngle - rotationStartAngle;
                if ((this.eventService.selectedElement.getBoundingClientRect().left - this.eventService.shapeContainer.offsetWidth) < 0) {
                    angleDifference = 0;
                }
                if (this.eventService.selectedElement.getBoundingClientRect().top - this.eventService.headerContainer.offsetHeight < 0) {
                    angleDifference = 0;
                }
                this.rotateAngle += angleDifference;
                if (element.id == this.eventService.selectedElement.id) {
                    //transformed value for rotation
                    this.eventService.selectedElement.setAttributeNS(null, "transform", "translate(" + this.translateX + "," + this.translateY + ") rotate(" + this.rotateAngle + ") translate(-" + this.translateX + ",-" + this.translateY + ")");
                    this.eventService.editedShape.setAttributeNS(null, "transform", "translate(" + this.translateX + "," + this.translateY + ") rotate(" + this.rotateAngle + ") translate(-" + this.translateX + ",-" + this.translateY + ")");
                }
            })
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    }
    @HostListener('mouseup', ['$event'])
    onmouseup(event: any) {
        if (this.rotatable && this.eventService.selectedElement) {
            this.rotatable = false;
            this.afterRotation();
            //reset editable group after rotation
            this.eventService.rotateCircleStrokeWidth = 0;
            this.eventService.editedShape.setAttributeNS(null, "transform", "");
            this.eventService.selectedElement.setAttributeNS(null, "transform", "");
        }
    }
    @HostListener('mouseout', ['$event'])
    onmouseout(event: any) {
        if (this.rotatable && this.eventService.selectedElement) {
            this.rotatable = false;
            this.afterRotation();
            this.eventService.rotateCircleStrokeWidth = 0;
            this.eventService.selectedElement.setAttributeNS(null, "transform", "");
        }
    }

    private afterRotation() {
        this.eventService.designData.forEach(element => {
            if (element.id == this.eventService.selectedElement.id) {
                //change path after rotation
                var newPath = svgpath(element.designDataPath).transform("translate(" + this.translateX + "," + this.translateY + ") rotate(" + this.rotateAngle + ") translate(-" + this.translateX + ",-" + this.translateY + ")").toString();
                element.designDataPath = newPath;
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                if (element.shapeType == "multiSelect") {
                    var newDesignData = element.designDataPath.split("M");
                    element.designDataPath = "M" + newDesignData[1];
                    element.shapeType = this.eventService.multiSelectContainer[0].oldShapeType;
                    //if multiselected is rotated after rotation break shapes
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
            }
        })
    }
}