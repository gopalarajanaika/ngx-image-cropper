import { Component } from '@angular/core';
import { NgxImageEditorComponent } from "ngx-image-editor";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gallery';
  name = 'Angular 6';
  config: any = {
    ImageName: 'profile-image',
    AspectRatios: ["1:1", "4:3", "16:9"],
    ImageUrl: '',
    ImageType: 'image/jpeg',
    reflect: 'crop'
  }
  staticImg: any;
  element: any;
  cropBoxWidth: any;

  ngxImgEditor: NgxImageEditorComponent;

  public close(event) {
    console.log("Closed");
    console.log(event);
  }
  public load(event) {
    console.log("loaded");
    console.log(event);
    console.log(this.ngxImgEditor);
  }
  public getEditedFile(file: File) {
    console.log(file);
    console.log(this.ngxImgEditor);
  }

  saveMe() {
    console.log(this.ngxImgEditor);
  }

  setImageToTag(event) {

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.config.ImageUrl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    this.config.ImageUrl = "";

    console.log(this.cropBoxWidth);
  }

}
