import { Component, ElementRef, ViewChild, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { GetJsonService } from '../app.services/app.getJsonService';
import { EventService } from '../app.services/app.eventService';
import { cmToPx } from '../app.services/app.eventService';
import * as domtoimage from 'dom-to-image';
import * as download from "downloadjs";
import * as svgpath from 'svgpath';

// import { ContextMenuService } from 'angular2-contextmenu';

@Component({
    selector: 'my-app',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('editBorder') editBorder: ElementRef;
    @ViewChild('imageContainer') imageContainer: ElementRef;
    @ViewChild('toasterContainer') toasterContainer: ElementRef;
    @ViewChild('shapeContainer') shapeContainer: ElementRef;
    @ViewChild('headerContainer') headerContainer: ElementRef;
    @ViewChild('contextMenu') contextMenu: ElementRef;
    @ViewChild('rotateShape') rotateShape: ElementRef;
    @ViewChild('transformShape') transformShape: ElementRef;
    @ViewChild('textContainerFirst') textContainerFirst: ElementRef;
    @ViewChild('textContainerSecond') textContainerSecond: ElementRef;
    private imageType: any[];   //variable for store different image type  
    private selectedElementType: any;   //selected image type form side menu
    private fillLineColor: boolean = false;
    private shapeParameter: any[];
    private shapeParameterType: any[];   //getting user input related to shape parameter
    private colorPicker: any[];
    private displayToast: boolean = false;
    private toastTop: any;
    private toastLeft: any;
    private menuTop: any;
    private menuLeft: any;
    private menuTopPx: any;
    private menuLeftPx: any;
    private editable: boolean = false;
    private hideLeftContainer: number = 0;
    private hideTopContainer: number = 0;
    private freeHandLine: boolean = false;
    private multiSelectActive: boolean = false;
    private multiSelectId: any;
    private stopCopy: boolean = false;
    private multiSelectTarget: boolean = false;
    private multiSelectRegion: any;
    private eraserActive: boolean = false;

    constructor(private getJsonService: GetJsonService, private eventService: EventService, private chRef: ChangeDetectorRef) {
        //initialize path container array
        this.eventService.designData = new Array();
        // for different shapes chossen by user
        // get data from json file
        getJsonService.getShapeType().subscribe(data => {
            this.imageType = data;
        })

        //get shape type and related parameters from json file
        getJsonService.getShapeParameter().subscribe(data => {
            this.shapeParameter = data;
        })

        // get different color from json file 
        getJsonService.getColorPickerData().subscribe(data => {
            this.colorPicker = data;
        })
    }

    ngOnInit() {
        //svg container
        this.eventService.svgContainer = this.imageContainer.nativeElement;
        this.eventService.freeHandDraw = false;
        //access rectangle elememt for editable shapes
        this.eventService.editedShape = this.editBorder.nativeElement;
        //get shape container
        this.eventService.shapeContainer = this.shapeContainer.nativeElement;
        //get header element
        this.eventService.headerContainer = this.headerContainer.nativeElement;
        this.eventService.rotateShape = this.rotateShape.nativeElement;
        this.eventService.transformShape = this.transformShape.nativeElement;
        this.eventService.textContainerFirst = this.textContainerFirst.nativeElement;
        this.eventService.textContainerSecond = this.textContainerSecond.nativeElement;
    }

    //stop contextmenu on right click
    @HostListener('document:contextmenu', ['$event'])
    oncontextmenu(event: any) {
        if (event.target.tagName == "path" || event.target.tagName == "rect") {
            // console.log(document)
            return false;
        }
    }

    //functionality for delete and Ctrl key
    @HostListener('document:keydown', ['$event'])
    onkeydown(event: any) {
        this.eventService.displayMenu = false;
        this.eraserActive = false;
        if (event.keyCode == 46 && this.eventService.selectedElement != null) {
            this.deleteShape();
        }
        if (event.keyCode == 17 && !event.repeat) {
            this.multiSelectActive = true;
            if (this.eventService.selectedElement) {
                this.multiSelectInitiate();
            }
            else {
                this.multiSelectTarget = true;
            }
        }
    }
    @HostListener('document:keyup', ['$event'])
    onkeyup(event: any) {
        if (event.keyCode == 17) {
            this.multiSelectActive = false;
            this.multiSelectTarget = false;
            this.multiSelectId = null;
        }
    }


    //multiselect shapes are initiated
    private multiSelectInitiate() {
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement) {
                if (element.id == this.eventService.selectedElement.id) {
                    element.shapeType = "multiSelect";
                    this.eventService.multiSelectContainer = [];
                    this.multiSelectId = element.id;
                    this.eventService.shapeId++;
                    this.eventService.multiSelectContainer.push(element);
                    this.eventService.createDynamicRect();
                    this.multiSelectRegion = this.eventService.selectedElement;
                }
            }
        })
    }
    //start eraser for freehand drawing
    private eraserInitiated() {
        this.eventService.eraserStart = true;
    }


    //delete shape from shape container array
    private deleteShape() {
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                this.eventService.designData.splice(this.eventService.designData.indexOf(element), 1);
                this.removeBorder();
                this.eventService.displayMenu = false;
            }
        })
    }

    //flip image in horizontal direction
    private flipHorizontal() {
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
                var translateX = (this.eventService.selectedElement.getBoundingClientRect().left - (this.eventService.shapeContainer.offsetWidth) + this.eventService.selectedElement.getBoundingClientRect().width / 2);
                var translateY = (this.eventService.selectedElement.getBoundingClientRect().top - (this.eventService.headerContainer.offsetHeight) + this.eventService.selectedElement.getBoundingClientRect().height / 2);
                element.designDataPath = svgpath(element.designDataPath).transform("translate(" + translateX + "," + translateY + ") scale(-" + 1 + "," + 1 + ") translate(-" + translateX + ",-" + translateY + ")").toString();
                this.chRef.detectChanges();
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                this.eventService.createDynamicRect();
            }
        })
    }

    //flip image in vertical direction
    private flipVertical() {
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
                var translateX = (this.eventService.selectedElement.getBoundingClientRect().left - (this.eventService.shapeContainer.offsetWidth) + this.eventService.selectedElement.getBoundingClientRect().width / 2);
                var translateY = (this.eventService.selectedElement.getBoundingClientRect().top - (this.eventService.headerContainer.offsetHeight) + this.eventService.selectedElement.getBoundingClientRect().height / 2);
                element.designDataPath = svgpath(element.designDataPath).transform("translate(" + translateX + "," + translateY + ") scale(" + 1 + ",-" + 1 + ") translate(-" + translateX + ",-" + translateY + ")").toString();
                this.chRef.detectChanges();
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                this.eventService.createDynamicRect();
            }
        })

    }
    private freeHandDraw() {
        this.eventService.freeHandDraw = true;    //enable free hand drwaing on svg container
    }

    //open custom contextmenu for shape
    private openContextMenu(event: any, shapeValue: any) {
        if (!this.eventService.selectedElement) {
            this.eventService.selectedElement = event.target;
        }
        this.eventService.displayMenu = true;
        this.freeHandLine = false;
        //assign position of context menu
        this.menuTop = event.offsetY;
        this.menuLeft = event.offsetX;
        this.menuLeftPx = event.layerX + "px";
        this.menuTopPx = event.layerY + "px";
        //stop context menu to access outside the container
        if ((this.menuLeft + 100) > this.eventService.svgContainer.offsetWidth) {
            this.menuLeftPx = (event.layerX - 100) + "px";
        }
        this.eventService.designData.forEach(element => {
            if (element.id == this.eventService.selectedElement.id && (element.shapeType == "freeHand" || element.shapeType == "multiSelect")) {
                this.freeHandLine = true;
            }
            if (element.shapeType == "multiSelect") {
                this.stopCopy = true;
            }
        })
        this.eventService.createDynamicRect();
    }

    private onItemDrop(event: any) {
        this.eraserActive = false;
        this.eventService.freeHandDraw = false;
        this.shapeParameter.forEach(element => {
            if (event.dragData == "line") {
                this.fillLineColor = true;    // if image is line then disable fill color
            }
            if (element.type == event.dragData) {
                this.shapeParameterType = element.parameter;         //assign parameter list related to shape type
                this.displayToast = true;  //assign display property true to toaster for parameters
                this.selectedElementType = event.dragData;
                this.toastLeft = event.nativeEvent.offsetX + "px";
                this.toastTop = event.nativeEvent.offsetY + "px";
                this.eventService.cursorX1 = event.nativeEvent.offsetX;         //co-ordinates of mouse pointer
                this.eventService.cursorY1 = event.nativeEvent.offsetY;
                //restricty toaster outside the container 
                if ((350 + event.nativeEvent.offsetX) >= this.eventService.svgContainer.offsetWidth) {

                    //toaster container's width is 350 
                    this.toastLeft = (this.eventService.svgContainer.offsetWidth - 350) + "px";
                    this.eventService.cursorX1 = this.eventService.svgContainer.offsetWidth - 350;
                }

                //check the toaster position
                if (event.nativeEvent.offsetY < this.eventService.headerContainer.offsetHeight) {
                    this.toastTop = 0 + "px";
                }
                if (event.nativeEvent.offsetX < this.eventService.shapeContainer.offsetWidth) {
                    this.toastLeft = 0 + "px";
                }
            }
        });
    }

    private submitValueCheck() {
        var disableButton = true;
        if (this.shapeParameterType) {
            switch (this.selectedElementType) {
                case 'circle':
                    this.setCursorValues();
                    // if (this.eventService.parameter["radiusX"] && this.eventService.parameter["radiusY"]) {
                        // if (this.eventService.parameter["radiusX"] == undefined || this.eventService.parameter["radiusX"] == null) {
                        //     this.eventService.parameter["radiusX"] = this.eventService.parameter["radiusY"];
                        // }
                        // if (this.eventService.parameter["radiusY"] == undefined || this.eventService.parameter["radiusY"] == null) {
                        //     this.eventService.parameter["radiusY"] = this.eventService.parameter["radiusX"];
                        // }
                    // }
                    if (((this.eventService.parameter["radiusX"] || this.eventService.parameter["radiusY"]) && (!this.eventService.parameter["radiusX"] || (this.eventService.parameter["radiusX"] > 0 && (this.eventService.cursorX1 + (2 * this.eventService.parameter["radiusX"] * cmToPx) < this.eventService.svgContainer.offsetWidth))) && (!this.eventService.parameter["radiusY"] || (this.eventService.parameter["radiusY"] > 0 && (this.eventService.cursorY1 + (2 * this.eventService.parameter["radiusY"] * cmToPx) < this.eventService.svgContainer.offsetHeight))))) {
                        disableButton = false;
                        return disableButton;
                    }
                    break;
                case 'line':
                    this.setCursorValues();
                    if (this.eventService.parameter["size"] > 0 && (this.eventService.cursorX1 + this.eventService.parameter["size"] * cmToPx) < this.eventService.svgContainer.offsetWidth) {
                        disableButton = false;
                        return disableButton;
                    }
                    break;
                case 'rectangle':
                    this.setCursorValues();
                    if (((this.eventService.parameter["width"] || this.eventService.parameter["height"]) && (!this.eventService.parameter["width"] || (this.eventService.parameter["width"] > 0 && (this.eventService.cursorX1 + (this.eventService.parameter["width"] * cmToPx) < this.eventService.svgContainer.offsetWidth))) && (!this.eventService.parameter["height"] || (this.eventService.parameter["height"] > 0 && (this.eventService.cursorY1 + (this.eventService.parameter["height"] * cmToPx) < this.eventService.svgContainer.offsetHeight))))) {
                        disableButton = false;
                        return disableButton;
                    }
                    break;
                case 'triangle':
                    this.setCursorValues();
                    if (((this.eventService.parameter["base"] || this.eventService.parameter["height"]) && (!this.eventService.parameter["base"] || (this.eventService.parameter["base"] > 0 && (this.eventService.cursorX1 + (this.eventService.parameter["base"] * cmToPx) < this.eventService.svgContainer.offsetWidth))) && (!this.eventService.parameter["height"] || (this.eventService.parameter["height"] > 0 && (this.eventService.cursorY1 + (this.eventService.parameter["height"] * cmToPx) < this.eventService.svgContainer.offsetHeight))))) {
                        disableButton = false;
                        return disableButton;
                    }
                    break;
            }
        }
        return disableButton;
    }

    private setCursorValues() {
        if (this.eventService.selectedElement) {
            this.eventService.cursorX1 = (this.eventService.selectedElement.getBoundingClientRect().left - this.eventService.shapeContainer.offsetWidth);
            this.eventService.cursorY1 = (this.eventService.selectedElement.getBoundingClientRect().top - this.eventService.headerContainer.offsetHeight);
        }
    }

    //hide left image container
    private hideImageContainer() {
        if (this.hideLeftContainer == 0) {
            this.hideLeftContainer = 1;
        }
        else {
            this.hideLeftContainer = 0;
        }
    }
    //hide top container
    private hideHeaderContainer() {
        if (this.hideTopContainer == 0) {
            this.hideTopContainer = 1;
        }
        else {
            this.hideTopContainer = 0;
        }
    }


    //toaster for edit shape after creation
    private editableParameter() {
        this.editable = true;
        this.eventService.displayMenu = false;
        this.eventService.freeHandDraw = false;
        // this.eventService.selectedElement = event.target;
        this.eventService.designData.forEach(element => {
            if (element.id == this.eventService.selectedElement.id && element.shapeType != "freeHand") {
                this.shapeParameter.forEach(data => {
                    if (data.type == element.shapeType) {
                        this.shapeParameterType = data.parameter;         //assign parameter list related to shape typed
                    }
                })
                //assign parameter values 
                switch (element.shapeType) {
                    case "circle":
                        this.eventService.parameter["radiusX"] = element.radiusX / cmToPx;
                        this.eventService.parameter["radiusY"] = element.radiusY / cmToPx;
                        break;
                    case "line":
                        this.eventService.parameter["size"] = element.length;
                        break;
                    case "rectangle":
                        this.eventService.parameter["width"] = element.width / cmToPx;
                        this.eventService.parameter["height"] = element.height / cmToPx;
                        break;
                    case "triangle":
                        this.eventService.parameter["base"] = element.base / cmToPx;
                        this.eventService.parameter["height"] = element.height / cmToPx;
                        break;
                }
                this.displayToast = true;  //assign display property true to toaster for parameters
                this.selectedElementType = element.shapeType;
                this.toastLeft = this.menuLeft + "px";
                this.toastTop = this.menuTop + "px";
                //restricty toaster outside the container 
                if ((350 + this.menuTop) >= this.eventService.svgContainer.offsetWidth) {

                    //toaster container's width is 350 
                    this.toastLeft = (this.eventService.svgContainer.offsetWidth - 350) + "px";
                    this.eventService.cursorX1 = this.eventService.svgContainer.offsetWidth - 350;
                }
                //check the toaster position
                if (this.menuLeft < this.eventService.headerContainer.offsetHeight) {
                    this.toastTop = 0 + "px";
                }
                if (this.menuTop < this.eventService.shapeContainer.offsetWidth) {
                    this.toastLeft = 0 + "px";
                }
            }
        });
    }

    //submit functionality for creation of shape and edition of shape
    private submitData(parameterForm: any) {
        this.displayToast = false;
        this.fillLineColor = false;
        if (this.editable && this.eventService.selectedElement != null) {
            this.eventService.designData.forEach(element => {
                if (element.id == this.eventService.selectedElement.id && element.shapeType != "freeHand") {
                    var cursorX1 = (this.eventService.selectedElement.getBoundingClientRect().left - this.eventService.shapeContainer.offsetWidth);
                    var cursorY1 = (this.eventService.selectedElement.getBoundingClientRect().top - this.eventService.headerContainer.offsetHeight);
                    switch (element.shapeType) {
                        case "circle":
                            if (this.eventService.parameter["radiusX"] == undefined || this.eventService.parameter["radiusX"] == null) {
                                this.eventService.parameter["radiusX"] = this.eventService.parameter["radiusY"];
                            }
                            if (this.eventService.parameter["radiusY"] == undefined || this.eventService.parameter["radiusY"] == null) {
                                this.eventService.parameter["radiusY"] = this.eventService.parameter["radiusX"];
                            }
                            element.radiusX = this.eventService.parameter["radiusX"] * cmToPx;
                            element.radiusY = this.eventService.parameter["radiusY"] * cmToPx;
                            cursorY1 = cursorY1 + (this.eventService.selectedElement.getBoundingClientRect().height / 2);
                            //update data path of circle on move
                            element.designDataPath = "M" + cursorX1 + "," + cursorY1 + "a" + element.radiusX + "," + element.radiusY + " 0 1,0 " + element.radiusX * 2 + ",0" + "a" + element.radiusX + "," + element.radiusY + " 0 1,0 -" + element.radiusX * 2 + ",0";
                            //update area of element
                            element.area = (Math.PI * element.radiusX * element.radiusY) / (cmToPx * cmToPx);
                            break;
                        case "line":
                            element.length = this.eventService.parameter["size"];
                            element.x2 = cursorX1 + (element.length * cmToPx);
                            element.y2 = cursorY1 + (element.length * cmToPx);
                            //update data path of line on move
                            element.designDataPath = "M " + cursorX1 + " " + cursorY1 + " L " + element.x2 + " " + element.y2;
                            //update area of element
                            element.area = element.length;
                            break;
                        case "rectangle":
                            if (this.eventService.parameter["width"] == undefined || this.eventService.parameter["width"] == null) {
                                this.eventService.parameter["width"] = this.eventService.parameter["height"];
                            }
                            if (this.eventService.parameter["height"] == undefined || this.eventService.parameter["height"] == null) {
                                this.eventService.parameter["height"] = this.eventService.parameter["width"];
                            }
                            element.width = this.eventService.parameter["width"] * cmToPx;
                            element.height = this.eventService.parameter["height"] * cmToPx;
                            //update data path of rectangle on move
                            element.designDataPath = "M" + cursorX1 + " " + cursorY1 + " h" + element.width + " v" + element.height + " h-" + element.width + "Z";
                            //update area of element
                            element.area = (element.width * element.height) / (cmToPx * cmToPx);
                            break;
                        case "triangle":
                            if (this.eventService.parameter["height"] == undefined || this.eventService.parameter["height"] == null) {
                                this.eventService.parameter["height"] = this.eventService.parameter["base"];
                            }
                            if (this.eventService.parameter["base"] == undefined || this.eventService.parameter["base"] == null) {
                                this.eventService.parameter["base"] = this.eventService.parameter["height"];
                            }
                            element.base = this.eventService.parameter["base"] * cmToPx;
                            element.height = this.eventService.parameter["height"] * cmToPx;
                            //update data path of triangle on move
                            element.designDataPath = "M" + cursorX1 + " " + cursorY1 + " v" + element.height + " h" + element.base + "Z";
                            //update area of element
                            element.area = (element.base * element.height) / (2 * (cmToPx * cmToPx));
                            break;
                    }
                    this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                    this.removeBorder();
                }
            })
        }
        else {
            switch (this.selectedElementType) {
                //call service function for circle type shape
                case "circle":
                    this.eventService.createCirclePath();
                    break;
                //call service function for line type shape
                case "line":
                    this.eventService.createLinePath();
                    break;
                //call service function for rectangle type shape
                case "rectangle":
                    this.eventService.createRectPath();
                    break;
                //call service function for triangle type shape
                case "triangle":
                    this.eventService.createTrianglePath();
                    break;
            }
        }
        parameterForm.reset();    //reset form after submit data  
    }

    //cancel popup
    private cancelPopup() {
        this.displayToast = false;
        this.editable = false;
        this.eventService.displayMenu = false;
    }

    //fill shape color
    private fillColorHandler(colorValue: any) {
        this.eventService.shapeColor = colorValue;
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id && element.shapeType != "freeHand") {
                element.fillColor = colorValue;
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        })
    }

    //fill stroke of shape
    private strokeColorHandler(colorValue: any) {
        this.eventService.strokeColor = colorValue;
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
                element.strokeColor = colorValue;
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        })
    }
    //assign stroke width to selected element
    private strokeWidthHandler(value: any) {
        this.eventService.pencilWidth = value;   //assign pencil width 
        this.eventService.strokeWidth = value;
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
                element.strokeWidth = this.eventService.strokeWidth;
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                this.eventService.createDynamicRect();
            }
        })
    }

    //move back functionality of shape
    private moveBack() {
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
                var index = this.eventService.designData.indexOf(element);
                this.eventService.designData.splice(0, 0, this.eventService.designData.splice(index, 1)[0]);
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        })
        this.eventService.displayMenu = false;
        this.removeBorder();
    }

    //move front functionality for shape
    private moveFront() {
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
                var index = this.eventService.designData.indexOf(element);
                this.eventService.designData.splice(this.eventService.designData.length - 1, 0, this.eventService.designData.splice(index, 1)[0]);
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        })
        this.eventService.displayMenu = false;
        this.removeBorder();
    }


    //copy shape
    private copyShape() {
        var newShape: any;
        this.eventService.designData.forEach(element => {
            if (this.eventService.selectedElement && element.id == this.eventService.selectedElement.id) {
                // newShape = element;
                newShape = JSON.parse(JSON.stringify(element))
                newShape.id = this.eventService.shapeId;
                this.eventService.designData.push(newShape);
                this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                this.eventService.shapeId++;
            }
        })
        this.eventService.displayMenu = false;
    }


    //editable group for sacling,rotation and translation of shape
    private editShape(event: any) {
        event.stopPropagation(); // used to stop executions of its corresponding parent handler only.
        this.eventService.displayMenu = false;
        this.displayToast = false;
        this.eventService.freeHandDraw = false;
        this.eventService.draggedItem = true;
        this.eventService.selectedElement = event.target;  // save targeted element into service variable 
        if (!event.ctrlKey) {
            this.eventService.createDynamicRect();
        }
        if (this.multiSelectActive && this.multiSelectTarget) {
            this.multiSelectInitiate();
            this.multiSelectTarget = false;
        }
        else if (this.multiSelectActive && !this.multiSelectTarget) {
            this.multiShapeSelect(event);
        }
        this.eventService.designData.forEach(data => {
            if (data.id == this.eventService.selectedElement.id && data.shapeType == "freeHand") {
                this.eraserActive = true;
            }
        })
    }

    //multiple shapes in single group
    private multiShapeSelect(event: any) {
        this.eventService.designData.forEach(element => {
            if (element.id == this.multiSelectId && event.target && event.target.id != this.multiSelectId) {
                this.eventService.designData.forEach(data => {
                    if (data.id == event.target.id) {
                        element.designDataPath += data.designDataPath;
                        this.eventService.multiSelectContainer.push(data);
                        this.deleteShape();
                        this.chRef.detectChanges();
                        this.eventService.selectedElement = this.multiSelectRegion;
                        this.eventService.createDynamicRect();
                    }
                })
            }
        })
    }

    // save svg image
    private saveImage() {
        var nodeElement = this.imageContainer.nativeElement; //access svg container 
        console.log(nodeElement)
        this.downloadContent(nodeElement);
    }
    private downloadContent(nodeElement: any) {
        domtoimage.toPng(nodeElement)
            .then(function (dataUrl: any) {
                var blobObject = this.urlToBlob(dataUrl);
                download(blobObject, "img.png", "image/png");   //download the image on browser
            }.bind(this));  //binding urlToBlob function
    }
    private urlToBlob(dataUrl: string) {
        var byteString: any;
        if (dataUrl.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataUrl.split(',')[1]);   //atob() function decodes a base-64 encoded string.
        else
            byteString = decodeURI(dataUrl.split(',')[1]);

        // separate out the mime component
        var mimeString: any = dataUrl.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var blob: any = new Uint8Array(byteString.length); //8 bit unsigned interger typed array assigned with 0
        for (var i = 0; i < byteString.length; i++) {
            blob[i] = byteString.charCodeAt(i);
        }
        // return blob;
        return new Blob([blob], {
            type: mimeString
        });
    }

    //remove editable area before save the image
    private removeBorder() {
        this.eventService.selectedElement = null;
        this.eraserActive = false;
        this.eventService.eraserStart = false;
        this.clearValues();
    }

    //remove shapes from svg container
    private clearContainer() {
        this.clearValues();
        this.eventService.designData = new Array(); // remove all values form array
        //reset stroke width and color 
        this.eventService.shapeColor = "transparent";
        this.eventService.strokeColor = "#000";
        this.eventService.strokeWidth = 5;
    }

    //clear editable group
    private clearValues() {
        this.eventService.displayMenu = false;
        this.displayToast = false;
        this.eventService.freeHandDraw = false;
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
    }

    //undoContainer
    // private undoContainer() {
    //     this.clearValues();
    //     if (this.eventService.undoDataContainer && (this.eventService.undoDataContainer.length - 1) >= 0) {
    //         var undoIndex = this.eventService.undoDataContainer.length - 1;
    //         this.eventService.designData.forEach(element => {
    //             if (undoIndex == 0) {
    //                 this.eventService.undoDataContainer.splice(undoIndex, 1);
    //                 this.eventService.designData=new Array();
    //             }
    //             else if (element.id == this.eventService.undoDataContainer[undoIndex].id) {
    //                 this.eventService.designData[this.eventService.designData.indexOf(element)] = this.eventService.undoDataContainer[undoIndex];
    //                 this.eventService.undoDataContainer.splice(undoIndex, 1);
    //             }
    //         })
    //     }
    // }
}