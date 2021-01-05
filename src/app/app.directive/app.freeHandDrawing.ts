import { Directive, EventEmitter, HostListener } from '@angular/core';
import { EventService } from '../app.services/app.eventService';
import * as svgpath from 'svgpath';

@Directive({
    selector: '[freeHandDrawing]'
})
export class HandDrawingDirective {
    private currentX: any = 0;
    private currentY: any = 0;
    private handDraw: boolean = false;
    private shapeContainer: any;
    private handShapeId: any;
    private buffer: any = [];
    private savePoints: any = [];
    constructor(private eventService: EventService) {
    }

    @HostListener('mousedown', ['$event'])
    onmousedown(event: any) {
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
                oldShapeType:"freeHand",
                transformMatrix: "scale(1,1) translate(0,0) rotate(0)",
                strokeColor: this.eventService.strokeColor,
                shapeType: "freeHand"
            }
            this.handShapeId = this.eventService.shapeId;
            this.eventService.shapeId++;
            this.eventService.designData.push(this.shapeContainer);
        }
    }
    @HostListener('mousemove', ['$event'])
    onmousemove(event: any) {
        if (this.handDraw && this.eventService.freeHandDraw) {
            this.eventService.designData.forEach(element => {
                if (element.id == this.handShapeId) {
                    //points object
                    var points = {
                        x: this.currentX,
                        y: this.currentY
                    }
                    // buffer is used to fill mid points from one point to next point
                    this.buffer.push(points);
                    this.savePoints.push(points);
                    while (this.buffer.length > 2) {
                        this.buffer.shift();
                    }
                    if (this.getAveragePoint(0)) {
                        element.designDataPath = element.designDataPath + " " + this.getAveragePoint(0).x + " " + this.getAveragePoint(0).y;
                        for (var offset = 2; offset < this.buffer.length; offset += 2) {
                            var getPoints = this.getAveragePoint(offset);
                            this.savePoints.push(getPoints);
                            element.designDataPath = element.designDataPath + " " + points.x + " " + points.y;
                        }
                    }
                    element.pointsBuffer = this.savePoints;
                }
            })
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    }
    @HostListener('mouseup', ['$event'])
    onmouseup(event: any) {
        if (this.handDraw && this.eventService.freeHandDraw) {
            this.eventService.designData.forEach(element => {
                if (element.id == this.handShapeId && this.buffer.length > 1) {
                    element.designDataPath=svgpath(element.designDataPath).toString();
                    this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                }
            })
        }
        this.handDraw = false;
        this.buffer = [];
        this.savePoints = [];
        this.eventService.createDynamicRect();
        // this.eventService.freeHandDraw = false;
    }


    //getAveragePoint is for getting average points between the corrospoinding points
    private getAveragePoint(offset: any) {
        var len = this.buffer.length;
        if (len % 7 === 1 || len >= 2) {
            var totalX = 0;
            var totalY = 0;
            var points: any;
            var i: any;
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
            }
        }
        return null;
    }
}