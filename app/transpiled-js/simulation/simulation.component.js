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
var send_simulation_dialog_1 = require("./customer_card/send_simulation_dialog/send_simulation.dialog");
var simulation_service_1 = require("./simulation.service");
var SalesmanStructure_dto_1 = require("./dto/SalesmanStructure.dto.");
var salesman_dto_1 = require("./selected_salesman_dialog/dto/salesman.dto");
var app_component_1 = require("./../app.component");
var app_service_1 = require("./../app.service");
var material_1 = require("@angular/material");
var Simulation_dto_1 = require("./dto/Simulation.dto");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var exitSalesmanDialog_dialog_1 = require("./exit_salesman_dialog/exitSalesmanDialog.dialog");
var auth_service_1 = require("./../login/auth.service");
var app_message_1 = require("./../app.message");
var flex_layout_1 = require("@angular/flex-layout");
var step_enum_1 = require("./step.enum");
var SimulationComponent = /** @class */ (function () {
    function SimulationComponent(activeRoute, router, appService, appComponent, media, dialog, authService, appMessage, simulationService) {
        this.activeRoute = activeRoute;
        this.router = router;
        this.appService = appService;
        this.appComponent = appComponent;
        this.media = media;
        this.dialog = dialog;
        this.authService = authService;
        this.appMessage = appMessage;
        this.simulationService = simulationService;
    }
    ;
    SimulationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activeRoute
            .params
            .subscribe(function (params) {
            _this.simulation = new Simulation_dto_1.Simulation();
            _this.simulation.id = params['id'] || undefined;
        });
        if (this.simulation.id) {
            // consultar o dossier
            this.getDossier();
        }
        else {
            this.keepSalesmanStructure();
        }
        this.simulationService.setSimulation(this.simulation);
    };
    SimulationComponent.prototype.getStep = function () {
        return step_enum_1.StepEnum;
    };
    SimulationComponent.prototype.keepSalesmanStructure = function () {
        var _this = this;
        var option = sessionStorage.getItem('salesman');
        if (option != null) {
            var salesman = JSON.parse(sessionStorage.getItem('salesman'));
            this.simulation.salesmanStructure = new SalesmanStructure_dto_1.SalesmanStructure;
            this.simulation.salesmanStructure.salesmanId = salesman.id;
            this.simulation.salesmanStructure.salesmanName = salesman.name;
            var observable = this.appService.xSearchWithData('structureService/questDealershipBySallesmanUser', {});
            observable.subscribe(function (data) {
                var response = data.json();
                _this.authService.setStructure(response.structure.structureId);
                var structure = response.structure;
                if (structure != null) {
                    _this.simulation.salesmanStructure.structureId = structure.structureId != null ? structure.structureId : '';
                    _this.simulation.salesmanStructure.structureDescription = structure.description;
                }
            }, function (err) {
                console.log(err.json());
            });
        }
    };
    SimulationComponent.prototype.loadSalesman = function () {
        var _this = this;
        var observable = this.appService.xSearch('simulation/salesman', this.simulation.id);
        observable.subscribe(function (data) {
            var response = data.json();
            _this.authService.setSalesMan(new salesman_dto_1.Salesman(response.salesman.id, response.salesman.name));
            var salesman = JSON.parse(sessionStorage.getItem('salesman'));
            _this.simulation.salesmanStructure = new SalesmanStructure_dto_1.SalesmanStructure;
            _this.simulation.salesmanStructure.salesmanId = salesman.id;
            _this.simulation.salesmanStructure.salesmanName = salesman.name;
            _this.keepSalesmanStructure();
        });
    };
    SimulationComponent.prototype.changeStep = function (toFront) {
        if (this.simulation.step < step_enum_1.StepEnum.STEP_CLIENT) {
            return;
        }
        if (this.simulation.step == 6) {
            this.simulation.step = 3;
        }
        if (toFront) {
            this.simulation.step++;
        }
        else {
            if (this.simulation.client.civilState) {
                if ((this.simulation.client.civilState.description != "CASADO"
                    && this.simulation.client.civilState.description != "COMPANHEIRO"
                    && this.simulation.step == step_enum_1.StepEnum.STEP_MOBILE_PROFESSIONAL_DATA)) {
                    this.simulation.step--;
                }
                if (this.simulation.client.guarantor1) {
                    if ((this.simulation.client.guarantor1.civilState.description != "CASADO"
                        && this.simulation.client.guarantor1.civilState.description != "COMPANHEIRO"
                        && this.simulation.step == step_enum_1.StepEnum.STEP_MOBILE_GUARANTOR_ONE_PROFESSIONAL)) {
                        this.simulation.step--;
                    }
                }
                if (this.simulation.client.guarantor2) {
                    if ((this.simulation.client.guarantor2.civilState.description != "CASADO"
                        && this.simulation.client.guarantor2.civilState.description != "COMPANHEIRO"
                        && this.simulation.step == step_enum_1.StepEnum.STEP_MOBILE_GUARANTOR_TWO_PROFESSIONAL)) {
                        this.simulation.step--;
                    }
                }
                if (this.simulation.step == step_enum_1.StepEnum.STEP_MOBILE_GUARANTOR_TWO_CLIENT
                    && this.simulation.client.guarantor1.guarantorType.id == "0") {
                    this.simulation.step = step_enum_1.StepEnum.STEP_MOBILE_GUARANTOR_ONE_CLIENT + 1;
                }
            }
            this.simulation.step--;
        }
    };
    SimulationComponent.prototype.sendByEmail = function (dossierId) {
        var urlStr = "sendEmail/" + dossierId + "/" + this.appComponent.theme;
        var sendEmail = this.appService.xSearch("proposalService", urlStr);
        sendEmail.subscribe(function (err) {
            console.log(err.json());
        });
    };
    SimulationComponent.prototype.print = function (dossierId) {
        var urlStr = "print/" + dossierId + "/" + this.appComponent.theme;
        this.appService.xFileDownload("proposalService", urlStr, "FILE", "pdf");
    };
    SimulationComponent.prototype.openDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(exitSalesmanDialog_dialog_1.ExitSalesmanDialog, { width: '50%' });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(function (result) {
            if (dialogRef.componentInstance.confirm) {
                var item = {};
                var theme = "";
                theme = JSON.parse(sessionStorage.getItem('oldTheme'));
                item["value"] = theme;
                _this.appComponent.changeTheme(item);
                _this.router.navigateByUrl('/home');
            }
        });
    };
    SimulationComponent.prototype.getDossier = function () {
        var _this = this;
        var searchDossier = this.appService.xSearch('myProposal/dossier', this.simulation.id);
        searchDossier.subscribe(function (data) {
            var response = data.json();
            if (response.msgSantander) {
                _this.appMessage.showWarning(response.msgSantander);
            }
            _this.loadSimulation(response);
        }, function (err) {
            _this.router.navigate(['/home']);
        });
    };
    SimulationComponent.prototype.readOnly = function () {
        /**
         * Responsavel por realizar o bloqueio de todos os campos
         * de todas as telas, pelo qual, o status da Proposta seja igual
         * a 31 (Vencida), 08 (Cancelada), 30 (Desistência), 10 (Efetivada),
         * 05 (Em analise), 07 (Negada), 32 (Cancelado SIN/SFA).
         */
        if (this.simulation.dossierStatus == 31
            || this.simulation.dossierStatus == 8
            || this.simulation.dossierStatus == 30
            || this.simulation.dossierStatus == 10
            || this.simulation.dossierStatus == 5
            || this.simulation.dossierStatus == 7
            || this.simulation.dossierStatus == 32) {
            this.simulation.readOnly = true;
        }
    };
    SimulationComponent.prototype.saveDossier = function () {
        var _this = this;
        var dossier = { simulation: this.simulation };
        var saveDossierService = this.appService.xSearchWithData('savesimulation/savesimulation', dossier);
        saveDossierService.subscribe(function (data) {
            var response = data.json();
            _this.appMessage.showDefaultSuccess();
            //seta o step corrente
            response.step = _this.simulation.step;
            _this.loadSimulation(response);
            _this.simulationService.setSimulation(_this.simulation);
            var dialogRef = _this.dialog.open(send_simulation_dialog_1.SendSimulationDialog, { width: '40%' });
            //caso o usuario confirme a envio para o Santander
            dialogRef.afterClosed().subscribe(function (result) {
                if (result) {
                    _this.sendSantander();
                }
            });
        }, function (err) {
            console.log(err.json());
        });
    };
    SimulationComponent.prototype.onlySaveDossier = function () {
        var _this = this;
        var dossier = { simulation: this.simulation };
        var saveDossierService = this.appService.xSearchWithData('savesimulation/savesimulation', dossier);
        saveDossierService.subscribe(function (data) {
            var response = data.json();
            _this.appMessage.showDefaultSuccess();
            //seta o step corrente
            response.step = _this.simulation.step;
            _this.loadSimulation(response);
            _this.simulationService.setSimulation(_this.simulation);
        }, function (err) {
            console.log(err.json());
        });
    };
    SimulationComponent.prototype.sendSantander = function () {
        var _this = this;
        if (this.simulation.id) {
            var send = new Object;
            send["dossierId"] = this.simulation.id;
            var specialget = this.appService.xPost('santanderService/sendDossierSantander', send);
            specialget.subscribe(function (data) {
                _this.appMessage.showDefaultSuccess();
                _this.getDossier();
                _this.simulationService.setSimulation(_this.simulation);
            }, function (err) {
            });
        }
    };
    SimulationComponent.prototype.loadSimulation = function (jsonObject) {
        this.simulation.id = jsonObject.simulation.id;
        this.simulation.car = jsonObject.simulation.car;
        this.simulation.client = jsonObject.simulation.client;
        this.simulation.saleType = jsonObject.simulation.saleType;
        this.simulation.tc = jsonObject.simulation.tc;
        this.simulation.vizualization = jsonObject.simulation.vizualization;
        this.simulation.brand = jsonObject.simulation.brand;
        this.simulation.calculations = jsonObject.simulation.calculations;
        this.simulation.specialTypes = jsonObject.simulation.specialTypes;
        this.simulation.isShowRoomSemiNews = jsonObject.simulation.isShowRoomSemiNews;
        this.simulation.showNewOnes = jsonObject.simulation.showNewOnes;
        this.simulation.dossierNumber = jsonObject.simulation.dossierNumber;
        this.simulation.dossierStatus = jsonObject.simulation.dossierStatus;
        this.simulation.calculationSelected = jsonObject.simulation.calculationSelected;
        this.simulation.certifiedAgent = jsonObject.simulation.certifiedAgent;
        this.simulation.showBtnSave = true;
        this.simulation.step = jsonObject.step;
        this.simulation.step5CanNext = jsonObject.simulation.showDocuments;
        this.loadSalesman();
        this.readOnly();
    };
    SimulationComponent.prototype.ngOnDestroy = function () {
        this.simulationService.setSimulation(null);
    };
    SimulationComponent = __decorate([
        core_1.Component({
            selector: 'simulation',
            templateUrl: './app/simulation/simulation.component.html'
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, app_service_1.AppService,
            app_component_1.AppComponent, flex_layout_1.ObservableMedia, material_1.MdDialog,
            auth_service_1.AuthService, app_message_1.AppMessage, simulation_service_1.SimulationService])
    ], SimulationComponent);
    return SimulationComponent;
}());
exports.SimulationComponent = SimulationComponent;
//# sourceMappingURL=simulation.component.js.map