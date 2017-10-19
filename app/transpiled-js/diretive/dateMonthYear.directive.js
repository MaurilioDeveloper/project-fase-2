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
var app_message_1 = require("./../app.message");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var DateMonthYear = /** @class */ (function () {
    function DateMonthYear(model, appMessage) {
        var _this = this;
        this.model = model;
        this.appMessage = appMessage;
        this.model.control.valueChanges.subscribe(function (data) {
            if (!data) {
                data = "";
            }
            else {
                if (data instanceof Date) {
                    var month = data.getMonth() + 1;
                    if (data.getMonth() != undefined && !isNaN(month)) {
                        var newMonth = void 0;
                        if (month < 10) {
                            newMonth = "0" + month;
                            month = newMonth;
                        }
                        var year = data.getFullYear();
                        data = month + "/" + year;
                    }
                    else {
                        data = "";
                    }
                }
                else {
                    var lengthh = Math.log(data) * Math.LOG10E + 1 | 0;
                    if (lengthh > 10) {
                        data = new Date(parseInt(data));
                        var month = data.getMonth() + 1;
                        var newMonth = void 0;
                        if (month < 10) {
                            newMonth = "0" + month;
                            month = newMonth;
                        }
                        var year = data.getFullYear();
                        data = month + "/" + year;
                    }
                }
            }
            _this.model.valueAccessor.writeValue(data);
            var dateToModel = new Date("01" + "/" + data);
            _this.model.viewToModelUpdate(dateToModel);
            _this.model.model = dateToModel;
        });
    }
    DateMonthYear.prototype.onKeyup = function ($event) {
        var data = $event.target.value;
        if ($event.keyCode === 8) {
            this.keycode = true;
        }
        else {
            if (!data) {
                return;
            }
            var valorMask = "";
            if (data.length == 1) {
                var valor_1 = parseInt(data);
                if (valor_1 > 1) {
                    this.model.valueAccessor.writeValue("");
                    this.valid = false;
                    return;
                }
            }
            if (data.length == 2) {
                var valor_2 = parseInt(data);
                var fistValue = data.substr(0, 1);
                var secondValue = data.substr(1, 2);
                if (secondValue > 2 && fistValue == 1) {
                    this.model.valueAccessor.writeValue(fistValue);
                    this.valid = false;
                    return;
                }
                valorMask = data.substr(0, 2) + '/';
                data = valorMask;
            }
            if (data.length == 4) {
                var valor_3 = data.substr(3, 4);
                if (valor_3 < 1 || valor_3 > 2) {
                    this.model.valueAccessor.writeValue(data.substr(0, 3));
                    this.valid = false;
                    return;
                }
            }
            if (data instanceof Date) {
                var month = data.getMonth() + 1;
                var newMonth = void 0;
                if (month < 10) {
                    newMonth = "0" + month;
                }
                month = newMonth;
                var year = data.getFullYear();
                data = month + "/" + year;
            }
            if (data.length == 6 && data.indexOf('/') == -1) {
                data = data.substr(0, 2) + "/" + data.substr(2, 6);
            }
            if (data.length >= 7) {
                data = data.substr(0, 7);
                this.valid = true;
            }
            var valor = data.replace(/\D/g, '');
            this.model.valueAccessor.writeValue(data);
            this.model.viewToModelUpdate(valor);
            this.model.model = valor;
        }
    };
    DateMonthYear.prototype.onKeypress = function ($event) {
        var data = $event.target.value;
        if ($event.keyCode === 8) {
            this.keycode = true;
        }
        else {
            if (!data) {
                return;
            }
            var valorMask = "";
            console.log(this.model);
            if (data.length == 1) {
                var valor_4 = parseInt(data);
                if (valor_4 > 1) {
                    this.model.valueAccessor.writeValue("");
                    this.valid = false;
                    return;
                }
            }
            if (data.length == 2) {
                var valor_5 = parseInt(data);
                var fistValue = data.substr(0, 1);
                var secondValue = data.substr(1, 2);
                if (secondValue > 2 && fistValue == 1) {
                    this.model.valueAccessor.writeValue(fistValue);
                    this.valid = false;
                    return;
                }
                valorMask = data.substr(0, 2) + '/';
                data = valorMask;
            }
            if (data.length == 4) {
                var valor_6 = data.substr(3, 4);
                if (valor_6 < 1 || valor_6 > 2) {
                    this.model.valueAccessor.writeValue(data.substr(0, 3));
                    this.valid = false;
                    return;
                }
            }
            if (data instanceof Date) {
                var month = data.getMonth() + 1;
                var newMonth = void 0;
                if (month < 10) {
                    newMonth = "0" + month;
                }
                month = newMonth;
                var year = data.getFullYear();
                data = month + "/" + year;
            }
            if (data.length == 6 && data.indexOf('/') == -1) {
                data = data.substr(0, 2) + "/" + data.substr(2, 6);
            }
            if (data.length >= 7) {
                data = data.substr(0, 7);
                this.valid = true;
            }
            var valor = data.replace(/\D/g, '');
            this.model.valueAccessor.writeValue(data);
            this.model.viewToModelUpdate(valor);
            this.model.model = valor;
        }
    };
    DateMonthYear.prototype.onBlur = function ($event) {
        if (!this.valid) {
            this.appMessage.showError("Campo inválido");
        }
        this.valid = this.valid;
        var parent = $event.srcElement.closest('md-input-container');
        parent.className = parent.className.replace(" fieldInvalid", "");
        if (!this.valid) {
            parent.className += " fieldInvalid";
        }
    };
    __decorate([
        core_1.Input('valid'),
        __metadata("design:type", Object)
    ], DateMonthYear.prototype, "valid", void 0);
    __decorate([
        core_1.HostListener('keyup', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], DateMonthYear.prototype, "onKeyup", null);
    __decorate([
        core_1.HostListener('keypress', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], DateMonthYear.prototype, "onKeypress", null);
    DateMonthYear = __decorate([
        core_1.Directive({
            selector: '[monthyear]',
            host: {
                '(blur)': 'onBlur($event)',
                '(keyup)': 'onKeyup($event)',
                '(keypress)': 'onKeypress($event)'
            }
        }),
        __metadata("design:paramtypes", [forms_1.NgModel, app_message_1.AppMessage])
    ], DateMonthYear);
    return DateMonthYear;
}());
exports.DateMonthYear = DateMonthYear;
//# sourceMappingURL=dateMonthYear.directive.js.map