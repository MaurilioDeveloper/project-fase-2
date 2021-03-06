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
var Phone_dto_1 = require("./../../../../dto/client/Phone.dto");
var Bank_dto_1 = require("./../../../../dto/client/Bank.dto");
var app_message_1 = require("./../../../../../app.message");
var core_1 = require("@angular/core");
var simulation_service_1 = require("./../../../../simulation.service");
var app_service_1 = require("./../../../../../app.service");
var step_enum_1 = require("./../../../../step.enum");
var BankDetails_dto_1 = require("./../../../../dto/client/BankDetails.dto");
var BankingDataService = /** @class */ (function () {
    function BankingDataService(appService, appMessage, simulationService) {
        this.appService = appService;
        this.appMessage = appMessage;
        this.simulationService = simulationService;
        this.conf = false;
        this.listBank = [];
        this.listAccountType = [];
        this.isRequiredBanking = false;
    }
    ;
    BankingDataService.prototype.init = function () {
        var _this = this;
        this.simulationService.load.subscribe(function (simulation) {
            _this.simulation = simulation;
            if (_this.simulation && (_this.simulation.step == step_enum_1.StepEnum.STEP_CUSTOMER_CARD || _this.simulation.step == step_enum_1.StepEnum.STEP_MOBILE_BANKING_REFENCES)) {
                _this.onload();
            }
        });
    };
    BankingDataService.prototype.initializeFields = function () {
        if (!this.simulation.client.bankDetails)
            this.simulation.client.bankDetails = new BankDetails_dto_1.BankDetails();
        if (!this.simulation.client.bankDetails.phoneBranch)
            this.simulation.client.bankDetails.phoneBranch = new Phone_dto_1.Phone();
        if (!this.simulation.client.bankDetails.bank)
            this.simulation.client.bankDetails.bank = new Bank_dto_1.Bank();
        this.simulation.client.bankDetails.accountType = "CORRENTE";
    };
    BankingDataService.prototype.onload = function () {
        this.initializeFields();
        this.loadBank();
        this.loadAccountType();
    };
    BankingDataService.prototype.loadBank = function () {
        var _this = this;
        var result = this.appService.xSearch('customerCardService', 'findAllBank');
        result.subscribe(function (data) {
            var response = data.json();
            _this.listBank = response.listBank;
        }, function (err) {
            console.log(err.json());
        });
    };
    BankingDataService.prototype.loadAccountType = function () {
        var accountType = {
            'id': 'C',
            'description': 'CORRENTE'
        };
        this.listAccountType.push(accountType);
    };
    BankingDataService.prototype.validBankSelected = function () {
        var idBank = this.simulation.client.bankDetails.bank.id;
        var banks;
        banks = this.listBank.filter(function (bank) { return bank.id === idBank; });
        if (banks[0]) {
            this.simulation.client.bankDetails.bank.importCode = banks[0].importCode;
            this.selectBank();
        }
    };
    BankingDataService.prototype.selectBank = function () {
        if (this.simulation.client.bankDetails.bank.id) {
            this.isRequiredBanking = true;
        }
        else {
            this.isRequiredBanking = false;
        }
    };
    BankingDataService.prototype.validCodeBankSelected = function () {
        var idimportCodeBank = this.simulation.client.bankDetails.bank.importCode;
        var bank;
        bank = this.listBank.filter(function (bank) { return bank.importCode === idimportCodeBank; });
        if (bank[0]) {
            this.simulation.client.bankDetails.bank.id = bank[0].id;
        }
        else {
            this.simulation.client.bankDetails.bank.id = null;
        }
    };
    BankingDataService.prototype.disableFieldsByStatusDossier = function () {
        if (this.simulation.readOnly) {
            return true;
        }
        if (this.simulation.dossierStatus == 9) {
            return true;
        }
        return false;
    };
    BankingDataService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [app_service_1.AppService, app_message_1.AppMessage, simulation_service_1.SimulationService])
    ], BankingDataService);
    return BankingDataService;
}());
exports.BankingDataService = BankingDataService;
//# sourceMappingURL=banking-service.service.js.map