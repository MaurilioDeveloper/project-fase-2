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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var simulation_service_1 = require("./../../../simulation.service");
var flex_layout_1 = require("@angular/flex-layout");
var Coefficient_dto_1 = require("./../../../dto/Coefficient.dto");
var installments_dialog_1 = require("./installmentsDialog/installments.dialog");
var Commission_dto_1 = require("./../../../dto/Commission.dto");
var FinancialTable_dto_1 = require("./../../../dto/FinancialTable.dto");
var servicesDialog_dialog_1 = require("./servicesDialog/servicesDialog.dialog");
var material_1 = require("@angular/material");
var app_service_1 = require("./../../../../app.service");
var core_1 = require("@angular/core");
var Client_dto_1 = require("../../../dto/Client.dto");
var app_message_1 = require("../../../../app.message");
var step_enum_1 = require("./../../../step.enum");
var CalculationComponent = /** @class */ (function () {
    function CalculationComponent(appService, appMessage, dialog, media, simulationService) {
        this.appService = appService;
        this.appMessage = appMessage;
        this.dialog = dialog;
        this.media = media;
        this.simulationService = simulationService;
        this.removeCalculation = new core_1.EventEmitter();
        this.entrancePerc = 0;
        this.commisionList = new Array();
        this.financialTypeList = new Array();
        this.financialTableList = new Array();
        this.delayList = new Array();
        this.repackageList = new Array();
        this.termList = new Array();
        this.taxType = new Array();
        this.isCDCFlex = false;
        this.settingEntrace = false;
        this.loadSetDefaultPercentage = true;
        //Mobile
        this.showMobileEditDetail = [false, false, false];
        // editMobileCalc: boolean[] = [false, false, false];
        this.serviceList = new Array();
    }
    CalculationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.simulationService.load.subscribe(function (simulation) {
            _this.simulation = simulation;
            if (_this.simulation && _this.simulation.step == step_enum_1.StepEnum.STEP_SIMULATION) {
                _this.onload();
            }
        });
    };
    CalculationComponent.prototype.onload = function () {
        this.initializedFields();
        this.loadFinancialTypeSyncronized();
        if (!this.media.isActive('xs')) {
            this.showMobileEditDetail = [true, true, true];
        }
    };
    CalculationComponent.prototype.initializedFields = function () {
        if (this.simulation.client.cpfCnpj.length == 14) {
            this.simulation.client.typePerson = Client_dto_1.TypePerson.PJ;
        }
        else {
            this.simulation.client.typePerson = Client_dto_1.TypePerson.PF;
        }
        this.calculation = this.simulation.calculations[this.calculationID];
        this.sunTotalAmount();
        if (!this.calculation.commission)
            this.calculation.commission = new Commission_dto_1.Commission;
        if (!this.calculation.coeficiente)
            this.calculation.coeficiente = new Coefficient_dto_1.Coefficient;
    };
    //carregando as combos de forma sincronizada
    CalculationComponent.prototype.loadFinancialTypeSyncronized = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadFinancialType().toPromise()];
                    case 1:
                        _a.sent();
                        if (this.calculation.financialType.financeTypeId) {
                            this.loadFinancialTableSyncronized();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //carregando as combos de forma sincronizada
    CalculationComponent.prototype.loadFinancialTableSyncronized = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadFinancialTable().toPromise()];
                    case 1:
                        _a.sent();
                        if (this.calculation.financialTable.productId) {
                            this.loadFinancialOthersSyncronized();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //carregando as combos de forma sincronizada
    CalculationComponent.prototype.loadFinancialOthersSyncronized = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadServices().toPromise()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadComission().toPromise()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.loadTerm().toPromise()];
                    case 3:
                        _a.sent();
                        if (!this.isCDCFlex) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.loadRepackage().toPromise()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.loadDelay().toPromise()];
                    case 6:
                        _a.sent();
                        if (this.loadSetDefaultPercentage) {
                            this.setDefaultPercentage();
                            this.loadSetDefaultPercentage = false;
                        }
                        this.calculate();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
  * Financial Type
  * */
    CalculationComponent.prototype.loadFinancialType = function () {
        var _this = this;
        var requestFinancialType = new Object;
        if (this.simulation.id) {
            requestFinancialType["financeTypeSelected"] = this.calculation.financialType.financeTypeId;
        }
        else {
            this.calculation.selected = false;
        }
        var getFinancialType = this.appService.xSearchWithData('financeTypeService/getFinancialType', requestFinancialType);
        getFinancialType.subscribe(function (data) {
            var financeTypeResponse = data.json();
            for (var i = 0; i < financeTypeResponse.listFinanceType.length; i++) {
                var financeType = financeTypeResponse.listFinanceType[i];
                _this.financialTypeList.push(financeType);
                if (!financeTypeResponse.financeTypeSelected) {
                    _this.selectFinanceTypeDefault();
                }
                else {
                    if (financeType.financeTypeId === financeTypeResponse.financeTypeSelected.financeTypeId) {
                        _this.calculation.financialType = financeType;
                    }
                }
            }
            _this.isCDCFlex = _this.isCDCFlexSelected();
        }, function (err) {
            console.log(err.json());
        });
        return getFinancialType;
    };
    CalculationComponent.prototype.loadFinancialTable = function () {
        var _this = this;
        var requestFinancialTable = new Object;
        var financialTableSelected = null;
        if (this.simulation.id) {
            financialTableSelected = this.calculation.financialTable;
        }
        requestFinancialTable["idCalculation"] = this.calculationID;
        requestFinancialTable["vehicleVersion"] = this.simulation.car.version.id;
        if (this.simulation.client.typePerson) {
            requestFinancialTable["personType"] = this.simulation.client.typePerson;
        }
        var specialVehicleTypes = new Array();
        if (this.simulation.specialTypes) {
            for (var i = 0; i < this.simulation.specialTypes.length; i++) {
                specialVehicleTypes.push(this.simulation.specialTypes[i].id);
            }
        }
        requestFinancialTable["saleType"] = this.simulation.saleType.id;
        requestFinancialTable["specialVehicleTypes"] = specialVehicleTypes;
        requestFinancialTable["modelYear"] = this.simulation.car.version.yearModel;
        requestFinancialTable["manufactureYear"] = this.simulation.car.version.yearManufacture;
        requestFinancialTable["financeTypeId"] = this.calculation.financialType.financeTypeId;
        requestFinancialTable["vehicleType"] = this.simulation.car.gender;
        this.cleanAll();
        //this.calculation.financialTable = null;
        var getFinancialTable = this.appService.xSearchWithData('productService/questProduct', requestFinancialTable);
        getFinancialTable.subscribe(function (data) {
            var financeTableResponse = data.json();
            for (var i = 0; i < financeTableResponse.listProduct.length; i++) {
                var financeTable = financeTableResponse.listProduct[i];
                _this.financialTableList.push(financeTable);
                if (financialTableSelected && financialTableSelected.productId == financeTable.productId) {
                    _this.calculation.financialTable = financeTable;
                }
            }
            if (_this.financialTableList && _this.financialTableList.length > 0) {
                if (!_this.calculation.financialTable || !_this.calculation.financialTable.productId) {
                    for (var i = 0; i < _this.financialTableList.length; i++) {
                        var table = _this.financialTableList[i];
                        if (table.promotional) {
                            _this.calculation.financialTable = table;
                        }
                    }
                    if (!_this.calculation.financialTable || !_this.calculation.financialTable.productId) {
                        _this.calculation.financialTable = _this.financialTableList[0];
                    }
                }
                _this.setDefaultPercentage();
            }
            else {
                _this.appMessage.showError("Não existem tabelas de financiamento elegíveis para os dados informados");
            }
        }, function (err) {
            console.log(err.json());
        });
        return getFinancialTable;
    };
    // recupera a comisão
    CalculationComponent.prototype.loadComission = function () {
        var _this = this;
        var requestCommission = new Object;
        this.calculation.commission = new Commission_dto_1.Commission;
        if (this.simulation.id) {
            requestCommission["commissionId"] = this.calculation.commission.id;
        }
        requestCommission["financeTypeId"] = this.calculation.financialType.financeTypeId;
        requestCommission["saleTypeId"] = this.simulation.saleType.id;
        requestCommission["financeTableId"] = this.calculation.financialTable.productId;
        requestCommission["promotionTable"] = this.calculation.financialTable.promotional;
        var getCommisionTable = this.appService.xSearchWithData('commissionLevelService/questCommissionAndTempCommission', requestCommission);
        getCommisionTable.subscribe(function (data) {
            var commisionTableResponse = data.json();
            _this.commisionList = new Array();
            for (var i = 0; i < commisionTableResponse.listUserCommission.length; i++) {
                var financeCommision = commisionTableResponse.listUserCommission[i];
                var financialTablePromotional = void 0;
                if (_this.calculationID == "0" && _this.calculation.financialTable.promotional && _this.calculation.financialTable.listProductPromotional) {
                    for (var index = 0; index < _this.calculation.financialTable.listProductPromotional.length; index++) {
                        var element = _this.calculation.financialTable.listProductPromotional[index];
                        if (element.commissionId === financeCommision.id) {
                            financialTablePromotional = element;
                            _this.commisionList.push(financeCommision);
                            break;
                        }
                    }
                }
                else {
                    _this.commisionList.push(financeCommision);
                }
                if (financialTablePromotional && financialTablePromotional.mainSource && (!_this.calculation.commission || !_this.calculation.commission.id)) {
                    _this.calculation.commission = financeCommision;
                }
            }
            _this.commisionList.sort(function (a, b) { return Number(a.description.trim()) - Number(b.description.trim()); });
            if (!_this.calculation.commission || !_this.calculation.commission.description) {
                _this.calculation.commission = _this.commisionList[_this.commisionList.length - 1];
            }
        }, function (err) {
            console.log(err.json());
        });
        return getCommisionTable;
    };
    CalculationComponent.prototype.loadTerm = function () {
        var _this = this;
        var requestdelay = new Object;
        requestdelay["productId"] = this.calculation.financialTable.productId;
        requestdelay["personType"] = this.simulation.client.typePerson;
        var getTerm = this.appService.xSearchWithData('poductCoefficient/term', requestdelay);
        getTerm.subscribe(function (data) {
            var financilaTermResponse = data.json();
            _this.termList = new Array();
            //this.calculation.term = undefined;
            for (var i = 0; i < financilaTermResponse.listTerm.length; i++) {
                var entity = financilaTermResponse.listTerm[i];
                var financialTablePromotional = void 0;
                if (_this.calculationID == "0" && _this.calculation.financialTable.promotional && _this.calculation.financialTable.listProductPromotional) {
                    for (var index = 0; index < _this.calculation.financialTable.listProductPromotional.length; index++) {
                        var element = _this.calculation.financialTable.listProductPromotional[index];
                        if (element.term === entity) {
                            financialTablePromotional = element;
                            _this.termList.push(entity);
                            break;
                        }
                    }
                }
                else {
                    _this.termList.push(entity);
                }
                if (financialTablePromotional && financialTablePromotional.mainSource && !_this.calculation.term) {
                    _this.calculation.term = entity;
                }
            }
            if (!_this.calculation.term && _this.termList.length > 0) {
                _this.calculation.term = _this.termList[0];
            }
        });
        return getTerm;
    };
    CalculationComponent.prototype.loadRepackage = function () {
        var _this = this;
        var observable = this.appService.xSearch('repackageService', this.calculation.financialTable.productId + '/' + this.calculation.term);
        observable.subscribe(function (data) {
            var response = data.json();
            _this.repackageList = new Array();
            for (var index = 0; index < response.listRepackage.length; index++) {
                var repackage = response.listRepackage[index];
                var financialTablePromotional = void 0;
                if (_this.calculationID == "0" && _this.calculation.financialTable.promotional && _this.calculation.financialTable.listProductPromotional) {
                    for (var index = 0; index < _this.calculation.financialTable.listProductPromotional.length; index++) {
                        var element = _this.calculation.financialTable.listProductPromotional[index];
                        if (element.repackageId && element.repackageId === repackage.id) {
                            financialTablePromotional = element;
                            _this.repackageList.push(repackage);
                            break;
                        }
                    }
                }
                else {
                    _this.repackageList.push(repackage);
                }
                if (financialTablePromotional && financialTablePromotional.mainSource && !_this.calculation.repackage) {
                    _this.calculation.repackage = repackage;
                }
            }
            if (!_this.calculation.repackage && _this.repackageList[0]) {
                _this.calculation.repackage = _this.repackageList[0];
            }
        }, function (err) {
            console.log(err.json());
        });
        return observable;
    };
    CalculationComponent.prototype.loadDelay = function () {
        var _this = this;
        var requestdelay = new Object;
        requestdelay["productId"] = this.calculation.financialTable.productId;
        requestdelay["personType"] = this.simulation.client.typePerson;
        var getdelay = this.appService.xSearchWithData('delayValue', requestdelay);
        getdelay.subscribe(function (data) {
            var delayResponse = data.json();
            _this.delayList = new Array();
            for (var i = 0; i < delayResponse.listDelayValue.length; i++) {
                var entity = delayResponse.listDelayValue[i];
                var financialTablePromotional = void 0;
                if (_this.calculationID == "0" && _this.calculation.financialTable.promotional && _this.calculation.financialTable.listProductPromotional) {
                    for (var index = 0; index < _this.calculation.financialTable.listProductPromotional.length; index++) {
                        var element = _this.calculation.financialTable.listProductPromotional[index];
                        if (element.delayValue === entity) {
                            financialTablePromotional = element;
                            _this.delayList.push(entity);
                            break;
                        }
                    }
                }
                else {
                    _this.delayList.push(entity);
                }
                if (financialTablePromotional && financialTablePromotional.mainSource && !_this.calculation.delay) {
                    _this.calculation.delay = entity;
                }
            }
            if (!_this.calculation.delay && _this.delayList.length > 0) {
                _this.calculation.delay = _this.delayList[0];
            }
        }, function (err) {
            console.log(err.json());
        });
        return getdelay;
    };
    /**
     * seleciona o tipo de produto default
     */
    CalculationComponent.prototype.selectFinanceTypeDefault = function () {
        var resultList = this.financialTypeList.filter(function (financialType) { return financialType.description === 'CDC'; });
        if (resultList[0]) {
            this.calculation.financialType = resultList[0];
        }
    };
    CalculationComponent.prototype.cleanAll = function () {
        this.financialTableList = new Array();
        this.calculation.financialTable = new FinancialTable_dto_1.FinancialTable;
        //this.calculation.entranceValue = 0;
        //this.entrancePerc = 0;
        this.commisionList = new Array();
        this.calculation.commission = undefined;
        this.financialTableList = new Array();
        this.delayList = new Array();
        this.repackageList = new Array();
        this.calculation.repackage = null;
        this.calculation.delay = undefined;
        //this.termList = new Array<number>();
        //this.calculation.term = undefined;
    };
    CalculationComponent.prototype.changeFinancialType = function () {
        this.isCDCFlex = this.isCDCFlexSelected();
        this.loadFinancialTableSyncronized();
    };
    CalculationComponent.prototype.changeFinancialTable = function () {
        this.loadFinancialOthersSyncronized();
    };
    CalculationComponent.prototype.changeTerm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isCDCFlex) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadRepackage().toPromise()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.calculate();
                        return [2 /*return*/];
                }
            });
        });
    };
    CalculationComponent.prototype.totalServicesCalculate = function () {
        var totalServices = 0;
        if (this.calculation.services) {
            this.calculation.services.forEach(function (service) {
                if (service.serviceTypeId != 5) {
                    totalServices += service.amount;
                }
            });
        }
        return totalServices;
    };
    CalculationComponent.prototype.setEntranceValue = function () {
        var total = this.totalServicesCalculate() + this.calculation.totalValue;
        this.calculation.entranceValue = (total * this.entrancePerc) / 100;
        this.settingEntrace = true;
    };
    CalculationComponent.prototype.setEntrancePerc = function () {
        var total = this.totalServicesCalculate() + this.calculation.totalValue;
        this.entrancePerc = (this.calculation.entranceValue * 100) / total;
        this.settingEntrace = true;
    };
    CalculationComponent.prototype.installmentsDialog = function () {
        var dialogRef = this.dialog.open(installments_dialog_1.InstallmentsDialog, { height: '85%', width: '50%' });
        dialogRef.componentInstance.installments = this.calculation.installments;
        dialogRef.afterClosed().subscribe(function (result) {
        });
    };
    CalculationComponent.prototype.removeSimulation = function (key) {
        this.simulation.editOneCalcMobile = false;
        this.removeCalculation.emit(this.calculationID);
    };
    CalculationComponent.prototype.isCDCFlexSelected = function () {
        var financialTypeId = this.calculation.financialType.financeTypeId;
        var resultList = this.financialTypeList.filter(function (financialType) { return financialType.financeTypeId === financialTypeId; });
        if (resultList[0]) {
            return resultList[0].description === 'CDC Flex';
        }
        this.calculation.repackage = null;
        return false;
    };
    CalculationComponent.prototype.previuscondition = function () {
        if (!this.disableFieldsByStatusDossier()) {
            var pos = this.commisionList.indexOf(this.calculation.commission);
            pos--;
            if (pos >= 0) {
                this.calculation.commission = this.commisionList[pos];
                this.calculate();
            }
        }
    };
    CalculationComponent.prototype.nextcondition = function () {
        if (!this.disableFieldsByStatusDossier()) {
            var pos = this.commisionList.indexOf(this.calculation.commission);
            pos++;
            if (pos <= (this.commisionList.length - 1)) {
                this.calculation.commission = this.commisionList[pos];
                this.calculate();
            }
        }
    };
    CalculationComponent.prototype.loadServices = function () {
        var _this = this;
        if (!this.calculation.services) {
            this.calculation.services = [];
        }
        //tratamento se o objeto de simulação ja vier preenchido
        /*
        if (this.calculation.services.length != 0) {
            this.calcValue();
            this.loadFinancialTable();
            return;
        }
        */
        var itsSaleMan;
        var observable = this.appService.xSearch('userProfile', 'verifyuseradmin');
        observable.subscribe(function (data) {
            var response = data.json();
            if (response.userAdmin) {
                itsSaleMan = false;
            }
            else {
                itsSaleMan = true;
            }
        });
        var query = {};
        query["structureId"] = this.simulation.salesmanStructure.structureId;
        query["productId"] = this.calculation.financialTable.productId;
        query["vehicleType"] = this.simulation.car.vehicleType;
        query["financeType"] = this.calculation.financialType.financeTypeId;
        this.calculation.services = [];
        var services = this.appService.xSearchWithData("serviceService/questService", query);
        services.subscribe(function (data) {
            var serviceResponse = data.json();
            _this.serviceList = serviceResponse.listService;
            _this.serviceList.forEach(function (response) {
                if (response.required || response.selecetedDefault) {
                    response.checked = true;
                    _this.calculation.services.push(response);
                }
            });
        });
        return services;
    };
    CalculationComponent.prototype.servicesAndInsurance = function () {
        var _this = this;
        var dialogRef = this.dialog.open(servicesDialog_dialog_1.ServicesDialog, { height: '85%', width: '50%' });
        dialogRef.componentInstance.serviceList = this.serviceList;
        dialogRef.componentInstance.simulation = this.simulation;
        dialogRef.componentInstance.calculationID = this.calculationID;
        dialogRef.afterClosed().subscribe(function (result) {
            _this.calculation.services.length = 0;
            dialogRef.componentInstance.serviceList.forEach(function (exist) {
                if (exist.checked) {
                    _this.calculation.services.push(exist);
                }
            });
            _this.sunTotalAmount();
            _this.calculate();
            _this.calculation.serviceCotizador = dialogRef.componentInstance.serviceCotizador;
        });
    };
    CalculationComponent.prototype.contract = function () {
        //Mobile
        /**
         * Habilita a tela de visualização (no fluxo MOBILE), pelo qual,
         * apresenta os dados da Simulação Contratada.
         */
        this.simulation.reviewContractSimulation = true;
        //remove o selecionado das simulações
        for (var _i = 0, _a = this.simulation.calculations; _i < _a.length; _i++) {
            var calculation = _a[_i];
            calculation.selected = false;
        }
        this.simulation.calculationSelected = this.calculation;
        this.calculation.selected = true;
        this.simulation.showBtnSave = true;
    };
    CalculationComponent.prototype.calculate = function () {
        var _this = this;
        var varRepackage = null;
        if (this.isCDCFlex) {
            varRepackage = this.calculation.repackage.id;
        }
        var specialVehicleTypes = new Array();
        if (this.simulation.specialTypes) {
            for (var i = 0; i < this.simulation.specialTypes.length; i++) {
                specialVehicleTypes.push(this.simulation.specialTypes[i].id);
            }
        }
        var requestCalculate = {
            deposit: this.calculation.entranceValue,
            totalVehicleAmount: this.calculation.totalValue,
            repackageId: varRepackage,
            commissionId: this.calculation.commission.id,
            productId: this.calculation.financialTable.productId,
            saleTypeId: this.simulation.saleType.id,
            financeTypeId: this.calculation.financialType.financeTypeId,
            vehicleVersionId: this.simulation.car.version.id,
            personType: this.simulation.client.typePerson,
            term: this.calculation.term,
            delayValue: this.calculation.delay,
            province: this.simulation.client.address.province.id,
            tcExempt: this.simulation.tc,
            vehiclesSpecial: specialVehicleTypes,
            services: this.calculation.services
        };
        var newCalculate = this.appService.xSearchWithData('simulationCalc/calculate', requestCalculate);
        newCalculate.subscribe(function (data) {
            var response = data.json();
            _this.calculation.financedAmount = response.calculate.totalAmountFinanced;
            _this.calculation.coeficiente.coeffcientId = response.calculate.coeffcientId;
            _this.calculation.coeficiente.taxCoefficient = response.calculate.taxCoefficient;
            _this.calculation.entranceValue = response.calculate.deposit;
            _this.calculation.installments = response.calculate.listInstalment;
            _this.installmentsGroup = response.calculate.listInstalmentGroup;
            _this.entrancePerc = response.calculate.depositPercent;
            if (_this.calculation.selected) {
                _this.simulation.calculationSelected = _this.calculation;
            }
        }, function (err) {
            console.log(err.json());
        });
        this.settingEntrace = false;
    };
    //deprecated
    CalculationComponent.prototype.sunTotalAmountViaService = function () {
        var _this = this;
        var request = {
            vehicleAmount: this.simulation.car.version.price,
            services: this.calculation.services,
            options: this.simulation.car.version.options,
            acessories: this.simulation.car.version.acessories,
        };
        var depositCalculate = this.appService.xSearchWithData('simulationCalc/depositCalculate', request);
        depositCalculate.subscribe(function (data) {
            var response = data.json();
            _this.calculation.totalValue = response.totalAmount;
        }, function (err) {
            console.log(err.json());
        });
    };
    CalculationComponent.prototype.sunTotalAmount = function () {
        var _this = this;
        this.calculation.totalValue = this.simulation.car.version.price;
        if (this.simulation.car.version.options) {
            this.simulation.car.version.options.forEach(function (option) {
                _this.calculation.totalValue += option.amount;
            });
        }
        if (this.simulation.car.version.acessories) {
            this.simulation.car.version.acessories.forEach(function (acessory) {
                _this.calculation.totalValue += acessory.amount;
            });
        }
    };
    CalculationComponent.prototype.verifyShowEditDetailMobile = function () {
        if (!this.media.isActive('xs')) {
            return false;
        }
        if (this.simulation.editOneCalcMobile) {
            return false;
        }
        return true;
    };
    CalculationComponent.prototype.editCalculation = function () {
        this.simulation.editOneCalcMobile = true;
        this.showMobileEditDetail[this.calculationID] = true;
        this.simulation.detailSimulation = true;
    };
    CalculationComponent.prototype.compare = function () {
        this.simulation.editOneCalcMobile = false;
        this.showMobileEditDetail[this.calculationID] = false;
        this.simulation.detailSimulation = false;
    };
    CalculationComponent.prototype.disableFieldsByStatusDossier = function () {
        if (this.simulation.readOnly) {
            return true;
        }
        if (this.simulation.dossierStatus == 9) {
            return true;
        }
        return false;
    };
    CalculationComponent.prototype.setDefaultPercentage = function () {
        if (this.calculationID == "0" && this.calculation.financialTable.promotional && this.calculation.financialTable.listProductPromotional) {
            var promotional = null;
            for (var index = 0; index < this.calculation.financialTable.listProductPromotional.length; index++) {
                var element = this.calculation.financialTable.listProductPromotional[index];
                if (element.mainSource) {
                    promotional = element;
                }
            }
            if (promotional) {
                this.entrancePerc = promotional.depositPercent * 100;
                this.setEntranceValue();
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CalculationComponent.prototype, "calculationID", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], CalculationComponent.prototype, "removeCalculation", void 0);
    CalculationComponent = __decorate([
        core_1.Component({
            selector: 'calculation',
            templateUrl: 'app/simulation/calculationPainel/calculationDialog/calculation/calculation.component.html'
        }),
        __metadata("design:paramtypes", [app_service_1.AppService, app_message_1.AppMessage, material_1.MdDialog,
            flex_layout_1.ObservableMedia, simulation_service_1.SimulationService])
    ], CalculationComponent);
    return CalculationComponent;
}());
exports.CalculationComponent = CalculationComponent;
//# sourceMappingURL=calculation.component.js.map