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
var app_service_1 = require("./../../../../../app.service");
var core_1 = require("@angular/core");
var DegreeKinshipDialog = /** @class */ (function () {
    function DegreeKinshipDialog(appService, dialogRef) {
        this.appService = appService;
        this.dialogRef = dialogRef;
        this.confirm = false;
    }
    DegreeKinshipDialog.prototype.ngOnInit = function () {
    };
    DegreeKinshipDialog.prototype.associateSpouse = function (result) {
        this.confirm = result;
        this.dialogRef.close();
    };
    DegreeKinshipDialog = __decorate([
        core_1.Component({
            selector: 'degree-Kinship-Dialog',
            templateUrl: 'app/simulation/customer_card/filds_customer_card/guarantor_1_client_cc/degreeKinshipDialog/degreeKinshipDialog.dialog.html'
        }),
        __metadata("design:paramtypes", [app_service_1.AppService, material_1.MdDialogRef])
    ], DegreeKinshipDialog);
    return DegreeKinshipDialog;
}());
exports.DegreeKinshipDialog = DegreeKinshipDialog;
//# sourceMappingURL=degreeKinshipDialog.dialog.js.map