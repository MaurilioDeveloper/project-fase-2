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
var InsuranceDeniedComponent = /** @class */ (function () {
    function InsuranceDeniedComponent(appService) {
        this.appService = appService;
        this.showConsult = false;
        this.listDossiers = [];
        this.listPersonType = [];
        this.listSaleType = [{ saleTypeId: null, description: 'Selecionar um tipo de venda...' }];
        this.listStructure = [{ structureId: null, description: 'Selecionar uma concessionária...' }];
        this.state = '';
    }
    InsuranceDeniedComponent.prototype.ngOnInit = function () {
        this.loadForm();
        this.loadSelect();
    };
    InsuranceDeniedComponent.prototype.clearForm = function () {
        this.loadForm();
    };
    InsuranceDeniedComponent.prototype.loadForm = function () {
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
    };
    InsuranceDeniedComponent.prototype.loadSelect = function () {
        var _this = this;
        var observable = this.appService.xSearch('myAgreementService', 'myAgreementSelect');
        observable.subscribe(function (data) {
            var response = data.json();
            (_a = _this.listStructure).push.apply(_a, response.listStructure);
            (_b = _this.listSaleType).push.apply(_b, response.listSaleType);
            _this.listPersonType = (response.listPersonType);
            var _a, _b;
        }, function (err) {
            console.log(err.json());
        });
    };
    InsuranceDeniedComponent.prototype.search = function () {
        var _this = this;
        console.log(this.filter);
        var observable = this.appService.xSearchWithData('insurancequote/canceled', this.filter);
        observable.subscribe(function (data) {
            var response = data.json();
            console.log(response);
            _this.listDossiers = response.list;
            _this.showConsult = true;
            _this.cleanPage();
        }, function (err) {
            console.log(err.json());
        });
        console.log(this.filter.idDossier + " ", this.filter.adp + " ", this.filter.typePerson + " ", this.filter.nameClient + " ", this.filter.dateCreationInit + " ", this.filter.dateCreationEnd + " ", this.filter.saleTypeId + " ", this.filter.dealership + " ", this.filter.dateExpirationInit + " ", this.filter.dateExpirationEnd + " ");
    };
    InsuranceDeniedComponent.prototype.cleanPage = function () {
        if (this.table) {
            this.table.offset = 0;
        }
    };
    __decorate([
        core_1.ViewChild('table'),
        __metadata("design:type", Object)
    ], InsuranceDeniedComponent.prototype, "table", void 0);
    InsuranceDeniedComponent = __decorate([
        core_2.Component({
            selector: 'insurance-danied',
            templateUrl: './app/insurance/insurance_denied/insurance-denied.component.html'
        }),
        __metadata("design:paramtypes", [app_service_1.AppService])
    ], InsuranceDeniedComponent);
    return InsuranceDeniedComponent;
}());
exports.InsuranceDeniedComponent = InsuranceDeniedComponent;
//# sourceMappingURL=insurance_denied.component.js.map