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
var document_service_1 = require("./service/document.service");
var app_message_1 = require("./../../app.message");
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var core_3 = require("@angular/core");
var app_service_1 = require("./../../app.service");
var DocumentComponent = /** @class */ (function () {
    function DocumentComponent(documentService, appService, appMessage) {
        this.documentService = documentService;
        this.appService = appService;
        this.appMessage = appMessage;
        this.changeStep = new core_1.EventEmitter();
    }
    DocumentComponent.prototype.ngOnInit = function () {
        this.documentService.init();
    };
    DocumentComponent.prototype.getSimulation = function () {
        return this.documentService.simulation;
    };
    DocumentComponent.prototype.getListDocuments = function () {
        return this.documentService.listDocuments;
    };
    DocumentComponent.prototype.downloadDoc = function (doc) {
        var _this = this;
        var documentCall;
        if (doc.idDoc == 1) {
            this.downloadDocFromSantander(doc, "CET");
            return;
        }
        else if (doc.idDoc == 2) {
            this.downloadDocFromSantander(doc, "CCB");
            return;
        }
        else if (doc.idDoc == 3) {
            this.downloadDocFromSantander(doc, "APROVACAO");
            return;
        }
        else if (doc.idDoc == 4) {
            this.downloadDocFromS3(doc, "CCB_CLAUSULAS");
            return;
        }
        else if (doc.idDoc == 5) {
            documentCall = this.appService.xFileDownload("documentationService", "printSPF/" + this.getSimulation().id + "/", "SPF", "pdf");
        }
        else if (doc.idDoc == 6) {
            documentCall = this.appService.xFileDownload("documentationService", "printGAP/" + this.getSimulation().id + "/", "GAP", "pdf");
        }
        else if (doc.idDoc == 7) {
            this.downloadDocFromS3(doc, "CTRL");
            return;
        }
        else if (doc.idDoc == 8) {
            this.downloadDocFromS3(doc, "CC");
            return;
        }
        else if (doc.idDoc == 9) {
            this.downloadDocFromS3(doc, "VISTORIA");
            return;
        }
        else if (doc.idDoc == 10) {
            documentCall = this.appService.xFileDownload("documentationService", "printDocFromNimble/" + this.getSimulation().calculationSelected.id + "/", "COTACAO", "pdf");
        }
        documentCall.subscribe(function (data) {
            _this.appMessage.showSuccess("msg-doc-generated");
        }, function (err) {
            console.log(err.json());
        });
    };
    DocumentComponent.prototype.downloadDocFromS3 = function (doc, docName) {
        var _this = this;
        var documentCall = this.appService.xFileDownload("documentationService", "printFileFromS3/" + doc.link + "/", docName, "pdf");
        documentCall.subscribe(function (data) {
            _this.appMessage.showSuccess("msg-doc-generated");
        }, function (err) {
            console.log(err.json());
        });
    };
    DocumentComponent.prototype.downloadDocFromSantander = function (doc, docName) {
        var _this = this;
        var documentCall = this.appService.xFileDownload("documentationService", "printDocsFromSantander/" + this.getSimulation().id + "/" + 1 + "/", docName, "pdf");
        documentCall.subscribe(function (data) {
            _this.appMessage.showSuccess("msg-doc-generated");
        }, function (err) {
            console.log(err.json());
        });
    };
    DocumentComponent.prototype.sendEmail = function (doc) {
        var _this = this;
        var email;
        if (doc.idDoc == 1) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + 1 + "/" + null + "/" + 1 + "/");
        }
        else if (doc.idDoc == 2) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + 2 + "/" + null + "/" + 2 + "/");
        }
        else if (doc.idDoc == 3) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + 5 + "/" + null + "/" + 3 + "/");
        }
        else if (doc.idDoc == 4) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + doc.link + "/" + 4 + "/");
        }
        else if (doc.idDoc == 5) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + null + "/" + 5 + "/");
        }
        else if (doc.idDoc == 6) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + null + "/" + 6 + "/");
        }
        else if (doc.idDoc == 7) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + doc.link + "/" + 7 + "/");
        }
        else if (doc.idDoc == 8) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + doc.link + "/" + 8 + "/");
        }
        else if (doc.idDoc == 9) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + doc.link + "/" + 9 + "/");
        }
        email.subscribe(function (data) {
            _this.appMessage.showSuccess("msg-send-mail-success");
        }, function (err) {
            console.log(err.json());
        });
    };
    DocumentComponent.prototype.voltar = function () {
        this.changeStep.emit(false);
    };
    __decorate([
        core_2.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], DocumentComponent.prototype, "changeStep", void 0);
    DocumentComponent = __decorate([
        core_3.Component({
            selector: 'doc-simulation',
            templateUrl: './app/simulation/document/document.component.html',
            styleUrls: ['app/simulation/document/document.component.css'],
            providers: [document_service_1.DocumentService]
        }),
        __metadata("design:paramtypes", [document_service_1.DocumentService, app_service_1.AppService, app_message_1.AppMessage])
    ], DocumentComponent);
    return DocumentComponent;
}());
exports.DocumentComponent = DocumentComponent;
//# sourceMappingURL=document.component.js.map