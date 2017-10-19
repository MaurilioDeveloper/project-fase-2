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
var new_ones_service_1 = require("./service/new-ones.service");
var simulation_service_1 = require("./../simulation.service");
var material_1 = require("@angular/material");
var core_1 = require("@angular/core");
var flex_layout_1 = require("@angular/flex-layout");
var discard_insurance_quote_dialog_dialog_1 = require("./../discardInsuranceQuoteDialog/discard-insurance-quote-dialog.dialog");
var NewOnesComponent = /** @class */ (function () {
    function NewOnesComponent(newOnesService, dialog, media, simulationService) {
        this.newOnesService = newOnesService;
        this.dialog = dialog;
        this.media = media;
        this.simulationService = simulationService;
        this.changeStep = new core_1.EventEmitter();
        this.rawChange = new core_1.EventEmitter();
        this.varBtnMarca = 'keyboard_arrow_up';
        this.varBtnDrop = 'keyboard_arrow_up';
        this.drop = false;
        this.seguroAutoCotizador = false;
        this.newOnesService.init();
    }
    ;
    NewOnesComponent.prototype.ngOnInit = function () {
        if (this.getSimulation().calculationSelected.selected && this.getSimulation().calculationSelected.serviceCotizador) {
            this.seguroAutoCotizador = true;
        }
        this.saveInitialValues();
    };
    NewOnesComponent.prototype.getSimulation = function () {
        return this.newOnesService.simulation;
    };
    NewOnesComponent.prototype.getAcessorio = function () {
        return this.newOnesService.acessorio;
    };
    NewOnesComponent.prototype.addAcessorio = function (acessorio) {
        this.newOnesService.addAcessorio(acessorio);
    };
    NewOnesComponent.prototype.delAcessorio = function (acessorio) {
        this.newOnesService.delAcessorio(acessorio);
    };
    NewOnesComponent.prototype.getTotal = function () {
        return this.newOnesService.total;
    };
    NewOnesComponent.prototype.getSubtotalAccessories = function () {
        return this.newOnesService.subtotalAccessories;
    };
    NewOnesComponent.prototype.getListVehicleBrand = function () {
        return this.newOnesService.listVehicleBrand;
    };
    NewOnesComponent.prototype.getListVehicleModel = function () {
        return this.newOnesService.listVehicleModel;
    };
    NewOnesComponent.prototype.getListVehicleVersion = function () {
        return this.newOnesService.listVehicleVersion;
    };
    NewOnesComponent.prototype.getVersionYears = function () {
        return this.newOnesService.versionYears;
    };
    NewOnesComponent.prototype.getManufactreYears = function () {
        return this.newOnesService.manufactreYears;
    };
    NewOnesComponent.prototype.getSpecialTypes = function () {
        return this.newOnesService.specialTypes;
    };
    NewOnesComponent.prototype.loadModels = function (event) {
        this.newOnesService.loadModels(event);
    };
    NewOnesComponent.prototype.loadVersions = function (event) {
        this.newOnesService.loadVersions(event);
    };
    NewOnesComponent.prototype.loadModelYears = function (event) {
        this.newOnesService.loadModelYears(event);
    };
    NewOnesComponent.prototype.loadManufactureYears = function (event) {
        this.newOnesService.loadManufactureYears(event);
    };
    NewOnesComponent.prototype.loadBrands = function () {
        this.newOnesService.loadBrands();
    };
    NewOnesComponent.prototype.clicked = function () {
        if (this.drop) {
            this.drop = false;
            this.varBtnMarca = 'keyboard_arrow_down';
        }
        else {
            this.drop = true;
            this.varBtnMarca = 'keyboard_arrow_up';
        }
    };
    NewOnesComponent.prototype.recalcTotal = function (event, campo, fff) {
        if (fff.form.valid) {
            this.getSimulation().step2CanNext = true;
        }
        else {
            this.getSimulation().step2CanNext = false;
        }
        this.newOnesService.recalcT();
    };
    NewOnesComponent.prototype.saveManufactureYears = function (newValue) {
        this.getSimulation().car.version.yearManufacture = newValue;
    };
    NewOnesComponent.prototype.addSpecialType = function (e, specialType, idSpecialType) {
        console.log(e);
        if (e.checked) {
            this.getSimulation().specialTypes.push(specialType[0]);
        }
        else {
            var index = this.getSimulation().specialTypes.indexOf(idSpecialType);
            this.getSimulation().specialTypes.splice(index, 1);
        }
    };
    NewOnesComponent.prototype.disableFieldsByStatusDossier = function () {
        return this.newOnesService.disableFieldsByStatusDossier();
    };
    NewOnesComponent.prototype.change = function (toFront) {
        if (this.seguroAutoCotizador
            && this.verifyChanges()) {
            this.openDiscardInsuranceQuoteDialog();
        }
        else {
            this.changeStep.emit(toFront);
        }
    };
    NewOnesComponent.prototype.openDiscardInsuranceQuoteDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(discard_insurance_quote_dialog_dialog_1.DiscardInsuranceQuoteDialog, { width: '50%' });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getSimulation().calculations;
            if (dialogRef.componentInstance.response) {
                if (_this.getSimulation().calculationSelected.services) {
                    _this.getSimulation().calculationSelected.services.forEach(function (service) {
                        if (service.serviceTypeId === 30) {
                            service.checked = false;
                        }
                    });
                }
                _this.changeStep.emit(dialogRef.componentInstance.response);
            }
            else {
                _this.loadInitialValues();
                _this.newOnesService.init();
                _this.newOnesService.recalcT();
            }
        });
    };
    NewOnesComponent.prototype.verifyChanges = function () {
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
    };
    NewOnesComponent.prototype.saveInitialValues = function () {
        this.getSimulation().initialBrand = JSON.stringify(this.getSimulation().brand);
        this.getSimulation().initialCar = JSON.stringify(this.getSimulation().car);
        this.getSimulation().initialSpecialTypes = JSON.stringify(this.getSimulation().specialTypes);
    };
    NewOnesComponent.prototype.loadInitialValues = function () {
        this.getSimulation().brand = JSON.parse(this.getSimulation().initialBrand);
        this.getSimulation().car = JSON.parse(this.getSimulation().initialCar);
        this.getSimulation().specialTypes = JSON.parse(this.getSimulation().initialSpecialTypes);
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NewOnesComponent.prototype, "changeStep", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NewOnesComponent.prototype, "rawChange", void 0);
    NewOnesComponent = __decorate([
        core_1.Component({
            selector: 'new-ones',
            templateUrl: 'app/simulation/new_ones/new_ones.component.html',
            providers: [new_ones_service_1.NewOnesService]
        }),
        __metadata("design:paramtypes", [new_ones_service_1.NewOnesService, material_1.MdDialog, flex_layout_1.ObservableMedia, simulation_service_1.SimulationService])
    ], NewOnesComponent);
    return NewOnesComponent;
}());
exports.NewOnesComponent = NewOnesComponent;
//# sourceMappingURL=new_ones.component.js.map