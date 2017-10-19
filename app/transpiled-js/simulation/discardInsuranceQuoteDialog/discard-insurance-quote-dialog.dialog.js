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
var core_1 = require("@angular/core");
var DiscardInsuranceQuoteDialog = /** @class */ (function () {
    function DiscardInsuranceQuoteDialog(dialogRef) {
        this.dialogRef = dialogRef;
        this.response = false;
    }
    DiscardInsuranceQuoteDialog.prototype.ngOnInit = function () {
    };
    DiscardInsuranceQuoteDialog.prototype.confirm = function (result) {
        this.response = result;
        this.dialogRef.close();
    };
    DiscardInsuranceQuoteDialog = __decorate([
        core_1.Component({
            selector: 'discard-insurance-quote-dialog',
            templateUrl: 'app/simulation/discardInsuranceQuoteDialog/discard-insurance-quote-dialog.dialog.html'
        }),
        __metadata("design:paramtypes", [material_1.MdDialogRef])
    ], DiscardInsuranceQuoteDialog);
    return DiscardInsuranceQuoteDialog;
}());
exports.DiscardInsuranceQuoteDialog = DiscardInsuranceQuoteDialog;
//# sourceMappingURL=discard-insurance-quote-dialog.dialog.js.map