import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {

  isHovering: boolean;
  @Input() header: string= "Drag and Drop a File";
  @Input() displayUploadedFiles:boolean = false;
  @Input() maxAllowedFileSize: number; // In KB
  @Input() isMultiple = true;
  @ViewChild('fileInput') fileInput;
  files: File[] = [];

  @Input() newFilename: string = undefined;

  @Input() uploadPath;
  @Output() imageUploaded: EventEmitter<any>= new EventEmitter();

  constructor(
    private notifier: NotifierService
  ){

  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    if(this.isMultiple){
      for (let i = 0; i < files.length; i++) {
        this.files.push(files.item(i));
      }
    }else{
      if(this.newFilename && !this.isMultiple){
        this.files[0] = this.renameFile(files.item(0), this.newFilename);
      }else{
        this.files[0] = files.item(0);
      }
    }
  }

  renameFile(originalFile, newName){
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
  }

  imageUploadComplete(downloadUrl, uploadPath){
    this.imageUploaded.emit({downloadUrl: downloadUrl, uploadPath: uploadPath});
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: File[] = this.fileInput.nativeElement.files;
    if(this.newFilename && !this.isMultiple){
      if(this.maxAllowedFileSize===undefined || files[0].size < this.maxAllowedFileSize*1024){
        this.files[0] = this.renameFile(files[0], this.newFilename);
        console.log(this.files);
      }else{
        this.notifier.notify("error", `Maximum allowed size is ${this.maxAllowedFileSize} KB`);
      }
    }else{
      for (let i = 0; i < files.length; i++) {
        if(this.maxAllowedFileSize===undefined || files[i].size < this.maxAllowedFileSize*1024){
          this.files.push(files[i]);
        }else{
          this.notifier.notify("error", `Maximum allowed size is ${this.maxAllowedFileSize} KB`);
        }
      }
    }
  }
}
