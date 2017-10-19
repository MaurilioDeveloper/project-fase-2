import { SimulationService } from './../simulation.service';
import { HostListener, ElementRef } from '@angular/core';
import { AppMessage } from './../../app.message';
import { SpecialType } from './../dto/SpecialType.dto';
import { Version } from './../dto/Version.dto';
import { AppService } from './../../app.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Simulation } from './../dto/Simulation.dto';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StepEnum } from './../step.enum';

@Component({
	selector: 'listversion',
	templateUrl: './app/simulation/listversion/listversion.component.html',
	styleUrls: []
})
export class ListVersionComponent implements OnInit  {
	
	
	
	simulation: Simulation;
	constructor( private appService: AppService,
				 private appMessage :AppMessage, 
				 private simulationService: SimulationService) { }

	specialTypes:  Array<SpecialType> = new Array;
	versions: Array<Version>;
	verselect: Version;

	@ViewChild('carValue') carValor: ElementRef;
	private valor;
	

	yearManu: Array<number>;
	yearSelect: number;

	versionsYears: Array<Version>;
	versionSelected: Version = new Version;
	valueSelect: number;

	position = 'above';
	oldPriceVersion: number = 0;
	// total: number = 0;


	ngOnInit() {
        this.simulationService.load.subscribe(( simulation: Simulation ) => {
			this.simulation = simulation;
            if(this.simulation && this.simulation.step == StepEnum.STEP_VEHICLE){
			    this.onload();
            }
        });  
	}

	@HostListener('blur', ['$event'])
	valueCar($event){
		let valorDoCarro = this.carValor.nativeElement.value.replace('R$ ','');
		
		valorDoCarro = valorDoCarro.split(',');

		if(valorDoCarro[0].toString() === "0" && valorDoCarro[1].toString() === "00") {
			this.appMessage.showError("O valor do veículo é inválido !");
			this.simulation.car.version.price = 0;
		}
		
	}


	private onload(){
		let buscaver = {};
		buscaver["vehicleType"] = "NOVO";
		buscaver["modelId"] = this.simulation.car.id;

		let buscaSepcial = {};
		if (this.simulation.specialTypes) {
			buscaSepcial['selected'] = [];
			for (var i = 0; i < this.simulation.specialTypes.length; i++) {
				buscaSepcial['selected'].push(this.simulation.specialTypes[i].id);
			}
		}

		let specialget = this.appService.xSearchWithData('specialtypes', buscaSepcial);
		specialget.subscribe(
			(data) => {
				let listver: Array<Version> = new Array();
				let response = data.json();
				for (var i = 0; i < response.specialTypes.length; i++) {
					let type: SpecialType = new SpecialType();
					type.id = response.specialTypes[i].specialTypeId;
					type.description = response.specialTypes[i].description;
					this.specialTypes.push(type);
					/*
					if(response.selected != null){
						for (var a = 0; a < response.selected.length; a++) {
							if (this.specialTypes[i].id === response.selected[a]["specialTypeId"]) {
								this.simulation.specialTypes.push(type);
							}
						}
					}*/
				}
			});

		let carsget = this.appService.xSearchWithData('vehicleVersion', buscaver);
		carsget.subscribe(
			(data) => {
				let listver: Array<Version> = new Array();
				let response = data.json();

				for (var i = 0; i < response.vehicleVersionDtoList.length; i++) {
					let vehicleVer = response.vehicleVersionDtoList[i];
					let ver: Version = new Version;
					ver.description = vehicleVer["description"];
					ver.fipe = vehicleVer["fipe"];
					listver.push(ver);
				}
				this.versions = listver;
				this.loadVersion(this.versions[0])
			},
			err => {
				console.log(err.json());
			}
		);

	}


	changeVersion($event) {
		if(!this.simulation.readOnly) {
			this.loadVersion($event.value);
		}
	} 

	 updateTotal(value) {
        if(value.length > 0 && ( value < 0 || isNaN(parseFloat(value)))){
             value = this.oldPriceVersion;
            // this.appMessage.showWarning("Valor " +  value +this.oldPriceVersion);
		}
		console.log("PASS"+value);
        if(value){
            value = value.toString().replace('R$ ',"").replace(',',".")
            this.simulation.car.version.price = parseFloat(value);
            // this.recalc();
        }
    }


	loadVersion(version : Version){
		this.verselect = version;
		let buscaManuYear = {};
		buscaManuYear["description"] = this.verselect.description;
		buscaManuYear["fipe"] = this.verselect.fipe;
		buscaManuYear["vehicleType"] = "NOVO";
		let yearsManuget = this.appService.xSearchWithData('vehicleVersion/manufactureYears', buscaManuYear);

		yearsManuget.subscribe(
			(data) => {
				this.yearManu = new Array();
				let response = data.json();

				for (var i = 0; i < response.manufactureYears.length; i++) {
					let vehicleVer = response.manufactureYears[i];
					this.yearManu.push(vehicleVer);
				}
				if(this.yearManu[0]){
					this.yearSelect = this.yearManu[0];
				}
				this.loadManuYear();
			},
			err => {
				console.log(err.json());
			}
		);
	}


	changeManuYear() {
		this.loadManuYear();
	}

	loadManuYear() {
		let buscaModelYear = {};
		buscaModelYear["description"] = this.verselect.description;
		buscaModelYear["fipe"] = this.verselect.fipe;
		buscaModelYear["vehicleType"] = "NOVO";
		buscaModelYear["manufactureYear"] = this.yearSelect;
		let yearsManuget = this.appService.xSearchWithData('vehicleVersion/modelYears', buscaModelYear);

		yearsManuget.subscribe(
			(data) => {
				this.versionsYears = new Array();
				let response = data.json();
				
				for (var i = 0; i < response.modelYears.length; i++) {
					let vehicleVer = response.modelYears[i];
					let ver: Version = new Version;
					ver.id = vehicleVer["versionId"];
					ver.description = this.verselect.description;
					ver.fipe = this.verselect.fipe;
					ver.yearManufacture = this.yearSelect;
					ver.yearModel = vehicleVer["yearModel"];
					ver.url = this.verselect.url;
					this.versionsYears.push(ver);
				}
				if(this.versionsYears[0]){
					this.versionSelected = this.versionsYears[0];
				}
				this.getValue(this.versionSelected);
			},
			err => {
				console.log(err.json());
			}
		);

	}



	getValue(newValue) {

		let valueGet = this.appService.xSearch('vehiculePrice', this.versionSelected.id);

		valueGet.subscribe(
			(data) => {
				let listyear: Array<Version> = new Array();
				let response = data.json();
				let value = response.vehiclePriceDTO;
				if(!value || value === null){
					//Veiculo esta sem preço 
 					this.appMessage.showError("Este veiculo nas configurações selecionadas não tem preço definido");
					return;

				}
				this.valueSelect = value["amount"];
				this.versionSelected.price = this.valueSelect;
				this.simulation.car.version = this.versionSelected;
			},
			err => {
				console.log(err.json());
			}
		);
		
	}

}
