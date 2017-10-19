"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app_service_1 = require("./../../app.service");
var core_2 = require("@angular/core");
var InsuranceSoldComponent = /** @class */ (function () {
    function InsuranceSoldComponent(appService) {
        this.appService = appService;
        this.showConsult = false;
        this.listPersonType = [];
        this.listDossierStatus = [{ dossierStatusId: null, description: 'Selecionar um status...' }];
        this.listStructure = [{ structureId: null, description: 'Selecionar uma concessionária...' }];
        this.listSalesman = [{ dossierStatusId: null, name: 'Selecionar um vendedor...' }];
        this.listSaleType = [{ name: null, description: 'Selecionar um tipo de venda...' }];
        this.listInsuranceStatus = [{ car_insurance_status_id: null, description: 'Selecionar um status...' }];
        this.listDossiers = [];
        this.state = '';
    }
    InsuranceSoldComponent.prototype.ngOnInit = function () {
        this.loadForm();
        this.loadSelect();
        this.loadStatusSeguro();
        this.loadSaleType();
    };
    InsuranceSoldComponent.prototype.loadSelect = function () {
        var _this = this;
        var observable = this.appService.xSearch('myAgreementService', 'myAgreementSelect');
        observable.subscribe(function (data) {
            var response = data.json();
            (_a = _this.listDossierStatus).push.apply(_a, response.listDossierStatus);
            (_b = _this.listStructure).push.apply(_b, response.listStructure);
            _this.listPersonType = (response.listPersonType);
            var _a, _b;
        }, function (err) {
            console.log(err.json());
        });
    };
    InsuranceSoldComponent.prototype.loadSalesman = function (structureSelected) {
        var _this = this;
        this.structure = { structureId: structureSelected };
        var observable = this.appService.xSearchWithData('personService/questSalesmanDealership', this.structure);
        observable.subscribe(function (data) {
            var response = data.json();
            _this.listSalesman = [{ dossierStatusId: null, name: 'Selecionar um vendedor...' }];
            (_a = _this.listSalesman).push.apply(_a, response.listPerson);
            var _a;
        }, function (err) {
            console.log(err.json());
        });
    };
    InsuranceSoldComponent.prototype.loadStatusSeguro = function () {
        var _this = this;
        var observable = this.appService.xSearch('carInsuranceService', 'findInsuranceStatus');
        observable.subscribe(function (data) {
            var response = data.json();
            (_a = _this.listInsuranceStatus).push.apply(_a, response.insuranceStatusList);
            var _a;
        }, function (err) {
            console.log(err.json());
        });
    };
    InsuranceSoldComponent.prototype.loadSaleType = function () {
        var _this = this;
        var observable = this.appService.xSearch('carInsuranceService', 'findSaleType');
        observable.subscribe(function (data) {
            var response = data.json();
            (_a = _this.listSaleType).push.apply(_a, response.listSaleType);
            var _a;
        }, function (err) {
            console.log(err.json());
        });
    };
    InsuranceSoldComponent.prototype.consult = function () {
        var _this = this;
        console.log(this.filter);
        var observable = this.appService.xSearchWithData('carInsuranceService/searchInsuraceSold', this.filter);
        observable.subscribe(function (data) {
            var response = data.json();
            console.log(response);
            if (response.listInsuSold != undefined) {
                _this.listDossiers = response.listInsuSold;
                _this.showConsult = true;
                _this.cleanPage();
            }
            else {
                _this.showConsult = false;
            }
        }, function (err) {
            console.log(err.json());
        });
    };
    InsuranceSoldComponent.prototype.loadForm = function () {
        this.filter = {
            numberProposal: null,
            proposal: null,
            adp: null,
            clientType: null,
            name: null,
            statusSeguro: null,
            saleTypeId: null,
            dateCreationInit: null,
            dateCreationEnd: null,
            dealership: null,
            salesMan: null,
        };
    };
    InsuranceSoldComponent.prototype.consulta = function (filter) {
    };
    InsuranceSoldComponent.prototype.buscar = function () {
        console.log(this.filter.numberProposal, this.filter.proposal, this.filter.adp, this.filter.clientType, this.filter.name, this.filter.statusSeguro, this.filter.saleTypeId, this.filter.dateCreationInit, this.filter.dateCreationEnd, this.filter.dealership, this.filter.salesMan);
    };
    InsuranceSoldComponent.prototype.cleanPage = function () {
        if (this.table) {
            this.table.offset = 0;
        }
    };
    __decorate([
        core_1.ViewChild('table'),
        __metadata("design:type", Object)
    ], InsuranceSoldComponent.prototype, "table", void 0);
    InsuranceSoldComponent = __decorate([
        core_2.Component({
            selector: 'insurance-sold',
            templateUrl: './app/insurance/insurance_sold/insurance-sold.component.html'
        }),
        __metadata("design:paramtypes", [app_service_1.AppService])
    ], InsuranceSoldComponent);
    return InsuranceSoldComponent;
}());
exports.InsuranceSoldComponent = InsuranceSoldComponent;
//# sourceMappingURL=insurance_sold.component.js.map