import { Directive, HostListener } from '@angular/core';
import { EventService } from '../app.services/app.eventService';
import * as svgpath from 'svgpath';
@Directive({
    selector: '[eraserDraw]'
})

export class EraserDirective {
    private eraserinitiate: boolean;
    private currentX: any = 0;
    private currentY: any = 0;
    constructor(private eventService: EventService) {
    }
    @HostListener('mousedown', ['$event']) onmousedown(event: any) {
        if (!this.eraserinitiate && event.button != 2 && this.eventService.eraserStart) {
            this.eraserinitiate = true;
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
            // add element in undocontainer
            // this.eventService.designData.forEach(element => {
            //     if (this.eventService.selectedElement && element.shapeType == "freeHand" && element.id == this.eventService.selectedElement.id) {
            //         this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            //     }
            // })
        }
    }
    @HostListener('mousemove', ['$event']) onmousemove(event: any) {
        if (this.eraserinitiate && this.eventService.selectedElement) {
            this.eventService.designData.forEach(element => {
                if (element.id == this.eventService.selectedElement.id) {
                    var minX = this.currentX;
                    var minY = this.currentY;
                    var maxX = minX + 10;
                    var maxY = minY + 10;
                    var breakpoint = 0;
                    var newPath = svgpath(element.designDataPath).iterate(function (segment: any[], index: number, x: number, y: number) {
                        if ((minX < segment[1] && segment[1] < maxX) && (minY < segment[2] && segment[2] < maxY)) {
                            segment = [];
                            breakpoint = 1;
                        }
                        else if (breakpoint == 1) {
                            segment[0] = "M";
                            breakpoint = 0;
                        }
                    })
                    element.designDataPath = newPath.toString();
                }
            })
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    }
    @HostListener('mouseup', ['$event']) onmouseup(event: any) {
        if (this.eraserinitiate) {
            this.eraserinitiate = false;
            // add element in undocontainer
            this.eventService.designData.forEach(element => {
                if (this.eventService.selectedElement && element.shapeType == "freeHand" && element.id == this.eventService.selectedElement.id) {
                    this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                }
            })
        }
    }
}