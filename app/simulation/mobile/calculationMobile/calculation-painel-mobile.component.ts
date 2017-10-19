import { SimulationService } from './../../simulation.service';
import { InstallmentsDialog } from './../../calculationPainel/calculationDialog/calculation/installmentsDialog/installments.dialog';
import { AppService } from './../../../app.service';
import { Calculation } from './../../dto/Calculation.dto';
import { Simulation } from './../../dto/Simulation.dto';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Component, Input, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StepEnum } from './../../step.enum';

@Component({
	selector: 'calculationpainel-mobile',
	templateUrl: 'app/simulation/mobile/calculationMobile/calculation-painel-mobile.component.html',
	styleUrls: []
})
export class CalculationMobileComponent implements OnInit {
	simulation: Simulation;
	calculationqta: number;
	showCalculations: boolean[] = [false, false, false];
	showCalculationsPreview: boolean[] = [false, false, false];
	private browser;

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
		var ua = window.navigator.userAgent;
		var firefox = ua.indexOf('Firefox');

		if (firefox > 0) {
			// IE 10 or older => return version number
			this.browser = "firefox";
		}

		if (!this.simulation.calculations || this.simulation.calculations.length === 0) {
			this.getProposalQuantity();
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

	removeCalculation(key) {
		this.simulation.calculations[key] = undefined;
		this.showCalculations[key] = false;
	}

	contratado(key) {
		this.showCalculationsPreview[key] = true;
	}

	dados(listInstallments: Object[]) {

	}

	change(event) {
		this.simulation.step = 6;
	}

}