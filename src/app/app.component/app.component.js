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
var app_getJsonService_1 = require("../app.services/app.getJsonService");
var app_eventService_1 = require("../app.services/app.eventService");
var app_eventService_2 = require("../app.services/app.eventService");
var domtoimage = require("dom-to-image");
var download = require("downloadjs");
var svgpath = require("svgpath");
// import { ContextMenuService } from 'angular2-contextmenu';
var AppComponent = (function () {
    function AppComponent(getJsonService, eventService, chRef) {
        var _this = this;
        this.getJsonService = getJsonService;
        this.eventService = eventService;
        this.chRef = chRef;
        this.fillLineColor = false;
        this.displayToast = false;
        this.editable = false;
        this.hideLeftContainer = 0;
        this.hideTopContainer = 0;
        this.freeHandLine = false;
        this.multiSelectActive = false;
        this.stopCopy = false;
        this.multiSelectTarget = false;
        this.eraserActive = false;
        //initialize path container array
        this.eventService.designData = new Array();
        // for different shapes chossen by user
        // get data from json file
        getJsonService.getShapeType().subscribe(function (data) {
            _this.imageType = data;
        });
        //get shape type and related parameters from json file
        getJsonService.getShapeParameter().subscribe(function (data) {
            _this.shapeParameter = data;
        });
        // get different color from json file 
        getJsonService.getColorPickerData().subscribe(function (data) {
            _this.colorPicker = data;
        });
    }
    AppComponent.prototype.ngOnInit = function () {
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
    };
    //stop contextmenu on right click
    AppComponent.prototype.oncontextmenu = function (event) {
        if (event.target.tagName == "path" || event.target.tagName == "rect") {
            // console.log(document)
            return false;
        }
    };
    //functionality for delete and Ctrl key
    AppComponent.prototype.onkeydown = function (event) {
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
    };
    AppComponent.prototype.onkeyup = function (event) {
        if (event.keyCode == 17) {
            this.multiSelectActive = false;
            this.multiSelectTarget = false;
            this.multiSelectId = null;
        }
    };
    //multiselect shapes are initiated
    AppComponent.prototype.multiSelectInitiate = function () {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement) {
                if (element.id == _this.eventService.selectedElement.id) {
                    element.shapeType = "multiSelect";
                    _this.eventService.multiSelectContainer = [];
                    _this.multiSelectId = element.id;
                    _this.eventService.shapeId++;
                    _this.eventService.multiSelectContainer.push(element);
                    _this.eventService.createDynamicRect();
                    _this.multiSelectRegion = _this.eventService.selectedElement;
                }
            }
        });
    };
    //start eraser for freehand drawing
    AppComponent.prototype.eraserInitiated = function () {
        this.eventService.eraserStart = true;
    };
    //delete shape from shape container array
    AppComponent.prototype.deleteShape = function () {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id) {
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                _this.eventService.designData.splice(_this.eventService.designData.indexOf(element), 1);
                _this.removeBorder();
                _this.eventService.displayMenu = false;
            }
        });
    };
    //flip image in horizontal direction
    AppComponent.prototype.flipHorizontal = function () {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id) {
                var translateX = (_this.eventService.selectedElement.getBoundingClientRect().left - (_this.eventService.shapeContainer.offsetWidth) + _this.eventService.selectedElement.getBoundingClientRect().width / 2);
                var translateY = (_this.eventService.selectedElement.getBoundingClientRect().top - (_this.eventService.headerContainer.offsetHeight) + _this.eventService.selectedElement.getBoundingClientRect().height / 2);
                element.designDataPath = svgpath(element.designDataPath).transform("translate(" + translateX + "," + translateY + ") scale(-" + 1 + "," + 1 + ") translate(-" + translateX + ",-" + translateY + ")").toString();
                _this.chRef.detectChanges();
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                _this.eventService.createDynamicRect();
            }
        });
    };
    //flip image in vertical direction
    AppComponent.prototype.flipVertical = function () {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id) {
                var translateX = (_this.eventService.selectedElement.getBoundingClientRect().left - (_this.eventService.shapeContainer.offsetWidth) + _this.eventService.selectedElement.getBoundingClientRect().width / 2);
                var translateY = (_this.eventService.selectedElement.getBoundingClientRect().top - (_this.eventService.headerContainer.offsetHeight) + _this.eventService.selectedElement.getBoundingClientRect().height / 2);
                element.designDataPath = svgpath(element.designDataPath).transform("translate(" + translateX + "," + translateY + ") scale(" + 1 + ",-" + 1 + ") translate(-" + translateX + ",-" + translateY + ")").toString();
                _this.chRef.detectChanges();
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                _this.eventService.createDynamicRect();
            }
        });
    };
    AppComponent.prototype.freeHandDraw = function () {
        this.eventService.freeHandDraw = true; //enable free hand drwaing on svg container
    };
    //open custom contextmenu for shape
    AppComponent.prototype.openContextMenu = function (event, shapeValue) {
        var _this = this;
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
        this.eventService.designData.forEach(function (element) {
            if (element.id == _this.eventService.selectedElement.id && (element.shapeType == "freeHand" || element.shapeType == "multiSelect")) {
                _this.freeHandLine = true;
            }
            if (element.shapeType == "multiSelect") {
                _this.stopCopy = true;
            }
        });
        this.eventService.createDynamicRect();
    };
    AppComponent.prototype.onItemDrop = function (event) {
        var _this = this;
        this.eraserActive = false;
        this.eventService.freeHandDraw = false;
        this.shapeParameter.forEach(function (element) {
            if (event.dragData == "line") {
                _this.fillLineColor = true; // if image is line then disable fill color
            }
            if (element.type == event.dragData) {
                _this.shapeParameterType = element.parameter; //assign parameter list related to shape type
                _this.displayToast = true; //assign display property true to toaster for parameters
                _this.selectedElementType = event.dragData;
                _this.toastLeft = event.nativeEvent.offsetX + "px";
                _this.toastTop = event.nativeEvent.offsetY + "px";
                _this.eventService.cursorX1 = event.nativeEvent.offsetX; //co-ordinates of mouse pointer
                _this.eventService.cursorY1 = event.nativeEvent.offsetY;
                //restricty toaster outside the container 
                if ((350 + event.nativeEvent.offsetX) >= _this.eventService.svgContainer.offsetWidth) {
                    //toaster container's width is 350 
                    _this.toastLeft = (_this.eventService.svgContainer.offsetWidth - 350) + "px";
                    _this.eventService.cursorX1 = _this.eventService.svgContainer.offsetWidth - 350;
                }
                //check the toaster position
                if (event.nativeEvent.offsetY < _this.eventService.headerContainer.offsetHeight) {
                    _this.toastTop = 0 + "px";
                }
                if (event.nativeEvent.offsetX < _this.eventService.shapeContainer.offsetWidth) {
                    _this.toastLeft = 0 + "px";
                }
            }
        });
    };
    AppComponent.prototype.submitValueCheck = function () {
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
                    if (((this.eventService.parameter["radiusX"] || this.eventService.parameter["radiusY"]) && (!this.eventService.parameter["radiusX"] || (this.eventService.parameter["radiusX"] > 0 && (this.eventService.cursorX1 + (2 * this.eventService.parameter["radiusX"] * app_eventService_2.cmToPx) < this.eventService.svgContainer.offsetWidth))) && (!this.eventService.parameter["radiusY"] || (this.eventService.parameter["radiusY"] > 0 && (this.eventService.cursorY1 + (2 * this.eventService.parameter["radiusY"] * app_eventService_2.cmToPx) < this.eventService.svgContainer.offsetHeight))))) {
                        disableButton = false;
                        return disableButton;
                    }
                    break;
                case 'line':
                    this.setCursorValues();
                    if (this.eventService.parameter["size"] > 0 && (this.eventService.cursorX1 + this.eventService.parameter["size"] * app_eventService_2.cmToPx) < this.eventService.svgContainer.offsetWidth) {
                        disableButton = false;
                        return disableButton;
                    }
                    break;
                case 'rectangle':
                    this.setCursorValues();
                    if (((this.eventService.parameter["width"] || this.eventService.parameter["height"]) && (!this.eventService.parameter["width"] || (this.eventService.parameter["width"] > 0 && (this.eventService.cursorX1 + (this.eventService.parameter["width"] * app_eventService_2.cmToPx) < this.eventService.svgContainer.offsetWidth))) && (!this.eventService.parameter["height"] || (this.eventService.parameter["height"] > 0 && (this.eventService.cursorY1 + (this.eventService.parameter["height"] * app_eventService_2.cmToPx) < this.eventService.svgContainer.offsetHeight))))) {
                        disableButton = false;
                        return disableButton;
                    }
                    break;
                case 'triangle':
                    this.setCursorValues();
                    if (((this.eventService.parameter["base"] || this.eventService.parameter["height"]) && (!this.eventService.parameter["base"] || (this.eventService.parameter["base"] > 0 && (this.eventService.cursorX1 + (this.eventService.parameter["base"] * app_eventService_2.cmToPx) < this.eventService.svgContainer.offsetWidth))) && (!this.eventService.parameter["height"] || (this.eventService.parameter["height"] > 0 && (this.eventService.cursorY1 + (this.eventService.parameter["height"] * app_eventService_2.cmToPx) < this.eventService.svgContainer.offsetHeight))))) {
                        disableButton = false;
                        return disableButton;
                    }
                    break;
            }
        }
        return disableButton;
    };
    AppComponent.prototype.setCursorValues = function () {
        if (this.eventService.selectedElement) {
            this.eventService.cursorX1 = (this.eventService.selectedElement.getBoundingClientRect().left - this.eventService.shapeContainer.offsetWidth);
            this.eventService.cursorY1 = (this.eventService.selectedElement.getBoundingClientRect().top - this.eventService.headerContainer.offsetHeight);
        }
    };
    //hide left image container
    AppComponent.prototype.hideImageContainer = function () {
        if (this.hideLeftContainer == 0) {
            this.hideLeftContainer = 1;
        }
        else {
            this.hideLeftContainer = 0;
        }
    };
    //hide top container
    AppComponent.prototype.hideHeaderContainer = function () {
        if (this.hideTopContainer == 0) {
            this.hideTopContainer = 1;
        }
        else {
            this.hideTopContainer = 0;
        }
    };
    //toaster for edit shape after creation
    AppComponent.prototype.editableParameter = function () {
        var _this = this;
        this.editable = true;
        this.eventService.displayMenu = false;
        this.eventService.freeHandDraw = false;
        // this.eventService.selectedElement = event.target;
        this.eventService.designData.forEach(function (element) {
            if (element.id == _this.eventService.selectedElement.id && element.shapeType != "freeHand") {
                _this.shapeParameter.forEach(function (data) {
                    if (data.type == element.shapeType) {
                        _this.shapeParameterType = data.parameter; //assign parameter list related to shape typed
                    }
                });
                //assign parameter values 
                switch (element.shapeType) {
                    case "circle":
                        _this.eventService.parameter["radiusX"] = element.radiusX / app_eventService_2.cmToPx;
                        _this.eventService.parameter["radiusY"] = element.radiusY / app_eventService_2.cmToPx;
                        break;
                    case "line":
                        _this.eventService.parameter["size"] = element.length;
                        break;
                    case "rectangle":
                        _this.eventService.parameter["width"] = element.width / app_eventService_2.cmToPx;
                        _this.eventService.parameter["height"] = element.height / app_eventService_2.cmToPx;
                        break;
                    case "triangle":
                        _this.eventService.parameter["base"] = element.base / app_eventService_2.cmToPx;
                        _this.eventService.parameter["height"] = element.height / app_eventService_2.cmToPx;
                        break;
                }
                _this.displayToast = true; //assign display property true to toaster for parameters
                _this.selectedElementType = element.shapeType;
                _this.toastLeft = _this.menuLeft + "px";
                _this.toastTop = _this.menuTop + "px";
                //restricty toaster outside the container 
                if ((350 + _this.menuTop) >= _this.eventService.svgContainer.offsetWidth) {
                    //toaster container's width is 350 
                    _this.toastLeft = (_this.eventService.svgContainer.offsetWidth - 350) + "px";
                    _this.eventService.cursorX1 = _this.eventService.svgContainer.offsetWidth - 350;
                }
                //check the toaster position
                if (_this.menuLeft < _this.eventService.headerContainer.offsetHeight) {
                    _this.toastTop = 0 + "px";
                }
                if (_this.menuTop < _this.eventService.shapeContainer.offsetWidth) {
                    _this.toastLeft = 0 + "px";
                }
            }
        });
    };
    //submit functionality for creation of shape and edition of shape
    AppComponent.prototype.submitData = function (parameterForm) {
        var _this = this;
        this.displayToast = false;
        this.fillLineColor = false;
        if (this.editable && this.eventService.selectedElement != null) {
            this.eventService.designData.forEach(function (element) {
                if (element.id == _this.eventService.selectedElement.id && element.shapeType != "freeHand") {
                    var cursorX1 = (_this.eventService.selectedElement.getBoundingClientRect().left - _this.eventService.shapeContainer.offsetWidth);
                    var cursorY1 = (_this.eventService.selectedElement.getBoundingClientRect().top - _this.eventService.headerContainer.offsetHeight);
                    switch (element.shapeType) {
                        case "circle":
                            if (_this.eventService.parameter["radiusX"] == undefined || _this.eventService.parameter["radiusX"] == null) {
                                _this.eventService.parameter["radiusX"] = _this.eventService.parameter["radiusY"];
                            }
                            if (_this.eventService.parameter["radiusY"] == undefined || _this.eventService.parameter["radiusY"] == null) {
                                _this.eventService.parameter["radiusY"] = _this.eventService.parameter["radiusX"];
                            }
                            element.radiusX = _this.eventService.parameter["radiusX"] * app_eventService_2.cmToPx;
                            element.radiusY = _this.eventService.parameter["radiusY"] * app_eventService_2.cmToPx;
                            cursorY1 = cursorY1 + (_this.eventService.selectedElement.getBoundingClientRect().height / 2);
                            //update data path of circle on move
                            element.designDataPath = "M" + cursorX1 + "," + cursorY1 + "a" + element.radiusX + "," + element.radiusY + " 0 1,0 " + element.radiusX * 2 + ",0" + "a" + element.radiusX + "," + element.radiusY + " 0 1,0 -" + element.radiusX * 2 + ",0";
                            //update area of element
                            element.area = (Math.PI * element.radiusX * element.radiusY) / (app_eventService_2.cmToPx * app_eventService_2.cmToPx);
                            break;
                        case "line":
                            element.length = _this.eventService.parameter["size"];
                            element.x2 = cursorX1 + (element.length * app_eventService_2.cmToPx);
                            element.y2 = cursorY1 + (element.length * app_eventService_2.cmToPx);
                            //update data path of line on move
                            element.designDataPath = "M " + cursorX1 + " " + cursorY1 + " L " + element.x2 + " " + element.y2;
                            //update area of element
                            element.area = element.length;
                            break;
                        case "rectangle":
                            if (_this.eventService.parameter["width"] == undefined || _this.eventService.parameter["width"] == null) {
                                _this.eventService.parameter["width"] = _this.eventService.parameter["height"];
                            }
                            if (_this.eventService.parameter["height"] == undefined || _this.eventService.parameter["height"] == null) {
                                _this.eventService.parameter["height"] = _this.eventService.parameter["width"];
                            }
                            element.width = _this.eventService.parameter["width"] * app_eventService_2.cmToPx;
                            element.height = _this.eventService.parameter["height"] * app_eventService_2.cmToPx;
                            //update data path of rectangle on move
                            element.designDataPath = "M" + cursorX1 + " " + cursorY1 + " h" + element.width + " v" + element.height + " h-" + element.width + "Z";
                            //update area of element
                            element.area = (element.width * element.height) / (app_eventService_2.cmToPx * app_eventService_2.cmToPx);
                            break;
                        case "triangle":
                            if (_this.eventService.parameter["height"] == undefined || _this.eventService.parameter["height"] == null) {
                                _this.eventService.parameter["height"] = _this.eventService.parameter["base"];
                            }
                            if (_this.eventService.parameter["base"] == undefined || _this.eventService.parameter["base"] == null) {
                                _this.eventService.parameter["base"] = _this.eventService.parameter["height"];
                            }
                            element.base = _this.eventService.parameter["base"] * app_eventService_2.cmToPx;
                            element.height = _this.eventService.parameter["height"] * app_eventService_2.cmToPx;
                            //update data path of triangle on move
                            element.designDataPath = "M" + cursorX1 + " " + cursorY1 + " v" + element.height + " h" + element.base + "Z";
                            //update area of element
                            element.area = (element.base * element.height) / (2 * (app_eventService_2.cmToPx * app_eventService_2.cmToPx));
                            break;
                    }
                    _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                    _this.removeBorder();
                }
            });
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
        parameterForm.reset(); //reset form after submit data  
    };
    //cancel popup
    AppComponent.prototype.cancelPopup = function () {
        this.displayToast = false;
        this.editable = false;
        this.eventService.displayMenu = false;
    };
    //fill shape color
    AppComponent.prototype.fillColorHandler = function (colorValue) {
        var _this = this;
        this.eventService.shapeColor = colorValue;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id && element.shapeType != "freeHand") {
                element.fillColor = colorValue;
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        });
    };
    //fill stroke of shape
    AppComponent.prototype.strokeColorHandler = function (colorValue) {
        var _this = this;
        this.eventService.strokeColor = colorValue;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id) {
                element.strokeColor = colorValue;
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        });
    };
    //assign stroke width to selected element
    AppComponent.prototype.strokeWidthHandler = function (value) {
        var _this = this;
        this.eventService.pencilWidth = value; //assign pencil width 
        this.eventService.strokeWidth = value;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id) {
                element.strokeWidth = _this.eventService.strokeWidth;
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                _this.eventService.createDynamicRect();
            }
        });
    };
    //move back functionality of shape
    AppComponent.prototype.moveBack = function () {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id) {
                var index = _this.eventService.designData.indexOf(element);
                _this.eventService.designData.splice(0, 0, _this.eventService.designData.splice(index, 1)[0]);
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        });
        this.eventService.displayMenu = false;
        this.removeBorder();
    };
    //move front functionality for shape
    AppComponent.prototype.moveFront = function () {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id) {
                var index = _this.eventService.designData.indexOf(element);
                _this.eventService.designData.splice(_this.eventService.designData.length - 1, 0, _this.eventService.designData.splice(index, 1)[0]);
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
            }
        });
        this.eventService.displayMenu = false;
        this.removeBorder();
    };
    //copy shape
    AppComponent.prototype.copyShape = function () {
        var _this = this;
        var newShape;
        this.eventService.designData.forEach(function (element) {
            if (_this.eventService.selectedElement && element.id == _this.eventService.selectedElement.id) {
                // newShape = element;
                newShape = JSON.parse(JSON.stringify(element));
                newShape.id = _this.eventService.shapeId;
                _this.eventService.designData.push(newShape);
                _this.eventService.undoDataContainer.push(JSON.parse(JSON.stringify(element)));
                _this.eventService.shapeId++;
            }
        });
        this.eventService.displayMenu = false;
    };
    //editable group for sacling,rotation and translation of shape
    AppComponent.prototype.editShape = function (event) {
        var _this = this;
        event.stopPropagation(); // used to stop executions of its corresponding parent handler only.
        this.eventService.displayMenu = false;
        this.displayToast = false;
        this.eventService.freeHandDraw = false;
        this.eventService.draggedItem = true;
        this.eventService.selectedElement = event.target; // save targeted element into service variable 
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
        this.eventService.designData.forEach(function (data) {
            if (data.id == _this.eventService.selectedElement.id && data.shapeType == "freeHand") {
                _this.eraserActive = true;
            }
        });
    };
    //multiple shapes in single group
    AppComponent.prototype.multiShapeSelect = function (event) {
        var _this = this;
        this.eventService.designData.forEach(function (element) {
            if (element.id == _this.multiSelectId && event.target && event.target.id != _this.multiSelectId) {
                _this.eventService.designData.forEach(function (data) {
                    if (data.id == event.target.id) {
                        element.designDataPath += data.designDataPath;
                        _this.eventService.multiSelectContainer.push(data);
                        _this.deleteShape();
                        _this.chRef.detectChanges();
                        _this.eventService.selectedElement = _this.multiSelectRegion;
                        _this.eventService.createDynamicRect();
                    }
                });
            }
        });
    };
    // save svg image
    AppComponent.prototype.saveImage = function () {
        var nodeElement = this.imageContainer.nativeElement; //access svg container 
        console.log(nodeElement);
        this.downloadContent(nodeElement);
    };
    AppComponent.prototype.downloadContent = function (nodeElement) {
        domtoimage.toPng(nodeElement)
            .then(function (dataUrl) {
            var blobObject = this.urlToBlob(dataUrl);
            download(blobObject, "img.png", "image/png"); //download the image on browser
        }.bind(this)); //binding urlToBlob function
    };
    AppComponent.prototype.urlToBlob = function (dataUrl) {
        var byteString;
        if (dataUrl.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataUrl.split(',')[1]); //atob() function decodes a base-64 encoded string.
        else
            byteString = decodeURI(dataUrl.split(',')[1]);
        // separate out the mime component
        var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var blob = new Uint8Array(byteString.length); //8 bit unsigned interger typed array assigned with 0
        for (var i = 0; i < byteString.length; i++) {
            blob[i] = byteString.charCodeAt(i);
        }
        // return blob;
        return new Blob([blob], {
            type: mimeString
        });
    };
    //remove editable area before save the image
    AppComponent.prototype.removeBorder = function () {
        this.eventService.selectedElement = null;
        this.eraserActive = false;
        this.eventService.eraserStart = false;
        this.clearValues();
    };
    //remove shapes from svg container
    AppComponent.prototype.clearContainer = function () {
        this.clearValues();
        this.eventService.designData = new Array(); // remove all values form array
        //reset stroke width and color 
        this.eventService.shapeColor = "transparent";
        this.eventService.strokeColor = "#000";
        this.eventService.strokeWidth = 5;
    };
    //clear editable group
    AppComponent.prototype.clearValues = function () {
        this.eventService.displayMenu = false;
        this.displayToast = false;
        this.eventService.freeHandDraw = false;
        this.eventService.rectangleBorderWidth = null; //remove width and height of editable rectangle
        this.eventService.rectangleBorderHeight = null;
        this.eventService.smallCircleRadius = 0;
        this.eventService.rotateCircleRadius = 0;
        this.eventService.rotateCircleX = 0;
        this.eventService.rotateCircleY = 0;
        this.eventService.rotateLineX = 0;
        this.eventService.rotateLineY = 0;
        this.eventService.rectangleHeight = null;
        this.eventService.rectangleWidth = null;
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild('editBorder'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "editBorder", void 0);
__decorate([
    core_1.ViewChild('imageContainer'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "imageContainer", void 0);
__decorate([
    core_1.ViewChild('toasterContainer'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "toasterContainer", void 0);
__decorate([
    core_1.ViewChild('shapeContainer'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "shapeContainer", void 0);
__decorate([
    core_1.ViewChild('headerContainer'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "headerContainer", void 0);
__decorate([
    core_1.ViewChild('contextMenu'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "contextMenu", void 0);
__decorate([
    core_1.ViewChild('rotateShape'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "rotateShape", void 0);
__decorate([
    core_1.ViewChild('transformShape'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "transformShape", void 0);
__decorate([
    core_1.ViewChild('textContainerFirst'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "textContainerFirst", void 0);
__decorate([
    core_1.ViewChild('textContainerSecond'),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "textContainerSecond", void 0);
__decorate([
    core_1.HostListener('document:contextmenu', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "oncontextmenu", null);
__decorate([
    core_1.HostListener('document:keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "onkeydown", null);
__decorate([
    core_1.HostListener('document:keyup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "onkeyup", null);
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        styleUrls: ['./app.component.css'],
        templateUrl: './app.component.html'
    }),
    __metadata("design:paramtypes", [app_getJsonService_1.GetJsonService, app_eventService_1.EventService, core_1.ChangeDetectorRef])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map