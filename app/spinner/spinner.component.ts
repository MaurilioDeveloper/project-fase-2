import { AppService } from './../app.service';
import { SpinnerService } from './spinner.service';
import { TranslateModule } from './../translate/translate.module';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';


@Component({

    selector: 'spinner-component',
    template:''
})
export class SpinnerComponent implements OnInit{

   private spinnerRef : MdDialogRef<SpinnerComponentDialog>;
  
   //private subscription: Subscription;

   public constructor(private dialog : MdDialog, private spinnerService : SpinnerService){
        /*
          this.subscription = this.spinnerService.notifyObservable.subscribe((value) => {
            this.display(value);
         });*/

    }

    public ngOnInit(){
        this.spinnerService.status.subscribe(( val: boolean ) => {
            this.display(val);
        });  
    }
    

    public display(show : boolean){
       if(show){
           this.open();
       }else{
           this.close();
       }
    }

    open(){
        this.spinnerRef = this.dialog.open(SpinnerComponentDialog, {disableClose: true, panelClass: 'spinner_transparent'});
    }

    close(){
        if(this.spinnerRef && this.spinnerRef.componentInstance && this.spinnerRef.componentInstance.spinnerId){
            this.spinnerRef.componentInstance.closeDialog();
        }
    }

    ngOnDestroy() {
        this.spinnerService.status.unsubscribe();
        //this.subscription.unsubscribe();
    }
}


@Component({
    selector: 'spinner-component-dialog',
    templateUrl: 'app/spinner/spinner.component.dialog.html',

 
})
export class SpinnerComponentDialog {
    public constructor(public dialogRef: MdDialogRef<SpinnerComponentDialog>){}

    public spinnerId:number = 1;

    closeDialog() {
        this.dialogRef.close();
    }
}