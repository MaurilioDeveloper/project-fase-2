import { InsuranceDenied } from './insurance_denied.interface';
import { OnInit, ViewChild } from '@angular/core';
import { AppService } from './../../app.service';
import { Component } from '@angular/core';
import { AppComponent } from './../../app.component';


@Component({
    selector: 'insurance-danied',
    templateUrl: './app/insurance/insurance_denied/insurance-denied.component.html'
})

export class InsuranceDeniedComponent implements OnInit {

    filter: InsuranceDenied;
    showConsult: boolean = false;
    listDossiers = [];

    listPersonType = [];
    listSaleType: Object[] = [{ saleTypeId: null, description: 'Selecionar um tipo de venda...' }];
    listStructure: Object[] = [{ structureId: null, description: 'Selecionar uma concessionária...' }];
    public state = '';

    @ViewChild('table') table: any;


    constructor(public appService: AppService) {

    }

    ngOnInit() {
        this.loadForm();
        this.loadSelect();
    }

    clearForm() {
        this.loadForm();
    }

    private loadForm() {
        this.filter = {
            idDossier: null,
            adp: null,
            typePerson: null,
            nameClient: null,
            dateCreationInit: null,
            dateCreationEnd: null,
            saleTypeId: null,
            dealership: null,
            dateExpirationInit: null,
            dateExpirationEnd: null,
        };
    }

    private loadSelect() {

        let observable = this.appService.xSearch('myAgreementService', 'myAgreementSelect');
        observable.subscribe(
            (data) => {
                let response = data.json();
                this.listStructure.push(...response.listStructure);
                this.listSaleType.push(...response.listSaleType);
                this.listPersonType = (response.listPersonType);
            },
            err => {
                console.log(err.json());
            }
        );
    }

    search() {
        console.log(this.filter);
        let observable = this.appService.xSearchWithData('insurancequote/canceled', this.filter);
        observable.subscribe(
            (data) => {
                let response = data.json();
                console.log(response);
                this.listDossiers = response.list;
                this.showConsult = true;
                this.cleanPage();
            },
            err => {
                console.log(err.json());
            }
        );
        console.log(
            this.filter.idDossier + " ",
            this.filter.adp + " ",
            this.filter.typePerson + " ",
            this.filter.nameClient + " ",
            this.filter.dateCreationInit + " ",
            this.filter.dateCreationEnd + " ",
            this.filter.saleTypeId + " ",
            this.filter.dealership + " ",
            this.filter.dateExpirationInit + " ",
            this.filter.dateExpirationEnd + " ",


        );
    }

    private cleanPage() {
        if (this.table) {
            this.table.offset = 0;
        }
    }


}