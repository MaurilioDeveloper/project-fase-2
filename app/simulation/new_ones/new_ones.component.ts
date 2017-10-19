import { NewOnesService } from './service/new-ones.service';
import { SimulationService } from './../simulation.service';
import { MdDialog } from '@angular/material';
import { Brand } from './../dto/Brand.dto';
import { SpecialType } from './../dto/SpecialType.dto';
import { AppService } from './../../app.service';
import { Acessorio } from './../dto/Acessorio.dto';
import { Simulation } from './../dto/Simulation.dto';
import { Version } from './../dto/Version.dto';
import { Car } from './../dto/Car.dto';
import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms/forms";
import { ObservableMedia } from "@angular/flex-layout";
import { DiscardInsuranceQuoteDialog } from './../discardInsuranceQuoteDialog/discard-insurance-quote-dialog.dialog';

@Component({
    selector: 'new-ones',
    templateUrl: 'app/simulation/new_ones/new_ones.component.html',
    providers: [NewOnesService]
})
export class NewOnesComponent implements OnInit {

    @Output() changeStep: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();
    
    enableButton: boolean;
  
    private varBtnMarca: string = 'keyboard_arrow_up';
    private varBtnDrop: string = 'keyboard_arrow_up';
    private drop: boolean = false;

    private seguroAutoCotizador: boolean = false;

    private initialCar;
    private initialBrand;
    private initialSpecialTypes;
    
    constructor(private newOnesService: NewOnesService, public dialog: MdDialog, public media: ObservableMedia, private simulationService: SimulationService) {
        this.newOnesService.init();
    };

    ngOnInit() {
        if (this.getSimulation().calculationSelected.selected && this.getSimulation().calculationSelected.serviceCotizador) {
            this.seguroAutoCotizador = true;
        }
        this.saveInitialValues();
    }

    getSimulation(): Simulation {
        return this.newOnesService.simulation;
    }

    getAcessorio(): Acessorio {
        return this.newOnesService.acessorio;
    }

    addAcessorio(acessorio: Acessorio) {
        this.newOnesService.addAcessorio(acessorio);
    }

    delAcessorio(acessorio: Acessorio) {
        this.newOnesService.delAcessorio(acessorio);
    }

    getTotal(): number {
        return this.newOnesService.total;
    }

    getSubtotalAccessories(): number {
        return this.newOnesService.subtotalAccessories;
    }

    getListVehicleBrand(): Object[] {
        return this.newOnesService.listVehicleBrand;
    }

    getListVehicleModel(): Object[] {
        return this.newOnesService.listVehicleModel;
    }

    getListVehicleVersion(): Object[] {
        return this.newOnesService.listVehicleVersion;
    }

    getVersionYears(): Object[] {
        return this.newOnesService.versionYears;
    }

    getManufactreYears(): Object[] {
        return this.newOnesService.manufactreYears;
    }

    getSpecialTypes(): Object[] {
        return this.newOnesService.specialTypes;
    }

    loadModels(event: any) {
        this.newOnesService.loadModels(event);
    }

    loadVersions(event: any) {
        this.newOnesService.loadVersions(event);
    }
    
    loadModelYears(event: any) {
        this.newOnesService.loadModelYears(event);
    }

    loadManufactureYears(event: any) {
        this.newOnesService.loadManufactureYears(event);
    }

    loadBrands() {
        this.newOnesService.loadBrands();
    }


    clicked() {
        if (this.drop) {
            this.drop = false;
            this.varBtnMarca = 'keyboard_arrow_down';
        } else {
            this.drop = true;
            this.varBtnMarca = 'keyboard_arrow_up';
        }
    }
  
    recalcTotal(event: any, campo, fff: NgForm) {
        if (fff.form.valid) {
            this.getSimulation().step2CanNext = true;
        } else {
            this.getSimulation().step2CanNext = false;
        }
        this.newOnesService.recalcT();
    }

    saveManufactureYears(newValue) {
        this.getSimulation().car.version.yearManufacture = newValue;
    }

    addSpecialType(e, specialType: Array<SpecialType>, idSpecialType) {
        console.log(e);
        if (e.checked) {
            this.getSimulation().specialTypes.push(specialType[0]);
        } else {
            var index = this.getSimulation().specialTypes.indexOf(idSpecialType);
            this.getSimulation().specialTypes.splice(index, 1);
        }
    }

    disableFieldsByStatusDossier(): Boolean {
		return this.newOnesService.disableFieldsByStatusDossier();
    }
    
    change(toFront: boolean) {
        if (this.seguroAutoCotizador 
        && this.verifyChanges()) {
            this.openDiscardInsuranceQuoteDialog();
        } else {
            this.changeStep.emit(toFront);
        }
    }

    openDiscardInsuranceQuoteDialog() {
        let dialogRef = this.dialog.open(DiscardInsuranceQuoteDialog, { width: '50%' });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            this.getSimulation().calculations
            if (dialogRef.componentInstance.response) {
                if (this.getSimulation().calculationSelected.services) {
                    this.getSimulation().calculationSelected.services.forEach(service =>{
                        if(service.serviceTypeId === 30){
                            service.checked = false;
                        }
                    });
                }
                this.changeStep.emit(dialogRef.componentInstance.response);
            } else {
                this.loadInitialValues();
                this.newOnesService.init();
                this.newOnesService.recalcT();
            }
        });
    }

    verifyChanges() : boolean {
        if (JSON.stringify(this.getSimulation().brand) != this.getSimulation().initialBrand) {
            return true;
        }
        if (JSON.stringify(this.getSimulation().car) != this.getSimulation().initialCar) {
            return true;
        }
        if (JSON.stringify(this.getSimulation().specialTypes) != this.getSimulation().initialSpecialTypes) {
            return true;
        }
        return false;
    }

    saveInitialValues() {
        this.getSimulation().initialBrand = JSON.stringify(this.getSimulation().brand);
        this.getSimulation().initialCar = JSON.stringify(this.getSimulation().car);
        this.getSimulation().initialSpecialTypes = JSON.stringify(this.getSimulation().specialTypes);
    }

    loadInitialValues() {
        this.getSimulation().brand = JSON.parse(this.getSimulation().initialBrand);
        this.getSimulation().car = JSON.parse(this.getSimulation().initialCar);
        this.getSimulation().specialTypes = JSON.parse(this.getSimulation().initialSpecialTypes);
    }

}