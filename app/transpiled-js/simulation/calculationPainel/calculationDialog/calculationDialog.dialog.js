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
var Calculation_dto_1 = require("./../../dto/Calculation.dto");
var simulation_service_1 = require("./../../simulation.service");
var step_enum_1 = require("./../../step.enum");
var app_service_1 = require("./../../../app.service");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var CalculationDialog = /** @class */ (function () {
    function CalculationDialog(appService, dialogRef, simulationService) {
        this.appService = appService;
        this.dialogRef = dialogRef;
        this.simulationService = simulationService;
        this.showCalculations = [false, false, false];
    }
    CalculationDialog.prototype.ngOnInit = function () {
        var _this = this;
        this.simulationService.load.subscribe(function (simulation) {
            _this.simulation = simulation;
            if (_this.simulation && _this.simulation.step == step_enum_1.StepEnum.STEP_SIMULATION) {
                _this.onload();
            }
        });
    };
    CalculationDialog.prototype.onload = function () {
        if (!this.simulation.calculations || this.simulation.calculations.length === 0) {
            this.simulation.calculations = [new Calculation_dto_1.Calculation];
            for (var i = 0; i < this.calculationqta; i++) {
                this.simulation.calculations[i] = new Calculation_dto_1.Calculation;
                this.showCalculations[i] = true;
            }
        }
        else {
            for (var i = 0; i < this.simulation.calculations.length; i++) {
                this.showCalculations[i] = true;
            }
        }
    };
    CalculationDialog.prototype.addCalculation = function (key) {
        //this.enable = true;
        if (!this.simulation.readOnly && this.simulation.dossierStatus != 9) {
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
        }
    };
    CalculationDialog.prototype.removeCalculation = function (key) {
        if (!this.simulation.readOnly && this.simulation.dossierStatus != 9) {
            this.simulation.calculations[key] = undefined;
            this.showCalculations[key] = false;
        }
    };
    CalculationDialog = __decorate([
        core_1.Component({
            selector: 'calculation-dialog',
            templateUrl: 'app/simulation/calculationPainel/calculationDialog/calculationDialog.dialog.html'
        }),
        __metadata("design:paramtypes", [app_service_1.AppService, material_1.MdDialogRef,
            simulation_service_1.SimulationService])
    ], CalculationDialog);
    return CalculationDialog;
}());
exports.CalculationDialog = CalculationDialog;
//# sourceMappingURL=calculationDialog.dialog.js.map