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
var material_1 = require("@angular/material");
var dialogQuotation_dialog_1 = require("./../simulation/card_client/dialogQuotation/dialogQuotation.dialog");
var Historic_dto_1 = require("./../simulation/dto/client/Historic.dto");
var simulation_service_1 = require("./../simulation/simulation.service");
var core_1 = require("@angular/core");
var step_enum_1 = require("./../simulation/step.enum");
var discard_insurance_quote_dialog_dialog_1 = require("./../simulation/discardInsuranceQuoteDialog/discard-insurance-quote-dialog.dialog");
var new_ones_service_1 = require("./../simulation/new_ones/service/new-ones.service");
var StepperComponent = /** @class */ (function () {
    function StepperComponent(simulationService, dialog, newOnesService) {
        this.simulationService = simulationService;
        this.dialog = dialog;
        this.newOnesService = newOnesService;
        this.changeStep = new core_1.EventEmitter();
        this.save = new core_1.EventEmitter();
        this.segAuto = false;
    }
    ;
    StepperComponent.prototype.ngOnInit = function () {
        var _this = this;
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            this.browser = "IE";
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            this.browser = "IE";
        }
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            this.browser = "IE";
        }
        this.simulationService.load.subscribe(function (simulation) {
            _this.simulation = simulation;
            if (_this.simulation) {
                _this.onload();
            }
        });
    };
    StepperComponent.prototype.onload = function () {
    };
    StepperComponent.prototype.getStep = function () {
        return step_enum_1.StepEnum;
    };
    StepperComponent.prototype.change = function (toFront) {
        //this.segAuto = true;
        //Verifica se tem algum serviço "Cotizador" contratado. 
        if (this.simulation.calculationSelected.selected) {
            if (this.simulation.calculationSelected.serviceCotizador) {
                this.segAuto = true;
            }
        }
        if (!this.segAuto) {
            this.saveInfo();
            this.changeStep.emit(toFront);
        }
        else {
            if (this.verifyChange() && this.simulation.step == 0) {
                this.quotationDialog();
                /*} else if (this.verifyChangesVehicle() && this.simulation.step == StepEnum.STEP_VEHICLE && toFront) {
                  this.openDiscardInsuranceQuoteDialog();*/
            }
            else {
                this.changeStep.emit(toFront);
            }
        }
        //this.saveInitialValues();
    };
    // -----
    StepperComponent.prototype.openDiscardInsuranceQuoteDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(discard_insurance_quote_dialog_dialog_1.DiscardInsuranceQuoteDialog, { width: '50%' });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(function (result) {
            _this.simulation.calculations;
            if (dialogRef.componentInstance.response) {
                if (_this.simulation.calculationSelected.services) {
                    _this.simulation.calculationSelected.services.forEach(function (service) {
                        if (service.serviceTypeId === 30) {
                            service.checked = false;
                        }
                    });
                }
                _this.changeStep.emit(true);
            }
            else {
                _this.loadInitialValues();
                _this.newOnesService.init();
                _this.newOnesService.recalcT();
            }
        });
    };
    StepperComponent.prototype.verifyChangesVehicle = function () {
        if (JSON.stringify(this.simulation.brand) != this.simulation.initialBrand) {
            return true;
        }
        if (JSON.stringify(this.simulation.car) != this.simulation.initialCar) {
            return true;
        }
        if (JSON.stringify(this.simulation.specialTypes) != this.simulation.initialSpecialTypes) {
            return true;
        }
        return false;
    };
    StepperComponent.prototype.saveInitialValues = function () {
        console.log("saveInitialValues()");
        console.log(this.simulation.initialCar);
        this.simulation.initialBrand = JSON.stringify(this.simulation.brand);
        this.simulation.initialCar = JSON.stringify(this.simulation.car);
        this.simulation.initialSpecialTypes = JSON.stringify(this.simulation.specialTypes);
    };
    StepperComponent.prototype.loadInitialValues = function () {
        this.simulation.brand = JSON.parse(this.simulation.initialBrand);
        this.simulation.car = JSON.parse(this.simulation.initialCar);
        this.simulation.specialTypes = JSON.parse(this.simulation.initialSpecialTypes);
    };
    // -----
    StepperComponent.prototype.verifyChange = function () {
        if (this.segAuto) {
            if (this.simulation.client.aux.cpfCnpj != this.simulation.client.cpfCnpj) {
                return true;
            }
            if (this.simulation.client.aux.name != this.simulation.client.name) {
                return true;
            }
            if (this.simulation.client.aux.phone.number != this.simulation.client.phone.number) {
                return true;
            }
            if (this.simulation.client.aux.email != this.simulation.client.email) {
                return true;
            }
            if (this.simulation.client.aux.province != this.simulation.client.province) {
                return true;
            }
            if (this.simulation.client.aux.saleType != this.simulation.saleType) {
                return true;
            }
        }
    };
    StepperComponent.prototype.quotationDialog = function () {
        var dialogRef = this.dialog.open(dialogQuotation_dialog_1.QuotationDialog, { width: '50%' });
        //Envia opção de pular steps para dialog
        dialogRef.componentInstance.changeStep = this.changeStep;
    };
    StepperComponent.prototype.saveInfo = function () {
        this.simulation.client.aux = new Historic_dto_1.Historic();
        this.simulation.client.aux.cpfCnpj = this.simulation.client.cpfCnpj;
        this.simulation.client.aux.name = this.simulation.client.name;
        this.simulation.client.aux.email = this.simulation.client.email;
        this.simulation.client.aux.phone.number = this.simulation.client.phone.number;
        this.simulation.client.aux.province = this.simulation.client.province;
        this.simulation.client.aux.saleType = this.simulation.saleType;
    };
    StepperComponent.prototype.ngOnChanges = function (changes) {
        switch (this.steep) {
            case step_enum_1.StepEnum.STEP_CLIENT:
                this.rightIcon = 'directions_car';
                this.rightText = 'Editar <br>Veiculo';
                this.stepFour = 'stepNo';
                this.stepOne = document.body.getElementsByTagName('app-root')[0].getElementsByTagName('div')[0].getElementsByClassName("ng-invalid");
                // this.stepOne = document.body.getElementsByTagName('app-root')[0].getElementsByTagName('div')[0].getElementsByTagName('form');
                // this.stepOne = document.body.getElementsByTagName('app-root')[0].getElementsByTagName('div')[0].getElementsByTagName('form');
                // console.log(this.formClient);
                // this.stepOne = document.body.getElementsByTagName('app-root')[0].getElementsByTagName('div')[0].getElementsByClassName("ng-invalid")[0];
                if (this.stepOne.length > step_enum_1.StepEnum.STEP_CLIENT) {
                    this.enabledNextStep = true;
                }
                else {
                    this.enabledNextStep = false;
                }
                // this.stepOne = this.formClient.nativeElement.parentElement.parentElement.get("#formClient");
                // console.log(this.stepOne);
                // let stepOne = document.getElementById("formClient").getElementsByTagName("div")[0].getElementsByClassName("ng-invalid")[0];
                // console.log(stepOne);
                break;
            case step_enum_1.StepEnum.STEP_VEHICLE:
                this.leftIcon = 'person';
                this.leftText = 'Editar <br>Cliente';
                this.rightIcon = 'keyboard';
                this.rightText = 'Editar <br>Simulação';
                this.stepFour = 'stepNo';
                this.canNext = this.simulation.step2CanNext;
                break;
            case step_enum_1.StepEnum.STEP_SIMULATION:
                this.leftIcon = 'directions_car';
                this.leftText = 'Editar <br>Veiculo';
                this.rightIcon = 'recent_actors';
                this.rightText = 'Ficha do  <br>Cliente';
                this.stepFour = 'stepNo';
                this.canNext = this.simulation.step3CanNext;
                break;
            case step_enum_1.StepEnum.STEP_CUSTOMER_CARD:
                this.leftIcon = 'keyboard';
                this.leftText = 'Editar <br>Simulação';
                this.rightIcon = 'near_me';
                this.rightText = 'Enviar <br>Proposta';
                this.stepFour = 'stepNo';
                this.canNext = this.simulation.step4CanNext;
                break;
            case step_enum_1.StepEnum.STEP_SEND:
                this.leftIcon = 'recent_actors';
                this.leftText = 'Voltar para<br>Ficha';
                this.rightIcon = 'description';
                this.rightText = 'Documentação<br>Disponível';
                this.stepFour = 'stepFour';
                this.canNext = this.simulation.step5CanNext;
                /**TODO Fazer a ligação do front com o Back */
                break;
            case step_enum_1.StepEnum.STEP_DOCUMENT:
                this.leftIcon = 'description';
                this.leftText = 'Voltar para<br>Envio';
                this.stepFour = 'stepNo';
                this.canNext = this.simulation.step6CanNext;
                break;
            default:
                break;
        }
    };
    StepperComponent.prototype.saveDossier = function (toFront) {
        this.save.emit();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], StepperComponent.prototype, "steep", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], StepperComponent.prototype, "changeStep", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], StepperComponent.prototype, "save", void 0);
    StepperComponent = __decorate([
        core_1.Component({
            selector: 'stepper',
            templateUrl: './app/stepper/stepper.component.html',
            providers: [new_ones_service_1.NewOnesService]
        }),
        __metadata("design:paramtypes", [simulation_service_1.SimulationService, material_1.MdDialog, new_ones_service_1.NewOnesService])
    ], StepperComponent);
    return StepperComponent;
}());
exports.StepperComponent = StepperComponent;
//# sourceMappingURL=stepper.component.js.map