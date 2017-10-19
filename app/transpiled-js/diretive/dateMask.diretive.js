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
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var app_message_1 = require("../app.message");
var dateMaskDirective = /** @class */ (function () {
    function dateMaskDirective(model, appMessage) {
        this.model = model;
        this.appMessage = appMessage;
        this.valid = true;
    }
    dateMaskDirective_1 = dateMaskDirective;
    dateMaskDirective.prototype.writeValue = function (value) {
    };
    dateMaskDirective.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    dateMaskDirective.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    dateMaskDirective.prototype.onKeyup = function ($event) {
        // retorna caso pressionado backspace
        if ($event.keyCode === 8) {
            //console.log("apagando..")
        }
        else {
            var valor = $event.currentTarget.value.replace(/\D/g, '');
            var pad = this.kzMask.replace(/\D/g, '').replace(/9/g, '_');
            var valorMask = valor + pad.substring(0, pad.length - valor.length);
            if (valor.length > 5) {
                this.validateDate(valor);
            }
            if (valor.length <= pad.length) {
                //this.onChange(valor);
            }
            var valorMaskPos = 0;
            valor = '';
            for (var i = 0; i < this.kzMask.length; i++) {
                if (isNaN(parseInt(this.kzMask.charAt(i)))) {
                    valor += this.kzMask.charAt(i);
                }
                else {
                    valor += valorMask[valorMaskPos++];
                }
            }
            if (valor.indexOf('_') > -1) {
                valor = valor.substr(0, valor.indexOf('_'));
            }
            $event.currentTarget.value = valor;
        }
    };
    dateMaskDirective.prototype.onBlur = function ($event) {
        if (!this.valid) {
            this.appMessage.showError("Data inválida");
            var parent_1 = $event.currentTarget.closest('md-input-container');
            parent_1.className = parent_1.className.replace(" fieldInvalid", "");
            parent_1.className += " fieldInvalid";
        }
        this.valid = true;
        // this.valid = this.valid;
        if ($event.currentTarget.value.length === this.kzMask.length) {
            return;
        }
        $event.currentTarget.value = '';
    };
    dateMaskDirective.prototype.validateDate = function (pObj) {
        var aRet = true;
        if ((pObj) && (pObj != '')) {
            var dia = pObj.substring(0, 2);
            var mes = pObj.substring(2, 4);
            var ano = pObj.substring(6, 9);
            if ((mes === '04' || mes === '06' || mes === '09' || mes === '11') && dia > '30') {
                aRet = false;
                this.valid = false;
            }
            else if ((mes === '01' || mes === '03' || mes === '05' || mes === '07' || mes === '08'
                || mes === '10' || mes === '12') && dia > '31') {
                aRet = false;
                this.valid = false;
            }
            else if (mes === '02' && dia > '28') {
                aRet = false;
                this.valid = false;
            }
            else if (mes > 12) {
                aRet = false;
                this.valid = false;
            }
            return aRet;
        }
    };
    __decorate([
        core_1.Input('dateMask'),
        __metadata("design:type", String)
    ], dateMaskDirective.prototype, "kzMask", void 0);
    __decorate([
        core_1.Input('valid'),
        __metadata("design:type", Object)
    ], dateMaskDirective.prototype, "valid", void 0);
    __decorate([
        core_1.HostListener('keyup', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], dateMaskDirective.prototype, "onKeyup", null);
    __decorate([
        core_1.HostListener('blur', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], dateMaskDirective.prototype, "onBlur", null);
    dateMaskDirective = dateMaskDirective_1 = __decorate([
        core_1.Directive({
            selector: '[dateMask]',
            providers: [{
                    provide: [],
                    useExisting: dateMaskDirective_1,
                    multi: true
                }]
        }),
        __metadata("design:paramtypes", [forms_1.NgModel, app_message_1.AppMessage])
    ], dateMaskDirective);
    return dateMaskDirective;
    var dateMaskDirective_1;
}());
exports.dateMaskDirective = dateMaskDirective;
//# sourceMappingURL=dateMask.diretive.js.map