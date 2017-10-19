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
var simulation_service_1 = require("./../../simulation.service");
var form_client_service_1 = require("./../service/form-client.service");
var material_1 = require("@angular/material");
var app_message_1 = require("./../../../app.message");
var app_service_1 = require("./../../../app.service");
var core_1 = require("@angular/core");
var QuotationDialog = /** @class */ (function () {
    function QuotationDialog(appService, appMessage, dialogRef, formClientService, simulationService) {
        this.appService = appService;
        this.appMessage = appMessage;
        this.dialogRef = dialogRef;
        this.formClientService = formClientService;
        this.simulationService = simulationService;
        this.changeStep = new core_1.EventEmitter();
    }
    QuotationDialog.prototype.ngOnInit = function () {
        var _this = this;
        this.simulationService.load.subscribe(function (simulation) {
            _this.simulation = simulation;
            if (_this.simulation) {
                _this.onload();
            }
        });
    };
    QuotationDialog.prototype.onload = function () {
    };
    QuotationDialog.prototype.getSimulation = function () {
        return this.simulation;
    };
    QuotationDialog.prototype.removeService = function () {
        this.simulation.calculationSelected.serviceList.forEach(function (service) {
            if (service.id == "G-Eyb3tFjjmtl3TJGraS0g") {
                service.checked = false;
            }
        });
        this.dialogRef.close();
        this.changeStep.emit(true);
    };
    QuotationDialog.prototype.closeDialog = function () {
        this.getSimulation().client.cpfCnpj = this.getSimulation().client.aux.cpfCnpj;
        this.getSimulation().client.name = this.getSimulation().client.aux.name;
        this.getSimulation().client.email = this.getSimulation().client.aux.email;
        this.getSimulation().client.phone.number = this.getSimulation().client.aux.phone.number;
        this.getSimulation().client.province = this.getSimulation().client.aux.province;
        this.getSimulation().saleType = this.getSimulation().client.aux.saleType;
        this.dialogRef.close();
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], QuotationDialog.prototype, "changeStep", void 0);
    QuotationDialog = __decorate([
        core_1.Component({
            selector: 'dialog-quation',
            templateUrl: 'app/simulation/card_client/dialogQuotation/dialogQuotation.dialog.html',
            providers: [form_client_service_1.FormClientService]
        }),
        __metadata("design:paramtypes", [app_service_1.AppService,
            app_message_1.AppMessage,
            material_1.MdDialogRef,
            form_client_service_1.FormClientService,
            simulation_service_1.SimulationService])
    ], QuotationDialog);
    return QuotationDialog;
}());
exports.QuotationDialog = QuotationDialog;
//# sourceMappingURL=dialogQuotation.dialog.js.map