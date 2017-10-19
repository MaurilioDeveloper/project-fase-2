import { SendSimulationDialog } from './customer_card/send_simulation_dialog/send_simulation.dialog';
import { SimulationService } from './simulation.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SalesmanStructure } from './dto/SalesmanStructure.dto.';
import { Salesman } from './selected_salesman_dialog/dto/salesman.dto';
import { AppComponent } from './../app.component';
import { Province } from './../commons/province/dto/province.dto';
import { AppService } from './../app.service';
import { SaleType } from './dto/SaleType.dto';
import { State } from './dto/State.dto';
import { Client } from './dto/Client.dto';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Simulation } from './dto/Simulation.dto';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperComponent } from './../stepper/stepper.component';
import { ExitSalesmanDialog } from './exit_salesman_dialog/exitSalesmanDialog.dialog';
import { AuthService } from './../login/auth.service';
import { Phone } from './dto/client/Phone.dto';
import { AppMessage } from './../app.message';
import { ObservableMedia } from "@angular/flex-layout";
import { Address } from "./dto/client/Address.dto";
import { StepEnum } from "./step.enum";

@Component({
    selector: 'simulation',
    templateUrl: './app/simulation/simulation.component.html'
})

export class SimulationComponent implements OnInit {
    simulation: Simulation;

    constructor(
        private activeRoute: ActivatedRoute, private router: Router, private appService: AppService,
        private appComponent: AppComponent, public media: ObservableMedia, public dialog: MdDialog, 
        private authService: AuthService, private appMessage: AppMessage, private simulationService: SimulationService) {
    };

    ngOnInit() {
        this.activeRoute
            .params
            .subscribe(params => {
                this.simulation = new Simulation();
                this.simulation.id = params['id'] || undefined;
            });

        if (this.simulation.id) {
            // consultar o dossier
            this.getDossier();
        } else {
            this.keepSalesmanStructure();
        }
        this.simulationService.setSimulation(this.simulation);
    }

    getStep(){
        return StepEnum;
    }

    keepSalesmanStructure() {
        let option = sessionStorage.getItem('salesman');
        if (option != null) {
            let salesman = JSON.parse(sessionStorage.getItem('salesman'));
            this.simulation.salesmanStructure = new SalesmanStructure;
            this.simulation.salesmanStructure.salesmanId = salesman.id;
            this.simulation.salesmanStructure.salesmanName = salesman.name;
            let observable = this.appService.xSearchWithData('structureService/questDealershipBySallesmanUser', {});
            observable.subscribe(
                (data) => {
                    let response = data.json();
                    this.authService.setStructure(response.structure.structureId);
                    let structure = response.structure;
                    if (structure != null) {
                        this.simulation.salesmanStructure.structureId = structure.structureId != null ? structure.structureId : '';
                        this.simulation.salesmanStructure.structureDescription = structure.description;
                    }
                },
                err => {
                    console.log(err.json());
                }
            );
        }
    }

    loadSalesman() {
        let observable = this.appService.xSearch('simulation/salesman', this.simulation.id);
        observable.subscribe(
            (data) => {
                let response = data.json();
                this.authService.setSalesMan(new Salesman(response.salesman.id, response.salesman.name));
                let salesman = JSON.parse(sessionStorage.getItem('salesman'));
                this.simulation.salesmanStructure = new SalesmanStructure;
                this.simulation.salesmanStructure.salesmanId = salesman.id;
                this.simulation.salesmanStructure.salesmanName = salesman.name;
                this.keepSalesmanStructure();
        });
    }

    changeStep(toFront: boolean) {
        if (this.simulation.step < StepEnum.STEP_CLIENT) {
             return
        }
        
        if(this.simulation.step == 6) {
            this.simulation.step = 3;
        }

        if (toFront) {
            this.simulation.step++;
        } else {
            if(this.simulation.client.civilState){
                if((this.simulation.client.civilState.description != "CASADO" 
                && this.simulation.client.civilState.description != "COMPANHEIRO"
                && this.simulation.step == StepEnum.STEP_MOBILE_PROFESSIONAL_DATA)){
                    this.simulation.step--;
                }
                if(this.simulation.client.guarantor1){
                    if((this.simulation.client.guarantor1.civilState.description != "CASADO" 
                    && this.simulation.client.guarantor1.civilState.description != "COMPANHEIRO"
                    && this.simulation.step == StepEnum.STEP_MOBILE_GUARANTOR_ONE_PROFESSIONAL)){
                        this.simulation.step--;
                    }
                }

                if(this.simulation.client.guarantor2) {
                    if((this.simulation.client.guarantor2.civilState.description != "CASADO" 
                    && this.simulation.client.guarantor2.civilState.description != "COMPANHEIRO"
                    && this.simulation.step == StepEnum.STEP_MOBILE_GUARANTOR_TWO_PROFESSIONAL)){
                        this.simulation.step--;
                    }
                }

                if(this.simulation.step == StepEnum.STEP_MOBILE_GUARANTOR_TWO_CLIENT 
                    && this.simulation.client.guarantor1.guarantorType.id == "0"){
                        this.simulation.step = StepEnum.STEP_MOBILE_GUARANTOR_ONE_CLIENT + 1;
                    }
            }
            this.simulation.step--;
        }
    }


    sendByEmail(dossierId: string) {
        let urlStr = "sendEmail/" + dossierId + "/" + this.appComponent.theme;
        let sendEmail = this.appService.xSearch("proposalService", urlStr);
        sendEmail.subscribe(
            err => {
                console.log(err.json());
            }
        );
    }

    print(dossierId: string) {
        let urlStr = "print/" + dossierId + "/" + this.appComponent.theme;
        this.appService.xFileDownload("proposalService", urlStr, "FILE", "pdf");
    }

    openDialog() {
        let dialogRef = this.dialog.open(ExitSalesmanDialog, { width: '50%' });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if (dialogRef.componentInstance.confirm) {
                let item = {};
                let theme = "";
                theme = JSON.parse(sessionStorage.getItem('oldTheme'));
                item["value"] = theme;
                this.appComponent.changeTheme(item);
                this.router.navigateByUrl('/home');
            }
        });
    }

    getDossier() {
        let searchDossier = this.appService.xSearch('myProposal/dossier', this.simulation.id);
        searchDossier.subscribe(
            (data) => {
                let response = data.json();
                if (response.msgSantander) {
                    this.appMessage.showWarning(response.msgSantander);
                }
                this.loadSimulation(response);
            },
            err => {
                this.router.navigate(['/home']);
            }
        );
    }
    
    readOnly() {
        /**
         * Responsavel por realizar o bloqueio de todos os campos
         * de todas as telas, pelo qual, o status da Proposta seja igual
         * a 31 (Vencida), 08 (Cancelada), 30 (Desistência), 10 (Efetivada),
         * 05 (Em analise), 07 (Negada), 32 (Cancelado SIN/SFA).
         */
        
         if(this.simulation.dossierStatus == 31 
         || this.simulation.dossierStatus == 8
         || this.simulation.dossierStatus == 30
         || this.simulation.dossierStatus == 10
         || this.simulation.dossierStatus == 5
         || this.simulation.dossierStatus == 7
         || this.simulation.dossierStatus == 32) {
            this.simulation.readOnly = true;
         }
        
    }

    saveDossier() {
        let dossier = {simulation : this.simulation};
        let saveDossierService = this.appService.xSearchWithData('savesimulation/savesimulation', dossier);
        saveDossierService.subscribe(
            (data) => {
                let response = data.json();
                this.appMessage.showDefaultSuccess();
                 //seta o step corrente
                response.step = this.simulation.step;
                this.loadSimulation(response);
                this.simulationService.setSimulation(this.simulation);

                let dialogRef = this.dialog.open(SendSimulationDialog, { width: '40%' });
                //caso o usuario confirme a envio para o Santander
                dialogRef.afterClosed().subscribe(result => {
                   if(result){
                       this.sendSantander();
                   }
                });
            },
            err => {
                console.log(err.json());
            }
        );
    }

    onlySaveDossier() {
        let dossier = {simulation : this.simulation};
        let saveDossierService = this.appService.xSearchWithData('savesimulation/savesimulation', dossier);
        saveDossierService.subscribe(
            (data) => {
                let response = data.json();
                this.appMessage.showDefaultSuccess();
                //seta o step corrente
                response.step = this.simulation.step;
                this.loadSimulation(response);
                this.simulationService.setSimulation(this.simulation);
            },
            err => {
                console.log(err.json());
            }
        );
    }

    private sendSantander(){
		 if (this.simulation.id) {
            let send = new Object;
            send["dossierId"] = this.simulation.id
            let specialget = this.appService.xPost('santanderService/sendDossierSantander', send);
            specialget.subscribe(
                (data) => {
                    this.appMessage.showDefaultSuccess();
                    this.getDossier();
                    this.simulationService.setSimulation(this.simulation);
                },
                err => {
                
                }
            );
        }
	}


    private loadSimulation(jsonObject : any){
        this.simulation.id = jsonObject.simulation.id;
        this.simulation.car = jsonObject.simulation.car;
        this.simulation.client = jsonObject.simulation.client;
        this.simulation.saleType = jsonObject.simulation.saleType;
        this.simulation.tc = jsonObject.simulation.tc;
        this.simulation.vizualization = jsonObject.simulation.vizualization;
        this.simulation.brand = jsonObject.simulation.brand;
        this.simulation.calculations = jsonObject.simulation.calculations;
        this.simulation.specialTypes = jsonObject.simulation.specialTypes;
        this.simulation.isShowRoomSemiNews = jsonObject.simulation.isShowRoomSemiNews;
        this.simulation.showNewOnes = jsonObject.simulation.showNewOnes;
        this.simulation.dossierNumber = jsonObject.simulation.dossierNumber;
        this.simulation.dossierStatus = jsonObject.simulation.dossierStatus;
        this.simulation.calculationSelected = jsonObject.simulation.calculationSelected;
        this.simulation.certifiedAgent = jsonObject.simulation.certifiedAgent;
        this.simulation.showBtnSave = true;
        this.simulation.step = jsonObject.step;
        this.simulation.step5CanNext = jsonObject.simulation.showDocuments;
        this.loadSalesman();
        this.readOnly();
    }

    ngOnDestroy(){
        this.simulationService.setSimulation(null);
    }

}