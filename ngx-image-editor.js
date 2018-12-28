import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

var NgxImageEditorComponent = /** @class */ (function () {
    function NgxImageEditorComponent() {
        this.file = new EventEmitter();
        this.zoomIn = 0;
        this.sliderValue = 0;
        this.loading = true;
        this.canvasFillColor = '#fff';
        this.state = new EditorOptions();
    }
    Object.defineProperty(NgxImageEditorComponent.prototype, "config", {
        set: function (config) {
            this.state = config;
        },
        enumerable: true,
        configurable: true
    });
    NgxImageEditorComponent.prototype.ngOnInit = function () {
        this.handleStateConfig();
    };
    NgxImageEditorComponent.prototype.ngOnDestroy = function () {
        this.cropper.destroy();
    };
    NgxImageEditorComponent.prototype.ngAfterViewInit = function () {
        if (!this.state.File && this.state.ImageUrl) {
            this.initializeCropper();
        }
    };
    NgxImageEditorComponent.prototype.handleStateConfig = function () {
        this.state.ImageType = this.state.ImageType ? this.state.ImageType : 'image/jpeg';
        if (this.state.ImageUrl) {
            this.state.File = null;
            this.previewImageURL = this.state.ImageUrl;
        }
        if (this.state.File) {
            this.state.ImageUrl = null;
            this.convertFileToBase64(this.state.File);
        }
        if (this.state.AspectRatios) {
            this.addRatios(this.state.AspectRatios);
        }
        else {
            this.ratios = NGX_DEFAULT_RATIOS;
        }
        if (!this.state.ImageUrl && !this.state.File) {
            console.error("Property ImageUrl or File is missing, Please provide an url or file in the config options.");
        }
        if (!this.state.ImageName) {
            console.error("Property ImageName is missing, Please provide a name for the image.");
        }
    };
    NgxImageEditorComponent.prototype.convertFileToBase64 = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.addEventListener("load", function (e) {
            _this.previewImageURL = e.target["result"];
        }, false);
        reader.readAsDataURL(file);
        reader.onloadend = (function () {
            _this.initializeCropper();
        });
    };
    NgxImageEditorComponent.prototype.addRatios = function (ratios) {
        var _this = this;
        this.ratios = [];
        ratios.forEach(function (ratioType) {
            var addedRation = NGX_DEFAULT_RATIOS.find(function (ratio) {
                return ratio.text === ratioType;
            });
            _this.ratios.push(addedRation);
        });
    };
    NgxImageEditorComponent.prototype.handleCrop = function () {
        var _this = this;
        this.loading = true;
        setTimeout(function () {
            _this.croppedImage = _this.cropper.getCroppedCanvas({ fillColor: _this.canvasFillColor })
                .toDataURL(_this.state.ImageType);
            setTimeout(function () {
                _this.imageWidth = _this.croppedImg.nativeElement.width;
                _this.imageHeight = _this.croppedImg.nativeElement.height;
            });
            _this.cropper.getCroppedCanvas({ fillColor: _this.canvasFillColor }).toBlob(function (blob) {
                _this.blob = blob;
            });
            _this.zoomIn = 1;
            _this.loading = false;
        }, 2000);
    };
    NgxImageEditorComponent.prototype.undoCrop = function () {
        var _this = this;
        this.croppedImage = null;
        this.blob = null;
        setTimeout(function () {
            _this.initializeCropper();
        }, 100);
    };
    NgxImageEditorComponent.prototype.saveImage = function () {
        this.file.emit(new File([this.blob], this.state.ImageName, { type: this.state.ImageType }));
    };
    NgxImageEditorComponent.prototype.initializeCropper = function () {
        var _this = this;
        this.cropper = new Cropper(this.previewImage.nativeElement, {
            zoomOnWheel: true,
            viewMode: 0,
            center: true,
            ready: function () { return _this.loading = false; },
            dragMode: 'crop',
            crop: function (e) {
                _this.imageHeight = Math.round(e.detail.height);
                _this.imageWidth = Math.round(e.detail.width);
                _this.cropBoxWidth = Math.round(_this.cropper.getCropBoxData().width);
                _this.cropBoxHeight = Math.round(_this.cropper.getCropBoxData().height);
                _this.canvasWidth = Math.round(_this.cropper.getCanvasData().width);
                _this.canvasHeight = Math.round(_this.cropper.getCanvasData().height);
            }
        });
        this.setRatio(this.ratios[0].value);
    };
    NgxImageEditorComponent.prototype.setRatio = function (value) {
        this.cropper.setAspectRatio(value);
    };
    NgxImageEditorComponent.prototype.zoomChange = function (input, zoom) {
        if (this.croppedImage) {
            if (zoom) {
                zoom === 'zoomIn' ? this.zoomIn += 0.1 : this.zoomIn -= 0.1;
            }
            else {
                if (input < this.sliderValue) {
                    this.zoomIn = -Math.abs(input / 100);
                }
                else {
                    this.zoomIn = Math.abs(input / 100);
                }
            }
            if (this.zoomIn <= 0.1) {
                this.zoomIn = 0.1;
            }
        }
        else {
            if (zoom) {
                this.cropper.zoom(input);
                this.zoomIn = input;
            }
            else {
                if (input < this.sliderValue) {
                    this.cropper.zoom(-Math.abs(input / 100));
                }
                else {
                    this.cropper.zoom(Math.abs(input / 100));
                }
                if (input === 0) {
                    this.cropper.zoom(-1);
                }
            }
        }
        if (!zoom) {
            this.sliderValue = input;
        }
        else {
            input > 0 ? this.sliderValue += Math.abs(input * 100) : this.sliderValue -= Math.abs(input * 100);
        }
        if (this.sliderValue < 0) {
            this.sliderValue = 0;
        }
    };
    NgxImageEditorComponent.prototype.setImageWidth = function (canvasWidth) {
        if (canvasWidth) {
            this.cropper.setCanvasData({
                left: this.cropper.getCanvasData().left,
                top: this.cropper.getCanvasData().top,
                width: Math.round(canvasWidth),
                height: this.cropper.getCanvasData().height
            });
        }
    };
    NgxImageEditorComponent.prototype.setImageHeight = function (canvasHeight) {
        if (canvasHeight) {
            this.cropper.setCanvasData({
                left: this.cropper.getCanvasData().left,
                top: this.cropper.getCanvasData().top,
                width: this.cropper.getCanvasData().width,
                height: Math.round(canvasHeight)
            });
        }
    };
    NgxImageEditorComponent.prototype.setCropBoxWidth = function (cropBoxWidth) {
        if (cropBoxWidth) {
            this.cropper.setCropBoxData({
                left: this.cropper.getCropBoxData().left,
                top: this.cropper.getCropBoxData().top,
                width: Math.round(cropBoxWidth),
                height: this.cropper.getCropBoxData().height
            });
        }
    };
    NgxImageEditorComponent.prototype.setCropBoxHeight = function (cropBoxHeight) {
        if (cropBoxHeight) {
            this.cropper.setCropBoxData({
                left: this.cropper.getCropBoxData().left,
                top: this.cropper.getCropBoxData().top,
                width: this.cropper.getCropBoxData().width,
                height: Math.round(cropBoxHeight)
            });
        }
    };
    NgxImageEditorComponent.prototype.centerCanvas = function () {
        var cropBoxLeft = (this.cropper.getContainerData().width - this.cropper.getCropBoxData().width) / 2;
        var cropBoxTop = (this.cropper.getContainerData().height - this.cropper.getCropBoxData().height) / 2;
        var canvasLeft = (this.cropper.getContainerData().width - this.cropper.getCanvasData().width) / 2;
        var canvasTop = (this.cropper.getContainerData().height - this.cropper.getCanvasData().height) / 2;
        this.cropper.setCropBoxData({
            left: cropBoxLeft,
            top: cropBoxTop,
            width: this.cropper.getCropBoxData().width,
            height: this.cropper.getCropBoxData().height
        });
        this.cropper.setCanvasData({
            left: canvasLeft,
            top: canvasTop,
            width: this.cropper.getCanvasData().width,
            height: this.cropper.getCanvasData().height
        });
    };
    return NgxImageEditorComponent;
}());
NgxImageEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-image-editor',
                template: `<div class="ngx-image-editor-component">
                <div class="photo-editor-header">
                    <div class="file-name">{{state.ImageName}}</div>
                    <button [hidden]="croppedImage" (click)="handleCrop()"> Crop</button>
                    <button [hidden]="croppedImage" (click)="centerCanvas()"> Re-center</button>
                    <button [hidden]="croppedImage" (click)="zoomChange(0.1, 'zoomIn')"> zoom in</button>
                    <button [hidden]="croppedImage" (click)="zoomChange(-0.1, 'zoomOut')"> zoom out</button>
                    <input 
                             id="imageWidth"
                             placeholder="Canvas width"
                             type="number"
                             (ngModelChange)="setImageWidth($event)"
                             [ngModel]="canvasWidth">
                             <input 
                             id="imageHeight"
                             placeholder="Canvas height"
                             type="number"
                             (ngModelChange)="setImageHeight($event)"
                             [ngModel]="canvasHeight">
                             <input 
                             id="cropBoxWidth"
                             placeholder="Cropbox width"
                             type="number"
                             (ngModelChange)="setCropBoxWidth($event)"
                             [ngModel]="cropBoxWidth">
                             <input 
                             id="cropBoxHeight"
                             placeholder="Cropbox height"
                             type="number"
                             (ngModelChange)="setCropBoxHeight($event)"
                             [ngModel]="cropBoxHeight">

                             

                  <select (change)="setRatio($event.value)" value="4:3">
                    <option>1:1</option>
                    <option>4:3</option>
                  </select>
                </div><br/>
                <div #dialogCropContainer class="dialog-crop-container">
                    <ng-template [ngIf]="!croppedImage">
                        <div [style.visibility]="loading ? 'hidden' : 'visible' " [style.background]="canvasFillColor" class="img-container">
                            <img #previewimg [src]="previewImageURL">
                                </div>
                    </ng-template>
                    <ng-template [ngIf]="croppedImage && !loading">
                        <div class="cropped-image">
                            <img #croppedImg [ngStyle]="{'transform': 'scale(' + zoomIn + ')'}" [src]="croppedImage">
                                            </div>
                    </ng-template>
                </div>
                <div class="dialog-button-actions" >
                    <div class="image-detail-toolbar"> </div>
                    <div class="cropped-image-buttons" [style.visibility]="!croppedImage ? 'hidden' : 'visible' ">
                        <button (click)="saveImage()"> <span>Save</span> </button>
                        <button (click)="undoCrop()"> <span>Undo</span> </button>
                    </div>
                    <div [style.visibility]="croppedImage ? 'hidden' : 'visible' ">
                    </div>
                    <div class="canvas-config" [style.visibility]="croppedImage ? 'hidden' : 'visible' ">
                    </div>
                </div>
            </div>`,
                styles: [".ngx-image-editor-component img{max-width: 100%;}"],
                encapsulation: ViewEncapsulation.None
            },] },
];
NgxImageEditorComponent.ctorParameters = function () { return []; };
NgxImageEditorComponent.propDecorators = {
    "previewImage": [{ type: ViewChild, args: ['previewimg',] },],
    "croppedImg": [{ type: ViewChild, args: ['croppedImg',] },],
    "config": [{ type: Input },],
    "file": [{ type: Output },],
};
var EditorOptions = /** @class */ (function () {
    function EditorOptions() {
    }
    return EditorOptions;
}());
var NGX_DEFAULT_RATIOS = [
    {
        value: 16 / 9, text: '16:9'
    },
    {
        value: 4 / 3, text: '4:3'
    },
    {
        value: 1 / 1, text: '1:1'
    },
    {
        value: 2 / 3, text: '2:3'
    },
    {
        value: 0 / 0, text: 'Default'
    }
];
var NgxImageEditorModule = /** @class */ (function () {
    function NgxImageEditorModule() {
    }
    NgxImageEditorModule.forRoot = function () {
        return {
            ngModule: NgxImageEditorModule,
        };
    };
    return NgxImageEditorModule;
}());
NgxImageEditorModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    FormsModule,
                    BrowserAnimationsModule,
                    CommonModule,
                    ReactiveFormsModule
                ],
                declarations: [
                    NgxImageEditorComponent
                ],
                exports: [NgxImageEditorComponent]
            },] },
];

export { NgxImageEditorModule, NgxImageEditorComponent, EditorOptions, NGX_DEFAULT_RATIOS };
//# sourceMappingURL=ngx-image-editor.js.map
