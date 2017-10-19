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
var Simulation_dto_1 = require("./../dto/Simulation.dto");
var app_service_1 = require("./../../app.service");
var core_1 = require("@angular/core");
var ListCars = /** @class */ (function () {
    function ListCars(appService) {
        this.appService = appService;
        this.carselect = new core_1.EventEmitter();
    }
    ListCars.prototype.select = function (event, car) {
        if (!this.simulation.readOnly || car.selected) {
            this.carselect.emit(car);
            this.cars.forEach(function (element) {
                element.selected = false;
            });
            this.utilitarios.forEach(function (element) {
                element.selected = false;
            });
            car.selected = true;
        }
    };
    ListCars.prototype.disableFieldsByStatusDossier = function () {
        if (this.simulation.readOnly) {
            return true;
        }
        if (this.simulation.dossierStatus == 9 || this.simulation.dossierStatus == 3) {
            return true;
        }
        return false;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ListCars.prototype, "cars", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ListCars.prototype, "utilitarios", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Simulation_dto_1.Simulation)
    ], ListCars.prototype, "simulation", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ListCars.prototype, "carselect", void 0);
    ListCars = __decorate([
        core_1.Component({
            selector: 'listcars',
            templateUrl: './app/simulation/cardcar/listcars.component.html',
            styleUrls: ['./app/simulation/cardcar/listcars.component.scss']
        }),
        __metadata("design:paramtypes", [app_service_1.AppService])
    ], ListCars);
    return ListCars;
}());
exports.ListCars = ListCars;
//# sourceMappingURL=listCars.component.js.map