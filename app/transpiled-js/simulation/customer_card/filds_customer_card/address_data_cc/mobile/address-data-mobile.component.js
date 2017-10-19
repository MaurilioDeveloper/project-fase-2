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
var address_data_service_1 = require("./../service/address-data.service");
var simulation_service_1 = require("./../../../../simulation.service");
var core_1 = require("@angular/core");
var AddressDataCustomerCardMobileComponent = /** @class */ (function () {
    function AddressDataCustomerCardMobileComponent(addressDataService, simulationService) {
        this.addressDataService = addressDataService;
        this.simulationService = simulationService;
        this.countClient = new core_1.EventEmitter();
        this.controlDynamicStepsM = new core_1.EventEmitter();
        this.conf = false;
    }
    ;
    AddressDataCustomerCardMobileComponent.prototype.ngOnInit = function () {
        this.addressDataService.init();
        this.getSimulation().client.address.residesInAddressSince = new Date(this.getSimulation().client.address.residesInAddressSince);
    };
    AddressDataCustomerCardMobileComponent.prototype.getSimulation = function () {
        return this.addressDataService.simulation;
    };
    AddressDataCustomerCardMobileComponent.prototype.getListProvince = function () {
        return this.addressDataService.listProvince;
    };
    AddressDataCustomerCardMobileComponent.prototype.getListTypeResidence = function () {
        return this.addressDataService.listTypeResidence;
    };
    AddressDataCustomerCardMobileComponent.prototype.getListMailingAddress = function () {
        return this.addressDataService.listMailingAddress;
    };
    AddressDataCustomerCardMobileComponent.prototype.isPhysicalPerson = function () {
        return this.addressDataService.isPhysicalPerson;
    };
    AddressDataCustomerCardMobileComponent.prototype.disableFieldsByStatusDossier = function () {
        return this.addressDataService.disableFieldsByStatusDossier();
    };
    AddressDataCustomerCardMobileComponent.prototype.disableFieldsByStatusThree = function () {
        return this.addressDataService.disableFieldsByStatusThree();
    };
    AddressDataCustomerCardMobileComponent.prototype.nextStep = function () {
        if (this.isPhysicalPerson() && this.showSpouse) {
            this.controlDynamicStepsIn = 4;
        }
        else {
            this.controlDynamicStepsIn = 5;
            this.getSimulation().step++;
        }
        if (!this.conf) {
            this.countClient.emit();
            this.conf = true;
        }
        this.getSimulation().step++;
        console.log(this.getSimulation().step);
        this.controlDynamicStepsM.emit(this.controlDynamicStepsIn);
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AddressDataCustomerCardMobileComponent.prototype, "countClient", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], AddressDataCustomerCardMobileComponent.prototype, "controlDynamicStepsIn", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AddressDataCustomerCardMobileComponent.prototype, "controlDynamicStepsM", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], AddressDataCustomerCardMobileComponent.prototype, "showSpouse", void 0);
    AddressDataCustomerCardMobileComponent = __decorate([
        core_1.Component({
            selector: 'address-data-mobile',
            templateUrl: 'app/simulation/customer_card/filds_customer_card/address_data_cc/mobile/address-data-mobile.component.html',
            providers: [address_data_service_1.AddressDataService]
        }),
        __metadata("design:paramtypes", [address_data_service_1.AddressDataService, simulation_service_1.SimulationService])
    ], AddressDataCustomerCardMobileComponent);
    return AddressDataCustomerCardMobileComponent;
}());
exports.AddressDataCustomerCardMobileComponent = AddressDataCustomerCardMobileComponent;
//# sourceMappingURL=address-data-mobile.component.js.map