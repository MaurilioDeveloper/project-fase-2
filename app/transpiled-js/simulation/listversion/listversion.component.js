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
var simulation_service_1 = require("./../simulation.service");
var core_1 = require("@angular/core");
var app_message_1 = require("./../../app.message");
var SpecialType_dto_1 = require("./../dto/SpecialType.dto");
var Version_dto_1 = require("./../dto/Version.dto");
var app_service_1 = require("./../../app.service");
var core_2 = require("@angular/core");
var step_enum_1 = require("./../step.enum");
var ListVersionComponent = /** @class */ (function () {
    function ListVersionComponent(appService, appMessage, simulationService) {
        this.appService = appService;
        this.appMessage = appMessage;
        this.simulationService = simulationService;
        this.specialTypes = new Array;
        this.versionSelected = new Version_dto_1.Version;
        this.position = 'above';
        this.oldPriceVersion = 0;
    }
    // total: number = 0;
    ListVersionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.simulationService.load.subscribe(function (simulation) {
            _this.simulation = simulation;
            if (_this.simulation && _this.simulation.step == step_enum_1.StepEnum.STEP_VEHICLE) {
                _this.onload();
            }
        });
    };
    ListVersionComponent.prototype.valueCar = function ($event) {
        var valorDoCarro = this.carValor.nativeElement.value.replace('R$ ', '');
        valorDoCarro = valorDoCarro.split(',');
        if (valorDoCarro[0].toString() === "0" && valorDoCarro[1].toString() === "00") {
            this.appMessage.showError("O valor do veículo é inválido !");
            this.simulation.car.version.price = 0;
        }
    };
    ListVersionComponent.prototype.onload = function () {
        var _this = this;
        var buscaver = {};
        buscaver["vehicleType"] = "NOVO";
        buscaver["modelId"] = this.simulation.car.id;
        var buscaSepcial = {};
        if (this.simulation.specialTypes) {
            buscaSepcial['selected'] = [];
            for (var i = 0; i < this.simulation.specialTypes.length; i++) {
                buscaSepcial['selected'].push(this.simulation.specialTypes[i].id);
            }
        }
        var specialget = this.appService.xSearchWithData('specialtypes', buscaSepcial);
        specialget.subscribe(function (data) {
            var listver = new Array();
            var response = data.json();
            for (var i = 0; i < response.specialTypes.length; i++) {
                var type = new SpecialType_dto_1.SpecialType();
                type.id = response.specialTypes[i].specialTypeId;
                type.description = response.specialTypes[i].description;
                _this.specialTypes.push(type);
                /*
                if(response.selected != null){
                    for (var a = 0; a < response.selected.length; a++) {
                        if (this.specialTypes[i].id === response.selected[a]["specialTypeId"]) {
                            this.simulation.specialTypes.push(type);
                        }
                    }
                }*/
            }
        });
        var carsget = this.appService.xSearchWithData('vehicleVersion', buscaver);
        carsget.subscribe(function (data) {
            var listver = new Array();
            var response = data.json();
            for (var i = 0; i < response.vehicleVersionDtoList.length; i++) {
                var vehicleVer = response.vehicleVersionDtoList[i];
                var ver = new Version_dto_1.Version;
                ver.description = vehicleVer["description"];
                ver.fipe = vehicleVer["fipe"];
                listver.push(ver);
            }
            _this.versions = listver;
            _this.loadVersion(_this.versions[0]);
        }, function (err) {
            console.log(err.json());
        });
    };
    ListVersionComponent.prototype.changeVersion = function ($event) {
        if (!this.simulation.readOnly) {
            this.loadVersion($event.value);
        }
    };
    ListVersionComponent.prototype.updateTotal = function (value) {
        if (value.length > 0 && (value < 0 || isNaN(parseFloat(value)))) {
            value = this.oldPriceVersion;
            // this.appMessage.showWarning("Valor " +  value +this.oldPriceVersion);
        }
        console.log("PASS" + value);
        if (value) {
            value = value.toString().replace('R$ ', "").replace(',', ".");
            this.simulation.car.version.price = parseFloat(value);
            // this.recalc();
        }
    };
    ListVersionComponent.prototype.loadVersion = function (version) {
        var _this = this;
        this.verselect = version;
        var buscaManuYear = {};
        buscaManuYear["description"] = this.verselect.description;
        buscaManuYear["fipe"] = this.verselect.fipe;
        buscaManuYear["vehicleType"] = "NOVO";
        var yearsManuget = this.appService.xSearchWithData('vehicleVersion/manufactureYears', buscaManuYear);
        yearsManuget.subscribe(function (data) {
            _this.yearManu = new Array();
            var response = data.json();
            for (var i = 0; i < response.manufactureYears.length; i++) {
                var vehicleVer = response.manufactureYears[i];
                _this.yearManu.push(vehicleVer);
            }
            if (_this.yearManu[0]) {
                _this.yearSelect = _this.yearManu[0];
            }
            _this.loadManuYear();
        }, function (err) {
            console.log(err.json());
        });
    };
    ListVersionComponent.prototype.changeManuYear = function () {
        this.loadManuYear();
    };
    ListVersionComponent.prototype.loadManuYear = function () {
        var _this = this;
        var buscaModelYear = {};
        buscaModelYear["description"] = this.verselect.description;
        buscaModelYear["fipe"] = this.verselect.fipe;
        buscaModelYear["vehicleType"] = "NOVO";
        buscaModelYear["manufactureYear"] = this.yearSelect;
        var yearsManuget = this.appService.xSearchWithData('vehicleVersion/modelYears', buscaModelYear);
        yearsManuget.subscribe(function (data) {
            _this.versionsYears = new Array();
            var response = data.json();
            for (var i = 0; i < response.modelYears.length; i++) {
                var vehicleVer = response.modelYears[i];
                var ver = new Version_dto_1.Version;
                ver.id = vehicleVer["versionId"];
                ver.description = _this.verselect.description;
                ver.fipe = _this.verselect.fipe;
                ver.yearManufacture = _this.yearSelect;
                ver.yearModel = vehicleVer["yearModel"];
                ver.url = _this.verselect.url;
                _this.versionsYears.push(ver);
            }
            if (_this.versionsYears[0]) {
                _this.versionSelected = _this.versionsYears[0];
            }
            _this.getValue(_this.versionSelected);
        }, function (err) {
            console.log(err.json());
        });
    };
    ListVersionComponent.prototype.getValue = function (newValue) {
        var _this = this;
        var valueGet = this.appService.xSearch('vehiculePrice', this.versionSelected.id);
        valueGet.subscribe(function (data) {
            var listyear = new Array();
            var response = data.json();
            var value = response.vehiclePriceDTO;
            if (!value || value === null) {
                //Veiculo esta sem preço 
                _this.appMessage.showError("Este veiculo nas configurações selecionadas não tem preço definido");
                return;
            }
            _this.valueSelect = value["amount"];
            _this.versionSelected.price = _this.valueSelect;
            _this.simulation.car.version = _this.versionSelected;
        }, function (err) {
            console.log(err.json());
        });
    };
    __decorate([
        core_2.ViewChild('carValue'),
        __metadata("design:type", core_1.ElementRef)
    ], ListVersionComponent.prototype, "carValor", void 0);
    __decorate([
        core_1.HostListener('blur', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ListVersionComponent.prototype, "valueCar", null);
    ListVersionComponent = __decorate([
        core_2.Component({
            selector: 'listversion',
            templateUrl: './app/simulation/listversion/listversion.component.html',
            styleUrls: []
        }),
        __metadata("design:paramtypes", [app_service_1.AppService,
            app_message_1.AppMessage,
            simulation_service_1.SimulationService])
    ], ListVersionComponent);
    return ListVersionComponent;
}());
exports.ListVersionComponent = ListVersionComponent;
//# sourceMappingURL=listversion.component.js.map