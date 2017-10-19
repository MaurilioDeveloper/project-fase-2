import { Phone } from './../dto/client/Phone.dto';
import { Historic } from './../dto/client/Historic.dto';
import { QuotationDialog } from './dialogQuotation/dialogQuotation.dialog';
import { FormClientService } from './service/form-client.service';
import { Subscription } from 'rxjs/Subscription';
import { SimulationService } from './../simulation.service';
import { ObservableMedia } from '@angular/flex-layout';
import { AppComponent } from './../../app.component';
import { SalesmanStructure } from './../dto/SalesmanStructure.dto.';
import { AppMessage } from './../../app.message';
import { SelectedSalesmanDialog } from './../selected_salesman_dialog/selectedSalesman.dialog';
import { MdDialog, MdDialogRef } from '@angular/material';
import { SaleType } from './../dto/SaleType.dto';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../login/auth.service';
import { Province } from './../../commons/province/dto/province.dto';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { StepperComponent } from './../../stepper/stepper.component';
import { Simulation } from './../dto/Simulation.dto';
import { Car } from './../dto/Car.dto';
import { Client, TypePerson } from './../dto/Client.dto';
import { Component, OnInit, Input, HostListener, Output, EventEmitter, ViewChild, ElementRef, OnChanges, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { Salesman } from "../selected_salesman_dialog/dto/salesman.dto";


@Component({
	selector: 'form-client',
	templateUrl: 'app/simulation/card_client/form_client.component.html',
	providers: [FormClientService]
})
export class FormClientComponent implements OnInit, OnDestroy {
	
	@Output() changeStep: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild('ff') ff: ElementRef;
	@ViewChild('emailElement') emailValid: ElementRef;
	@ViewChild('cpfcnpjElement') cpfcnpjValid: ElementRef;
	@ViewChild('phoneElement') phoneValid: ElementRef;

	@ViewChild('nameClient') nameClient: ElementRef;

	private step: StepperComponent;
	//ID FIXO DA BASE DE DADOS
	private complexForm: FormGroup;
	private cpfcnpjClass;
	private phoneClass;
	private isViewInitialized: boolean = false;
	private forceClose = false;
	private segAuto: boolean = false;
	// private dialogOn: boolean = false;
	


	private SEMI_NOVOS = 2;

	constructor(private appMessage: AppMessage, private media: ObservableMedia, private formClientService: FormClientService, 
                public dialog: MdDialog) {
	};

	ngOnInit() {
		this.formClientService.init();
		//Verifica se tem algum serviço "Cotizador" contratado. 
		if(this.getSimulation().calculationSelected.selected){
			if(this.getSimulation().calculationSelected.serviceCotizador){
				this.segAuto = true;
			}
		}
	}
	
	getSimulation(): Simulation {
		return this.formClientService.simulation;
	}

	getListSaleType(): Object[] {
		return this.formClientService.listSaleType;
	}

	getListProvinces(): Object[] {
		return this.formClientService.listProvinces;
	}

	changeSaleType(event: any) {
		let saleType = event.value.value;
		if (saleType === this.SEMI_NOVOS) {
			if (this.getSimulation().car && !this.getSimulation().showNewOnes) {
				this.getSimulation().car = undefined;
			}
			this.getSimulation().showNewOnes = true;
		} else {
			this.getSimulation().showNewOnes = false;
		}
	}

	ngAfterViewInit() {
		this.isViewInitialized = true;
	}

	change(toFront: boolean) {
		if(!this.segAuto){
			this.saveInfo();
			this.changeStep.emit(toFront);
		}else{
			if(this.verifyChange()){
				this.quotationDialog();
			}
		}
	}

	quotationDialog(){
		let dialogRef = this.dialog.open(QuotationDialog, { width: '50%' });
		//Envia opção de pular steps para dialog
		dialogRef.componentInstance.changeStep = this.changeStep;
    }

   saveInfo(){
	   this.getSimulation().client.aux = new Historic();
	   this.getSimulation().client.aux.cpfCnpj = this.getSimulation().client.cpfCnpj;
	   this.getSimulation().client.aux.name = this.getSimulation().client.name;
	   this.getSimulation().client.aux.email = this.getSimulation().client.email;
	   this.getSimulation().client.aux.phone.number = this.getSimulation().client.phone.number;
	   this.getSimulation().client.aux.province = this.getSimulation().client.province;
	   this.getSimulation().client.aux.saleType = this.getSimulation().saleType;
   }

   verifyChange(){
	   if(this.segAuto){
		   if(this.getSimulation().client.aux.cpfCnpj != this.getSimulation().client.cpfCnpj){
			   return true;
		   }
		   if(this.getSimulation().client.aux.name != this.getSimulation().client.name){
			   return true;
		   }
		   if(this.getSimulation().client.aux.phone.number != this.getSimulation().client.phone.number){
			   return true;
		   }
		   if(this.getSimulation().client.aux.email != this.getSimulation().client.email){
			   return true;
		   }
		   if(this.getSimulation().client.aux.province != this.getSimulation().client.province){
			   return true;
		   }	
		   if(this.getSimulation().client.aux.saleType != this.getSimulation().saleType){
			   return true;
		   }
	   }
   }

   @HostListener('blur', ['$event'])
	blurEmail($event) {
		if (this.emailValid.nativeElement.className.indexOf('ng-invalid') != -1) {
			this.appMessage.showError("Campo E-mail inválido");
		}

	}

	validForm(valid) {
		if (this.isViewInitialized) {
			this.cpfcnpjClass = this.cpfcnpjValid.nativeElement.className.indexOf('ng-invalid');
			this.phoneClass = this.phoneValid.nativeElement.className.indexOf('ng-invalid');
		}
		if (valid && this.cpfcnpjClass == -1 && this.phoneClass == -1) {
			this.getSimulation().step1CanNext = true;
			return true
		}
		this.getSimulation().step1CanNext = false;
		return false;
	}

	ngOnDestroy() {
		if (this.formClientService.dialogRef) {
			this.forceClose = true;
			this.formClientService.dialogRef.close();
		}
	}
	
    disableFieldsByStatusDossier(): Boolean {
		return this.formClientService.disableFieldsByStatusDossier();
	}

	disableFieldsByStatusThree(): Boolean {
		return this.formClientService.disableFieldsByStatusThree();
	}
	
}