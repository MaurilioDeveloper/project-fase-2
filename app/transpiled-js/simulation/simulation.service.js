"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Simulation_dto_1 = require("./dto/Simulation.dto");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var core_1 = require("@angular/core");
var SimulationService = /** @class */ (function () {
    function SimulationService() {
        this.load = new BehaviorSubject_1.BehaviorSubject(new Simulation_dto_1.Simulation());
    }
    SimulationService.prototype.setSimulation = function (simulation) {
        this.load.next(simulation);
        var obs = this.load.asObservable();
        obs.subscribe(function (message) { console.log(message); });
    };
    SimulationService = __decorate([
        core_1.Injectable()
    ], SimulationService);
    return SimulationService;
}());
exports.SimulationService = SimulationService;
//# sourceMappingURL=simulation.service.js.map