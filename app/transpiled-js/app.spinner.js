"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var LoaderService = /** @class */ (function () {
    function LoaderService() {
        this.status = new BehaviorSubject_1.BehaviorSubject(false);
        this.queueService = new Array();
    }
    LoaderService.prototype.display = function (value) {
        var _this = this;
        if (value) {
            this.queueService.push(value);
            if (!this.opened) {
                this.status.next(true);
                this.opened = true;
            }
        }
        else {
            this.queueService.splice(this.queueService.length - 1);
            setTimeout(function () {
                if (_this.queueService.length < 1 && _this.opened) {
                    _this.status.next(false);
                    _this.opened = false;
                }
            }, 2000);
        }
    };
    LoaderService = __decorate([
        core_1.Injectable()
    ], LoaderService);
    return LoaderService;
}());
exports.LoaderService = LoaderService;
//# sourceMappingURL=app.spinner.js.map