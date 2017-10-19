import { Service } from './../../dto/Service.dto';
import { SimulationService } from './../../simulation.service';
import { FormClientService } from './../service/form-client.service';
import { Simulation } from './../../dto/Simulation.dto';
import { MdDialogRef } from '@angular/material';
import { AppMessage } from './../../../app.message';
import { AppService } from './../../../app.service';
import { Component, Input, OnInit, NgModule, EventEmitter, Output } from '@angular/core';


@Component({
    selector: 'dialog-quation',
    templateUrl: 'app/simulation/card_client/dialogQuotation/dialogQuotation.dialog.html',
    providers: [FormClientService]
  
})

export class QuotationDialog implements OnInit { 
    @Output() changeStep: EventEmitter<boolean> = new EventEmitter<boolean>();
    simulation: Simulation;

    constructor( private appService: AppService, 
                 private appMessage: AppMessage, 
                 private dialogRef: MdDialogRef<QuotationDialog>,
                 private formClientService: FormClientService,
                 private simulationService: SimulationService ) { }


    ngOnInit() {
        this.simulationService.load.subscribe((simulation: Simulation) => {
            this.simulation = simulation;
            if (this.simulation) {
                this.onload();
            }
        });
    }

    private onload() {
       
    }

    getSimulation(): Simulation {
		return this.simulation;
	}
    
    removeService(){
        this.simulation.calculationSelected.serviceList.forEach(service =>{
            if(service.id == "G-Eyb3tFjjmtl3TJGraS0g"){
                service.checked = false;
            }


        });
        this.dialogRef.close();
        this.changeStep.emit(true);
    }

    closeDialog(){
        this.getSimulation().client.cpfCnpj = this.getSimulation().client.aux.cpfCnpj;
		this.getSimulation().client.name = this.getSimulation().client.aux.name;
		this.getSimulation().client.email = this.getSimulation().client.aux.email;
		this.getSimulation().client.phone.number = this.getSimulation().client.aux.phone.number;
		this.getSimulation().client.province = this.getSimulation().client.aux.province;
		this.getSimulation().saleType = this.getSimulation().client.aux.saleType;
        this.dialogRef.close();
    }             
    
} 