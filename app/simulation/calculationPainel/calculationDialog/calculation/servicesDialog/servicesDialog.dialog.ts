import { Service } from './../../../../dto/Service.dto';
import { Option } from './../../../../dto/Option.dto';
import { CalculationComponent } from './../calculation.component';
import { MdDialogRef } from '@angular/material';
import { AppService } from './../../../../../app.service';
import { Simulation } from './../../../../dto/Simulation.dto';

import { Component, Input, OnInit, NgModule, EventEmitter, Output } from '@angular/core';
import { ServiceResponseDTO } from "./ServiceResponseDTO";
import { AppMessage } from "../../../../../app.message";

@Component({
    selector: 'services-dialog',
    templateUrl: 'app/simulation/calculationPainel/calculationDialog/calculation/servicesDialog/servicesDialog.dialog.html',
   styleUrls: ['app/simulation/calculationPainel/calculationDialog/calculation/servicesDialog/servicesDialog.dialog.scss'],
})

export class ServicesDialog implements OnInit {
    simulation: Simulation;
    calculationID: string;
    serviceList:  Array<ServiceResponseDTO> = new Array<ServiceResponseDTO>();
    serviceCotizador:ServiceResponseDTO;
    itsSaleMan: boolean = true;
    
    
    constructor(private appService: AppService, public appMessage: AppMessage, public dialogRef: MdDialogRef<ServicesDialog>) {
    }

    ngOnInit(): void {
        let observable = this.appService.xSearch('userProfile', 'verifyuseradmin');
        observable.subscribe(
            (data) => {
                let response = data.json();
                if (response.userAdmin) {                    
                    this.itsSaleMan = false;
                }
            }
        );
    }

    onfocus(service: ServiceResponseDTO) {
        
    }

    validate(event, service: ServiceResponseDTO) {
       // this.appMessage.showWarning("event " + event);
       // console.log("event ", event, event.target.value);
        if (service.maxAmount) {
            if (event.target.value > service.maxAmount) {
                event.target.value = service.maxAmount;
                service.amount = service.maxAmount;
               // this.appMessage.showWarning("Max " + service.maxAmount);

            }
        }

        if (service.minAmount) {
            if (event.target.value < service.minAmount) {
                event.target.value = service.minAmount;
                service.amount = service.minAmount;
               // this.appMessage.showWarning("Min " + service.minAmount);
            }
        }
        if (!event || event === undefined ){
            service.amount = 0;
        }
    }

    disableFieldsByStatusDossier(): Boolean {
		if(this.simulation.readOnly) {return true}
		if(this.simulation.dossierStatus == 9){return true}
		return false;
	}

    checked($event,service){
        //Alterar para o ID descriptografado.
        // if(service.id == "G-Eyb3tFjjmtl3TJGraS0g"){
        if(service.serviceTypeId === 30){
            this.serviceCotizador = service;
        }       
    }

    contractServices() {
        // this.simulation.calculationSelected.serviceList = this.simulation.calculationSelected.services;
        this.dialogRef.close(true);
    }
}