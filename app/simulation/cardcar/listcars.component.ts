import { Simulation } from './../dto/Simulation.dto';
import { AppService } from './../../app.service';
import { Car } from './../dto/Car.dto';
import { Component, Input,Output,EventEmitter } from '@angular/core';

@Component({
    selector: 'listcars',
    templateUrl:  './app/simulation/cardcar/listcars.component.html',
    styleUrls: ['./app/simulation/cardcar/listcars.component.scss']
})

export class ListCars {
   @Input() cars:[Car];
   @Input() utilitarios:[Car];
   @Input() simulation: Simulation;
 
   @Output() carselect: EventEmitter<Car> = new EventEmitter();
    constructor(private appService: AppService) {}

    public select(event, car) {
        if(!this.simulation.readOnly || car.selected) {
            this.carselect.emit(car);

            this.cars.forEach(element => {
                element.selected =false;
            });
            this.utilitarios.forEach(element => {
                element.selected =false;
            });

            car.selected = true;
        }

    } 

    
    disableFieldsByStatusDossier(): Boolean {
		if(this.simulation.readOnly) {return true}
		if(this.simulation.dossierStatus == 9 || this.simulation.dossierStatus == 3){return true}
		return false;
	}

}


