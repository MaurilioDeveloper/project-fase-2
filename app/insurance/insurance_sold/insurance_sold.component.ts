import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { InsuranceSold } from './insurance_sold.interface';
import { MyAgreement } from './../../my_agreement/my_agreement.interface';
import { StructureMyAgreement } from './../../my_agreement/structureMyAgreement.interface';
import { OnInit, ViewChild } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { AppService } from './../../app.service';
import { Component } from '@angular/core';
import { AppComponent } from './../../app.component';


@Component({
    selector: 'insurance-sold',
    templateUrl: './app/insurance/insurance_sold/insurance-sold.component.html'
})

export class InsuranceSoldComponent implements OnInit {
    
    structure:StructureMyAgreement;
    filter: InsuranceSold;
    showConsult: boolean = false;

    listPersonType = [];
    listDossierStatus : Object[] =  [{dossierStatusId: null, description: 'Selecionar um status...'}];
    listStructure : Object[] = [{structureId: null, description: 'Selecionar uma concessionária...'}];
    listSalesman : Object[] = [{dossierStatusId: null, name: 'Selecionar um vendedor...'}];
    listSaleType : Object[] = [{name: null, description: 'Selecionar um tipo de venda...'}];
    listInsuranceStatus : Object[] = [{car_insurance_status_id: null, description: 'Selecionar um status...'}]

    listDossiers = [];

    public state = '';

    @ViewChild('table') table: any;

    constructor(public appService: AppService){

    }
    
    ngOnInit(){
        this.loadForm();
        this.loadSelect();
        this.loadStatusSeguro();
        this.loadSaleType()
        
    }

    private loadSelect(){
        let observable = this.appService.xSearch('myAgreementService','myAgreementSelect');

       observable.subscribe(
            (data) => {
               let response = data.json();
               this.listDossierStatus.push(...response.listDossierStatus);
               this.listStructure.push(...response.listStructure);
               this.listPersonType = (response.listPersonType);
            },
            err => {
               console.log(err.json());
            }
       );
    }

    public loadSalesman(structureSelected){
        this.structure = { structureId: structureSelected};
        let observable = this.appService.xSearchWithData('personService/questSalesmanDealership', this.structure );

        observable.subscribe(
                (data) => {
                     let response = data.json();
                     this.listSalesman = [{dossierStatusId: null, name: 'Selecionar um vendedor...'}];
                     this.listSalesman.push(...response.listPerson);
                },
                err => {
                console.log(err.json());
                }
        );    
    }

    public loadStatusSeguro(){
        let observable = this.appService.xSearch('carInsuranceService','findInsuranceStatus');

        observable.subscribe(
            (data) => {
                let response = data.json();
                this.listInsuranceStatus.push(...response.insuranceStatusList);
            },
            err => {
                console.log(err.json());
            }
        );  
    } 

    public loadSaleType(){
        let observable = this.appService.xSearch('carInsuranceService','findSaleType');

        observable.subscribe(
            (data) => {
                let response = data.json();
                this.listSaleType.push(...response.listSaleType);
            },
            err => {
                console.log(err.json());
            }
        );

    }

    public consult(){
        console.log(this.filter);
        let observable = this.appService.xSearchWithData('carInsuranceService/searchInsuraceSold', this.filter );
        observable.subscribe(
                (data) => {
                     let response = data.json();
                     console.log(response);

                     if (response.listInsuSold != undefined) {
                        this.listDossiers = response.listInsuSold;
                        this.showConsult = true;
                        this.cleanPage();
                     } else {                         
                        this.showConsult = false;
                     }
                },
                err => {
                console.log(err.json());
                }
        );
    }




    private loadForm() {
        this.filter = {
            numberProposal: null,
            proposal: null,
            adp: null,
            clientType: null,
            name: null,
            statusSeguro:null,
            saleTypeId: null,
            dateCreationInit: null,
            dateCreationEnd:null,
            dealership: null,
            salesMan: null,
        };
    }    
    
    public consulta(filter: InsuranceSold){

    }





    public buscar(){
        console.log(
            this.filter.numberProposal,
            this.filter.proposal,
            this.filter.adp,
            this.filter.clientType,
            this.filter.name,
            this.filter.statusSeguro,
            this.filter.saleTypeId,
            this.filter.dateCreationInit,
            this.filter.dateCreationEnd,
            this.filter.dealership,
            this.filter.salesMan,
            
        );
    }

    private cleanPage(){
        if(this.table){
            this.table.offset = 0;
        }
    }


}