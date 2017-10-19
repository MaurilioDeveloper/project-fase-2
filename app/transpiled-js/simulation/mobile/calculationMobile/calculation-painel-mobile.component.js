"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var app_service_1 = require("./../../../app.service");
var Calculation_dto_1 = require("./../../dto/Calculation.dto");
var core_1 = require("@angular/core");
var step_enum_1 = require("./../../step.enum");
var CalculationMobileComponent = /** @class */ (function () {
    function CalculationMobileComponent(appService, simulationService) {
        this.appService = appService;
        this.simulationService = simulationService;
        this.showCalculations = [false, false, false];
        this.showCalculationsPreview = [false, false, false];
    }
    CalculationMobileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.simulationService.load.subscribe(function (simulation) {
            _this.simulation = simulation;
            if (_this.simulation && _this.simulation.step == step_enum_1.StepEnum.STEP_SIMULATION) {
                _this.onload();
            }
        });
    };
    CalculationMobileComponent.prototype.onload = function () {
        var ua = window.navigator.userAgent;
        var firefox = ua.indexOf('Firefox');
        if (firefox > 0) {
            // IE 10 or older => return version number
            this.browser = "firefox";
        }
        if (!this.simulation.calculations || this.simulation.calculations.length === 0) {
            this.getProposalQuantity();
        }
    };
    CalculationMobileComponent.prototype.getProposalQuantity = function () {
        var _this = this;
        var observable = this.appService.xSearch('userProfile', 'proposalquantity');
        observable.subscribe(function (data) {
            var response = data.json();
            var qtaCalc = response.proposalQuantity;
            if (_this.simulation.calculations && _this.simulation.calculations.length > 1) {
                qtaCalc = _this.simulation.calculations.length;
            }
        }, function (err) {
            console.log(err.json());
        });
    };
    CalculationMobileComponent.prototype.addCalculation = function (key) {
        //this.enable = true;
        if (this.calculationqta < 1) {
            this.simulation.calculations[key] = new Calculation_dto_1.Calculation;
        }
        else {
            //copia a anterior
            if (this.simulation.calculations[key - 1]) {
                this.simulation.calculations[key] = __assign({}, this.simulation.calculations[key - 1]);
            }
            else {
                this.simulation.calculations[key] = __assign({}, this.simulation.calculations[key - 2]);
            }
            this.simulation.calculations[key].id = null;
            this.simulation.calculations[key].selected = false;
        }
        this.showCalculations[key] = true;
    };
    CalculationMobileComponent.prototype.removeCalculation = function (key) {
        this.simulation.calculations[key] = undefined;
        this.showCalculations[key] = false;
    };
    CalculationMobileComponent.prototype.contratado = function (key) {
        this.showCalculationsPreview[key] = true;
    };
    CalculationMobileComponent.prototype.dados = function (listInstallments) {
    };
    CalculationMobileComponent.prototype.change = function (event) {
        this.simulation.step = 6;
    };
    CalculationMobileComponent = __decorate([
        core_1.Component({
            selector: 'calculationpainel-mobile',
            templateUrl: 'app/simulation/mobile/calculationMobile/calculation-painel-mobile.component.html',
            styleUrls: []
        }),
        __metadata("design:paramtypes", [app_service_1.AppService,
            simulation_service_1.SimulationService])
    ], CalculationMobileComponent);
    return CalculationMobileComponent;
}());
exports.CalculationMobileComponent = CalculationMobileComponent;
//# sourceMappingURL=calculation-painel-mobile.component.js.map