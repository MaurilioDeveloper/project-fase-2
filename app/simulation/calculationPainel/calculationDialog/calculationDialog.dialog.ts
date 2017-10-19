import { Calculation } from './../../dto/Calculation.dto';
import { SimulationService } from './../../simulation.service';
import { CalculationComponent } from './calculation/calculation.component';
import { StepEnum } from './../../step.enum';
import { AppService } from './../../../app.service';
import { Simulation } from './../../dto/Simulation.dto';
import { Component, Input, OnInit, NgModule, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MdDialogRef } from '@angular/material';



@Component({
    selector: 'calculation-dialog',
    templateUrl: 'app/simulation/calculationPainel/calculationDialog/calculationDialog.dialog.html'
})

export class CalculationDialog implements OnInit {
    simulation: Simulation;
    calculationqta: number;
    showCalculations:boolean[] = [false, false, false];

    constructor(private appService: AppService, public dialogRef: MdDialogRef<CalculationDialog>,
        private simulationService: SimulationService) { }

    ngOnInit() {
        this.simulationService.load.subscribe((simulation: Simulation) => {
            this.simulation = simulation;
            if (this.simulation && this.simulation.step == StepEnum.STEP_SIMULATION) {
                this.onload();
            }
        });
    }

    private onload() {
        
        if (!this.simulation.calculations || this.simulation.calculations.length === 0) {
            this.simulation.calculations = [new Calculation];
            for(let i = 0; i < this.calculationqta; i++){
                this.simulation.calculations[i] = new Calculation;
                this.showCalculations[i] = true;
            }
        }else{
            for(let i = 0; i < this.simulation.calculations.length; i++){
                  this.showCalculations[i] = true;
             }
        }
    }

    
    addCalculation(key) {
        //this.enable = true;
        if(!this.simulation.readOnly && this.simulation.dossierStatus != 9){
            if(this.calculationqta < 1){
                this.simulation.calculations[key] = new Calculation;
            }else{
                //copia a anterior
                if(this.simulation.calculations[key-1]){
                    this.simulation.calculations[key] = {...this.simulation.calculations[key-1]};
                }else{
                    this.simulation.calculations[key] = {...this.simulation.calculations[key-2]};
                }
                this.simulation.calculations[key].id = null;
                this.simulation.calculations[key].selected = false;
            }
            this.showCalculations[key] = true;   
        }
       
    }

    removeCalculation(key) {
        if(!this.simulation.readOnly && this.simulation.dossierStatus != 9){
            this.simulation.calculations[key] = undefined;
            this.showCalculations[key] = false;   
        }
    }

}