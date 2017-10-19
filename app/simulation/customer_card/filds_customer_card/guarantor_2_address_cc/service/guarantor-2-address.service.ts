import { Guarantor } from './../../../../dto/client/Guarantor.dto';
import { SimulationService } from './../../../../simulation.service';
import { AppMessage } from './../../../../../app.message';
import { AppService } from './../../../../../app.service';
import { MailingAddress } from './../../../../dto/client/MailingAddress.dto';
import { ResidenceType } from './../../../../dto/client/ResidenceType.dto';
import { Province } from './../../../../../commons/province/dto/province.dto';
import { Simulation } from './../../../../dto/Simulation.dto';
import { Injectable } from '@angular/core';
import { StepEnum } from './../../../../step.enum';
import { Address } from './../../../../dto/client/Address.dto';
import { TypePerson } from './../../../../dto/Client.dto';


@Injectable() 
export class GuarantorTwoAddressService {

    simulation: Simulation;
	listProvince: Array<Province> = new Array<Province>();
	listTypeResidence: Array<ResidenceType>= new Array<ResidenceType>();
	listMailingAddress: Array<MailingAddress> = new Array<MailingAddress>();
    isPhysicalPerson: boolean;	


    constructor(private appService: AppService, private appMessage: AppMessage, private simulationService: SimulationService) {
	};
	
	init() {
        this.simulationService.load.subscribe(( simulation: Simulation ) => {
            this.simulation = simulation;
            if(this.simulation && (this.simulation.step == StepEnum.STEP_CUSTOMER_CARD || this.simulation.step == StepEnum.STEP_MOBILE_GUARANTOR_TWO_ADDRESS)) {
			    this.onload();
            }
        });  
	}

	private initializeFields(){
		this.isPhysicalPerson = this.simulation.client.typePerson === TypePerson.PF;
		if(!this.simulation.client.guarantor2) this.simulation.client.guarantor2 = new Guarantor();
        if(!this.simulation.client.guarantor2.address) this.simulation.client.guarantor2.address = new Address();
		if(!this.simulation.client.guarantor2.address.province) 
							this.simulation.client.guarantor2.address.province = new Province();
		if(!this.simulation.client.guarantor2.address.mailingAddress) 
                            this.simulation.client.guarantor2.address.mailingAddress = new MailingAddress();
        if(!this.simulation.client.guarantor2.address.residenceType) 
                            this.simulation.client.guarantor2.address.residenceType = new ResidenceType();
	}

	onload(){
		this.initializeFields();
        this.loadProvince();
		this.loadTypeResidence();
		this.loadMailingAddress();
	}

	loadProvince() {
        let result = this.appService.xSearch('customerCardService', 'findAllProvince')
        result.subscribe(
            (data) => {
                let response = data.json();
                this.listProvince = response.provinceList;
            },
            err => {
                console.log(err.json());
            }
        );
    }


	loadTypeResidence() {
		let result = this.appService.xSearch('customerCardService', 'findAllTypeResidence')
		result.subscribe(
			(data) => {
				let response = data.json();
				this.listTypeResidence = response.listTypeResidence;
			},
			err => {
				console.log(err.json());
			}
		);
	}

	loadMailingAddress() {
		let result = this.appService.xSearch('customerCardService', 'findAllMailingAddress')
		result.subscribe(
			(data) => {
				let response = data.json();
				this.listMailingAddress = response.listMailingAddress;
			},
			err => {
				console.log(err.json());
			}
		);
	}


	disableFieldsByStatusDossier(): Boolean {
		if(this.simulation.readOnly) {return true}
		if(this.simulation.dossierStatus == 9){return true}
		return false;
	}

}