import { InstallmentGroup } from './../../../dto/InstallmentGroup.dto';
import { Observable } from 'rxjs/Observable';
import { Repackage } from './../../../dto/Repackage.dto';
import { SimulationService } from './../../../simulation.service';
import { ObservableMedia } from '@angular/flex-layout';
import { Service } from './../../../dto/Service.dto';
import { Coefficient } from './../../../dto/Coefficient.dto';
import { Installment } from './../../../dto/Installment.dto';
import { InstallmentsDialog } from './installmentsDialog/installments.dialog';
import { Commission } from './../../../dto/Commission.dto';
import { FinancialTable } from './../../../dto/FinancialTable.dto';
import { FinancialType } from './../../../dto/FinancialType.dto';
import { CalculationDialog } from './../calculationDialog.dialog';
import { ServicesDialog } from './servicesDialog/servicesDialog.dialog';
import { MdDialog } from '@angular/material';
import { Calculation } from './../../../dto/Calculation.dto';
import { AppService } from './../../../../app.service';
import { Simulation } from './../../../dto/Simulation.dto';
import { Component, Input, OnInit, Output, NgModule, EventEmitter, ViewChild } from '@angular/core';
import { TypePerson } from "../../../dto/Client.dto";
import { AppMessage } from "../../../../app.message";
import { StepEnum } from './../../../step.enum';
import { ServiceResponseDTO } from "./servicesDialog/ServiceResponseDTO";
import { FinancialTablePromotional } from "../../../dto/FinancialTablePromotional.dto";


@Component({
    selector: 'calculation',
    templateUrl: 'app/simulation/calculationPainel/calculationDialog/calculation/calculation.component.html'
})

export class CalculationComponent implements OnInit {
    simulation: Simulation;
    @Input() calculationID: string;
    @Output() removeCalculation: EventEmitter<string> = new EventEmitter<string>();

    entrancePerc: number = 0;
    commisionList = new Array<Commission>();
    financialTypeList = new Array<FinancialType>();
    financialTableList = new Array<FinancialTable>();
    delayList = new Array<number>();
    installmentsGroup: InstallmentGroup[];
    repackageList = new Array<Repackage>();
    termList = new Array<number>();
    taxType = new Array<String>();
    isCDCFlex: boolean = false;
    calculation: Calculation;
    settingEntrace: boolean = false;
    loadSetDefaultPercentage: boolean = true;
    
    //Mobile
    showMobileEditDetail: boolean[] = [false, false, false];
    // editMobileCalc: boolean[] = [false, false, false];
    serviceList:  Array<ServiceResponseDTO> = new Array<ServiceResponseDTO>();

    constructor(private appService: AppService, private appMessage: AppMessage, public dialog: MdDialog, 
                        public media: ObservableMedia, private simulationService: SimulationService) {
    }

    ngOnInit() {
        this.simulationService.load.subscribe(( simulation: Simulation ) => {
            this.simulation = simulation;
            if(this.simulation && this.simulation.step == StepEnum.STEP_SIMULATION){
			    this.onload();
            }
        });  
    }

	private onload(){
        this.initializedFields();
        this.loadFinancialTypeSyncronized();
        if(!this.media.isActive('xs')) {
            this.showMobileEditDetail = [true, true, true];
        }
    }

    initializedFields(){
        if (this.simulation.client.cpfCnpj.length == 14) {
            this.simulation.client.typePerson = TypePerson.PJ
        } else {
            this.simulation.client.typePerson = TypePerson.PF
        }

        this.calculation = this.simulation.calculations[this.calculationID];

        this.sunTotalAmount();
        if(!this.calculation.commission) this.calculation.commission = new Commission;
        if(!this.calculation.coeficiente) this.calculation.coeficiente = new Coefficient;
    }
    
    //carregando as combos de forma sincronizada
    async loadFinancialTypeSyncronized() {
        await this.loadFinancialType().toPromise();
        if(this.calculation.financialType.financeTypeId){
            this.loadFinancialTableSyncronized();
        }
    }

    //carregando as combos de forma sincronizada
    async loadFinancialTableSyncronized() {
        await this.loadFinancialTable().toPromise();
        if(this.calculation.financialTable.productId){
            this.loadFinancialOthersSyncronized();
        }
    }

    //carregando as combos de forma sincronizada
    async loadFinancialOthersSyncronized() {
        await this.loadServices().toPromise();
        await this.loadComission().toPromise();
        await this.loadTerm().toPromise();
        //busca pacote caso o item selecionado seja CDC Flex
        if(this.isCDCFlex){
            await this.loadRepackage().toPromise();
        }
        await this.loadDelay().toPromise();

        if(this.loadSetDefaultPercentage){
            this.setDefaultPercentage();
            this.loadSetDefaultPercentage = false;
        }

        this.calculate();        
    }

       /**
     * Financial Type 
     * */

    loadFinancialType(): Observable<any>{
        let requestFinancialType = new Object;
        if (this.simulation.id) {
            requestFinancialType["financeTypeSelected"] = this.calculation.financialType.financeTypeId;
        } else {
            this.calculation.selected = false;
        }
        let getFinancialType = this.appService.xSearchWithData('financeTypeService/getFinancialType', requestFinancialType);
        getFinancialType.subscribe(
            (data) => {
                let financeTypeResponse = data.json();
                for (var i = 0; i < financeTypeResponse.listFinanceType.length; i++) {
                    var financeType = financeTypeResponse.listFinanceType[i];
                    this.financialTypeList.push(financeType);
                    if (!financeTypeResponse.financeTypeSelected) {
                        this.selectFinanceTypeDefault();
                    } else {
                        if (financeType.financeTypeId === financeTypeResponse.financeTypeSelected.financeTypeId) {
                            this.calculation.financialType = financeType;
                        }
                    }
                }
                this.isCDCFlex = this.isCDCFlexSelected();
            },
            err => {
                console.log(err.json());
            }
        );
        return getFinancialType;
    }

   loadFinancialTable(): Observable<any> {
        let requestFinancialTable = new Object;
        let financialTableSelected = null;

        if (this.simulation.id) {
            financialTableSelected = this.calculation.financialTable;
        }
        requestFinancialTable["idCalculation"] = this.calculationID;
        requestFinancialTable["vehicleVersion"] = this.simulation.car.version.id;

        if (this.simulation.client.typePerson) {
            requestFinancialTable["personType"] = this.simulation.client.typePerson;
        }
        let specialVehicleTypes = new Array<String>();
        if (this.simulation.specialTypes) {
            for (var i = 0; i < this.simulation.specialTypes.length; i++) {
                specialVehicleTypes.push(this.simulation.specialTypes[i].id)
            }
        }

        requestFinancialTable["saleType"] = this.simulation.saleType.id;
        requestFinancialTable["specialVehicleTypes"] = specialVehicleTypes;
        requestFinancialTable["modelYear"] = this.simulation.car.version.yearModel;
        requestFinancialTable["manufactureYear"] = this.simulation.car.version.yearManufacture;
        requestFinancialTable["financeTypeId"] = this.calculation.financialType.financeTypeId;
        requestFinancialTable["vehicleType"] = this.simulation.car.gender;
        this.cleanAll();
        //this.calculation.financialTable = null;
        let getFinancialTable = this.appService.xSearchWithData('productService/questProduct', requestFinancialTable);
        getFinancialTable.subscribe(
            (data) => {
                let financeTableResponse = data.json();
                for (var i = 0; i < financeTableResponse.listProduct.length; i++) {
                    var financeTable = financeTableResponse.listProduct[i];
                    this.financialTableList.push(financeTable);

                    if(financialTableSelected && financialTableSelected.productId == financeTable.productId){
                        this.calculation.financialTable = financeTable;
                    }
                }

                if (this.financialTableList && this.financialTableList.length > 0) {
                    if (!this.calculation.financialTable || !this.calculation.financialTable.productId) {
                        for (var i = 0; i < this.financialTableList.length; i++) {
                            let table = this.financialTableList[i];
                            if (table.promotional) {
                                this.calculation.financialTable = table;
                            }
                        }

                        if (!this.calculation.financialTable || !this.calculation.financialTable.productId) {
                            this.calculation.financialTable = this.financialTableList[0];
                        }
                    }

                    this.setDefaultPercentage();

                } else {
                    this.appMessage.showError("Não existem tabelas de financiamento elegíveis para os dados informados")
                }
            },
            err => {
                console.log(err.json());
            }
        );
        return getFinancialTable;
    }

  // recupera a comisão
    loadComission(): Observable<any> {
        let requestCommission = new Object;
        this.calculation.commission = new Commission;
        if (this.simulation.id) {
            requestCommission["commissionId"] = this.calculation.commission.id;
        }
        requestCommission["financeTypeId"] = this.calculation.financialType.financeTypeId;
        requestCommission["saleTypeId"] = this.simulation.saleType.id;
        requestCommission["financeTableId"] = this.calculation.financialTable.productId;
        requestCommission["promotionTable"] = this.calculation.financialTable.promotional;

        let getCommisionTable = this.appService.xSearchWithData('commissionLevelService/questCommissionAndTempCommission', requestCommission);
        getCommisionTable.subscribe(
            (data) => {
                let commisionTableResponse = data.json();
                this.commisionList = new Array<Commission>();

                for (var i = 0; i < commisionTableResponse.listUserCommission.length; i++) {
                    var financeCommision = commisionTableResponse.listUserCommission[i];

                    let financialTablePromotional : FinancialTablePromotional;

                    if(this.calculationID == "0" && this.calculation.financialTable.promotional && this.calculation.financialTable.listProductPromotional){
                        for (var index = 0; index < this.calculation.financialTable.listProductPromotional.length; index++) {
                            var element = this.calculation.financialTable.listProductPromotional[index];

                            if(element.commissionId === financeCommision.id){
                                financialTablePromotional = element;
                                this.commisionList.push(financeCommision);
                                break;
                            }
                        }

                    } else {
                        this.commisionList.push(financeCommision);
                    }

                    if(financialTablePromotional && financialTablePromotional.mainSource && (!this.calculation.commission || !this.calculation.commission.id)){
                        this.calculation.commission = financeCommision;
                    }
                }

                this.commisionList.sort((a, b) => Number(a.description.trim()) - Number(b.description.trim()))
                if (!this.calculation.commission || !this.calculation.commission.description) {
                    this.calculation.commission = this.commisionList[this.commisionList.length - 1]
                }

            },
            err => {
                console.log(err.json());
            }
        );

        return getCommisionTable;
    }

    loadTerm(): Observable<any> {
        let requestdelay = new Object;
        requestdelay["productId"] = this.calculation.financialTable.productId;
        requestdelay["personType"] = this.simulation.client.typePerson;

        let getTerm = this.appService.xSearchWithData('poductCoefficient/term', requestdelay);

        getTerm.subscribe(
            (data) => {
                let financilaTermResponse = data.json();
                this.termList = new Array<number>();
                //this.calculation.term = undefined;
                for (var i = 0; i < financilaTermResponse.listTerm.length; i++) {
                    var entity = financilaTermResponse.listTerm[i];
                    let financialTablePromotional : FinancialTablePromotional;

                    if(this.calculationID == "0" && this.calculation.financialTable.promotional && this.calculation.financialTable.listProductPromotional){
                        for (var index = 0; index < this.calculation.financialTable.listProductPromotional.length; index++) {
                            var element = this.calculation.financialTable.listProductPromotional[index];

                            if(element.term === entity){
                                financialTablePromotional = element;
                                this.termList.push(entity);
                                break;
                            }
                        }
                    } else {
                        this.termList.push(entity);
                    }

                    if(financialTablePromotional && financialTablePromotional.mainSource && !this.calculation.term){
                        this.calculation.term = entity;
                    }

                }

                if (!this.calculation.term && this.termList.length > 0) {
                    this.calculation.term = this.termList[0];
                }
  
            });
            return getTerm;
    }
 
    loadRepackage(): Observable<any>{
        let observable = this.appService.xSearch('repackageService',
                        this.calculation.financialTable.productId  + '/' + this.calculation.term);
        observable.subscribe(
            (data) => {
                let response = data.json();
                this.repackageList = new Array<Repackage>();

                for (var index = 0; index < response.listRepackage.length; index++) {
                    var repackage = response.listRepackage[index];
                    
                    let financialTablePromotional : FinancialTablePromotional;

                    if(this.calculationID == "0" && this.calculation.financialTable.promotional && this.calculation.financialTable.listProductPromotional){
                        for (var index = 0; index < this.calculation.financialTable.listProductPromotional.length; index++) {
                            var element = this.calculation.financialTable.listProductPromotional[index];

                            if(element.repackageId && element.repackageId === repackage.id){
                                financialTablePromotional = element;
                                this.repackageList.push(repackage);
                                break;
                            }
                        }                        
                    } else {
                        this.repackageList.push(repackage);
                    }

                    if(financialTablePromotional && financialTablePromotional.mainSource && !this.calculation.repackage){
                        this.calculation.repackage = repackage;
                    }

                }
                
                if(!this.calculation.repackage && this.repackageList[0]){
                    this.calculation.repackage = this.repackageList[0];
                }
                
			},
			err => {
				console.log(err.json());
            }
        );

        return observable;
    }

     loadDelay(): Observable<any> {
        let requestdelay = new Object;
        requestdelay["productId"] = this.calculation.financialTable.productId;
        requestdelay["personType"] = this.simulation.client.typePerson;
        let getdelay = this.appService.xSearchWithData('delayValue', requestdelay);

        getdelay.subscribe(
            (data) => {
                let delayResponse = data.json();
                this.delayList = new Array<number>();
                
                for (var i = 0; i < delayResponse.listDelayValue.length; i++) {
                    var entity = delayResponse.listDelayValue[i];

                    let financialTablePromotional : FinancialTablePromotional;

                    if(this.calculationID == "0" && this.calculation.financialTable.promotional && this.calculation.financialTable.listProductPromotional){
                        for (var index = 0; index < this.calculation.financialTable.listProductPromotional.length; index++) {
                            var element = this.calculation.financialTable.listProductPromotional[index];

                            if(element.delayValue === entity){
                                financialTablePromotional = element;
                                this.delayList.push(entity);
                                break;
                            }
                        }
                        
                    } else {
                        this.delayList.push(entity);
                    }

                    if(financialTablePromotional && financialTablePromotional.mainSource && !this.calculation.delay){
                        this.calculation.delay = entity;
                    }

                }
                if (!this.calculation.delay && this.delayList.length > 0) {
                    this.calculation.delay = this.delayList[0];
                }
            },
            err => {
				console.log(err.json());
            });
        return getdelay;    
    }


    /**
     * seleciona o tipo de produto default
     */
    private selectFinanceTypeDefault(){
        
        let resultList = this.financialTypeList.filter(
                            function (financialType) { return financialType.description ===  'CDC'});
   
        if(resultList[0]){
            this.calculation.financialType = resultList[0];
        }
    }

 

    cleanAll() {
        this.financialTableList = new Array<FinancialTable>();
        this.calculation.financialTable = new FinancialTable;
        //this.calculation.entranceValue = 0;
        //this.entrancePerc = 0;

        this.commisionList = new Array<Commission>();
        this.calculation.commission = undefined;

        this.financialTableList = new Array<FinancialTable>();
        this.delayList = new Array<number>();
        this.repackageList = new Array<Repackage>();
        this.calculation.repackage = null;
        this.calculation.delay = undefined;
        //this.termList = new Array<number>();
        //this.calculation.term = undefined;
        
    }

    changeFinancialType() {
        this.isCDCFlex = this.isCDCFlexSelected();
        this.loadFinancialTableSyncronized();
    }

    changeFinancialTable() {
        this.loadFinancialOthersSyncronized();
    }

    async changeTerm(){
        if(this.isCDCFlex){
            await this.loadRepackage().toPromise();
        }
        this.calculate();
    }

    totalServicesCalculate(){
        let totalServices = 0;
        if (this.calculation.services) {
            this.calculation.services.forEach(service => {
                if(service.serviceTypeId != 5){ // 'SEGURO PROTEÇÃO FINANCEIRA'
                    totalServices += service.amount;
                }
            });
        }

        return totalServices;
    }    

    setEntranceValue(){
       let total = this.totalServicesCalculate() + this.calculation.totalValue;
       this.calculation.entranceValue = (total * this.entrancePerc) / 100 ; 
       this.settingEntrace = true;
    }

    setEntrancePerc(){
        let total = this.totalServicesCalculate() + this.calculation.totalValue;
        this.entrancePerc = (this.calculation.entranceValue * 100) / total ; 
        this.settingEntrace = true;
    }

    installmentsDialog() {
        let dialogRef = this.dialog.open(InstallmentsDialog, { height: '85%', width: '50%' });
        dialogRef.componentInstance.installments = this.calculation.installments;
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    removeSimulation(key) {
        this.simulation.editOneCalcMobile = false;
        this.removeCalculation.emit(this.calculationID)
    }

    private isCDCFlexSelected(): boolean{
        
        let financialTypeId = this.calculation.financialType.financeTypeId;
        let resultList = this.financialTypeList.filter(
                            function (financialType) { return financialType.financeTypeId ===  financialTypeId});
        if(resultList[0]){
            return resultList[0].description === 'CDC Flex';
        }
        
        this.calculation.repackage = null;
        return false;
    }

    previuscondition() {
        if(!this.disableFieldsByStatusDossier()) {
            let pos = this.commisionList.indexOf(this.calculation.commission);
            pos--;
            if (pos >= 0) {
                this.calculation.commission = this.commisionList[pos];
                this.calculate();
            }
        }
    }

    nextcondition() {
        if(!this.disableFieldsByStatusDossier()) {
            let pos = this.commisionList.indexOf(this.calculation.commission);
            pos++;
            if (pos <= (this.commisionList.length - 1)) {
                this.calculation.commission = this.commisionList[pos];
                this.calculate();
            }
        }
    }

    loadServices(): Observable<any> {
        if (!this.calculation.services) {
            this.calculation.services = [];
        }
        //tratamento se o objeto de simulação ja vier preenchido
        /*
        if (this.calculation.services.length != 0) {
            this.calcValue();
            this.loadFinancialTable();
            return;
        }
        */
        let itsSaleMan;
        let observable = this.appService.xSearch('userProfile', 'verifyuseradmin');
        observable.subscribe(
            (data) => {
                let response = data.json();
                if (response.userAdmin) {
                    itsSaleMan = false;
                } else {
                    itsSaleMan = true;
                }
            });
        let query = {};
        query["structureId"] = this.simulation.salesmanStructure.structureId;
        query["productId"] = this.calculation.financialTable.productId;
        query["vehicleType"] = this.simulation.car.vehicleType;
        query["financeType"] = this.calculation.financialType.financeTypeId;

        this.calculation.services = [];
        let services = this.appService.xSearchWithData("serviceService/questService", query)
        services.subscribe(
            (data) => {
                let serviceResponse = data.json();
                this.serviceList = serviceResponse.listService;

                this.serviceList.forEach(response => {
                    if (response.required || response.selecetedDefault) {
                        response.checked = true;
                        this.calculation.services.push(response);
                    }
                });
            }
        );
        
        return services;
    }
    
    servicesAndInsurance() {
        let dialogRef = this.dialog.open(ServicesDialog, { height: '85%', width: '50%' });

        dialogRef.componentInstance.serviceList = this.serviceList;
        dialogRef.componentInstance.simulation = this.simulation;
        dialogRef.componentInstance.calculationID = this.calculationID;
        dialogRef.afterClosed().subscribe(result => {
            this.calculation.services.length = 0;
            dialogRef.componentInstance.serviceList.forEach(exist => {
                if (exist.checked) {
                    this.calculation.services.push(exist);
                }
            });
            this.sunTotalAmount();
            this.calculate();
            this.calculation.serviceCotizador = dialogRef.componentInstance.serviceCotizador;
        });

    }

    contract(){
          //Mobile
        /**
         * Habilita a tela de visualização (no fluxo MOBILE), pelo qual,
         * apresenta os dados da Simulação Contratada.
         */
        this.simulation.reviewContractSimulation = true;

        //remove o selecionado das simulações
        for(let calculation of this.simulation.calculations){
            calculation.selected = false;
        }
        this.simulation.calculationSelected = this.calculation;
        this.calculation.selected = true;
        this.simulation.showBtnSave = true;
    }

    calculate() {
        let varRepackage = null;
        if(this.isCDCFlex){
            varRepackage = this.calculation.repackage.id;
        }

        let specialVehicleTypes = new Array<String>();
        if (this.simulation.specialTypes) {
            for (var i = 0; i < this.simulation.specialTypes.length; i++) {
                specialVehicleTypes.push(this.simulation.specialTypes[i].id)
            }
        }

        let requestCalculate = {
            deposit: this.calculation.entranceValue,
            totalVehicleAmount: this.calculation.totalValue,
            repackageId: varRepackage,
            commissionId: this.calculation.commission.id,
            productId: this.calculation.financialTable.productId,
            saleTypeId: this.simulation.saleType.id,
            financeTypeId: this.calculation.financialType.financeTypeId,
            vehicleVersionId: this.simulation.car.version.id,
            personType: this.simulation.client.typePerson,
            term: this.calculation.term,
            delayValue: this.calculation.delay,
            province: this.simulation.client.address.province.id,
            tcExempt: this.simulation.tc,
            vehiclesSpecial: specialVehicleTypes,
            services: this.calculation.services
        };

        let newCalculate = this.appService.xSearchWithData('simulationCalc/calculate', requestCalculate);
        newCalculate.subscribe(
            (data) => {
                let response = data.json();
                this.calculation.financedAmount = response.calculate.totalAmountFinanced;
                this.calculation.coeficiente.coeffcientId = response.calculate.coeffcientId;
                this.calculation.coeficiente.taxCoefficient = response.calculate.taxCoefficient;
                this.calculation.entranceValue = response.calculate.deposit;
                this.calculation.installments = response.calculate.listInstalment;
                this.installmentsGroup = response.calculate.listInstalmentGroup;
                this.entrancePerc = response.calculate.depositPercent;

                if(this.calculation.selected){
                    this.simulation.calculationSelected = this.calculation;
                }

            },
            err => {
                console.log(err.json());
            }
        );        
        this.settingEntrace = false;    
    }

      //deprecated
    sunTotalAmountViaService(){
        let request = {
            vehicleAmount: this.simulation.car.version.price,
            services: this.calculation.services,
            options: this.simulation.car.version.options,
            acessories: this.simulation.car.version.acessories,
           
        };

        let depositCalculate = this.appService.xSearchWithData('simulationCalc/depositCalculate', request);
        depositCalculate.subscribe(
            (data) => {
                let response = data.json();
                this.calculation.totalValue = response.totalAmount;

            },
            err => {
                console.log(err.json());
            }
        );            
    }

    sunTotalAmount(){
        this.calculation.totalValue = this.simulation.car.version.price;
        
        if (this.simulation.car.version.options) {
            this.simulation.car.version.options.forEach(option => {
                this.calculation.totalValue += option.amount;

            });
        }

        if (this.simulation.car.version.acessories) {
            this.simulation.car.version.acessories.forEach(acessory => {
                this.calculation.totalValue += acessory.amount;
            });
        }
   }

    verifyShowEditDetailMobile() {
        if(!this.media.isActive('xs')) {
            return false;
        }
        if(this.simulation.editOneCalcMobile){
            return false;
        }
        return true;
    }


    editCalculation() {
        this.simulation.editOneCalcMobile = true;
        this.showMobileEditDetail[this.calculationID] = true;
        this.simulation.detailSimulation = true;
    }

    compare() {
        this.simulation.editOneCalcMobile = false;
        this.showMobileEditDetail[this.calculationID] = false;
        this.simulation.detailSimulation = false;
    }

    disableFieldsByStatusDossier(): Boolean {
		if(this.simulation.readOnly) {return true}
		if(this.simulation.dossierStatus == 9){return true}
		return false;
	}

    setDefaultPercentage(){
        if(this.calculationID == "0" && this.calculation.financialTable.promotional && this.calculation.financialTable.listProductPromotional){
            let promotional = null;
            for (var index = 0; index < this.calculation.financialTable.listProductPromotional.length; index++) {
                let element = this.calculation.financialTable.listProductPromotional[index];

                if(element.mainSource){
                    promotional = element;
                }
            }

            if(promotional){
                this.entrancePerc = promotional.depositPercent * 100;
                this.setEntranceValue();
            }
        }
    }

}