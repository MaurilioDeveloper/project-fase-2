import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SpinnerComponent } from './spinner.component';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Subject }    from 'rxjs/Subject';


@Injectable()
export class SpinnerService{
/*
    private notify = new Subject<any>();
    notifyObservable = this.notify.asObservable();
*/
    private queueService : Array<any> = new Array<any>();
    private opened : boolean;


    public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    public display(show : boolean){
       //this.notify.next(show);

       if(show){
           this.queueService.push(show);
            if(!this.opened){
                this.status.next(true);
                this.opened = true;
            }  
        }else{
            this.queueService.splice(this.queueService.length-1);
        
                setTimeout(() => {
                if(this.queueService.length < 1 && this.opened){
                            this.status.next(false);
                            this.opened = false;
                    }
                }, 2000);

        }

      
    }

}