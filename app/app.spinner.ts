import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaderService {
    public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


    private queueService : Array<any> = new Array<any>();
    private opened : boolean;


    display(value: boolean) {
        if(value){
           this.queueService.push(value);
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