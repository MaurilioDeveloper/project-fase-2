import { SimulationService } from './../../../simulation.service';
import { ServicesDialog } from './../../../calculationPainel/calculationDialog/calculation/servicesDialog/servicesDialog.dialog';
import { InstallmentsDialog } from './../../../calculationPainel/calculationDialog/calculation/installmentsDialog/installments.dialog';
import { Service } from './../../../dto/Service.dto';
import { Coefficient } from './../../../dto/Coefficient.dto';
import { Installment } from './../../../dto/Installment.dto';
import { Commission } from './../../../dto/Commission.dto';
import { FinancialTable } from './../../../dto/FinancialTable.dto';
import { FinancialType } from './../../../dto/FinancialType.dto';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Calculation } from './../../../dto/Calculation.dto';
import { AppService } from './../../../../app.service';
import { Simulation } from './../../../dto/Simulation.dto';
import { Component, Input, OnInit, Output, NgModule, EventEmitter } from '@angular/core';
import { TypePerson } from "../../../dto/Client.dto";
import { AppMessage } from "../../../../app.message";
import { StepEnum } from './../../../step.enum';


@Component({
    selector: 'calculation-mobile',
    templateUrl: 'app/simulation/mobile/calculationMobile/calculationPainelMobile/calculation-mobile.component.html'
})
export class CalculationPainelMobileComponent implements OnInit {
    simulation: Simulation;
    calculationqta: number;
    showCalculations: boolean[] = [false, false, false];
    @Input() calculationID;
    editCalculationDetails: boolean[] = [false, false, false];

    constructor(private appService: AppService,
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
            for(let i = 0; i < this.simulation.calculations.length; i++){
                this.simulation.calculations[i] = new Calculation;
                this.showCalculations[i] = true;
            }
        }else{
            for(let i = 0; i < this.simulation.calculations.length; i++){
                  this.showCalculations[i] = true;
             }
        }
    }


    getProposalQuantity() {
        let observable = this.appService.xSearch('userProfile', 'proposalquantity');
        observable.subscribe(
            (data) => {
                let response = data.json();
                let qtaCalc = response.proposalQuantity;
                if (this.simulation.calculations && this.simulation.calculations.length > 1) {
                    qtaCalc = this.simulation.calculations.length;
                }
            },
            err => {
                console.log(err.json());
            }
        );
    }


    addCalculation(key) {
        //this.enable = true;
        if(!this.simulation.readOnly && this.simulation.dossierStatus != 9){
            if (this.calculationqta < 1) {
                this.simulation.calculations[key] = new Calculation;
            } else {
                //copia a anterior
                if (this.simulation.calculations[key - 1]) {
                    this.simulation.calculations[key] = { ...this.simulation.calculations[key - 1] };
                } else {
                    this.simulation.calculations[key] = { ...this.simulation.calculations[key - 2] };
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
            this.simulation.detailSimulation = false;
        }
    }

    compare(key) {
        this.editCalculationDetails[key] = false;
    }


    editCalculation(key) {
        this.editCalculationDetails[key] = true;
    }



}