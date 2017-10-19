import { GuarantorTwoAddressService } from './../service/guarantor-2-address.service';
import { Simulation } from './../../../../dto/Simulation.dto';
import { SpouseType } from './../../../../dto/client/SpouseType.enum';
import { Component, OnInit, Input, HostListener, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';


@Component({
	selector: 'guarantor-2-address-mobile',
	templateUrl: 'app/simulation/customer_card/filds_customer_card/guarantor_2_address_cc/mobile/guarantor-2-address-mobile-cc.component.html',
    providers: [GuarantorTwoAddressService]
})
export class GuarantorTwoAddressMobileComponent implements OnInit {

	@Output() countClient: EventEmitter<number> = new EventEmitter<number>();
	@Input() controlDynamicStepsIn: number;
	@Output() controlDynamicStepsM: EventEmitter<number> = new EventEmitter<number>();
	@Input() showSpouseGuarantor2:boolean;

	conf:boolean = false;

	constructor(private guarantorTwoAddressService: GuarantorTwoAddressService) {
	}

	ngOnInit() {
		this.guarantorTwoAddressService.init();
		this.getSimulation().client.guarantor2.address.residesInAddressSince = new Date(this.getSimulation().client.guarantor2.address.residesInAddressSince);
	}


	getListProvince() {
		return this.guarantorTwoAddressService.listProvince;
	}

	getListTypeResidence() {
		return this.guarantorTwoAddressService.listTypeResidence;
	}

	getListMailingAddress() {
		return this.guarantorTwoAddressService.listMailingAddress;
	}
	
	getSimulation(): Simulation {
		return this.guarantorTwoAddressService.simulation;
	}

	isSpouse():boolean{
		return (this.getSimulation().client.civilState.value == SpouseType.MARRIED ||
			this.getSimulation().client.civilState.value == SpouseType.LIFE_PARTNER)
	}
	
	isPhysicalPerson(){
		return this.guarantorTwoAddressService.isPhysicalPerson;
	}

	disableFieldsByStatusDossier(): Boolean {
		return this.guarantorTwoAddressService.disableFieldsByStatusDossier();
	}

	nextStep() {
		if (this.isPhysicalPerson() && this.showSpouseGuarantor2) {
			this.controlDynamicStepsIn = 17;
		} else {
			this.controlDynamicStepsIn = 18;
			this.getSimulation().step++;
		}
		if(!this.conf){
			this.countClient.emit();
			this.conf = true;
		}
		this.getSimulation().step++;
		this.controlDynamicStepsM.emit(this.controlDynamicStepsIn);
	}

}