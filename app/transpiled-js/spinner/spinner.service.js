"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var core_1 = require("@angular/core");
var SpinnerService = /** @class */ (function () {
    function SpinnerService() {
        /*
            private notify = new Subject<any>();
            notifyObservable = this.notify.asObservable();
        */
        this.queueService = new Array();
        this.status = new BehaviorSubject_1.BehaviorSubject(false);
    }
    SpinnerService.prototype.display = function (show) {
        //this.notify.next(show);
        var _this = this;
        if (show) {
            this.queueService.push(show);
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
    SpinnerService = __decorate([
        core_1.Injectable()
    ], SpinnerService);
    return SpinnerService;
}());
exports.SpinnerService = SpinnerService;
//# sourceMappingURL=spinner.service.js.map