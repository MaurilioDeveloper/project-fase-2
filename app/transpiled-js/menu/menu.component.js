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
var translate_service_1 = require("./../translate/translate.service");
var material_1 = require("@angular/material");
var app_service_1 = require("./../app.service");
var app_component_1 = require("./../app.component");
var core_2 = require("@angular/core");
var auth_service_1 = require("./../login/auth.service");
var app_message_1 = require("./../app.message");
var router_1 = require("@angular/router");
var my_profile_dialog_1 = require("./profile/my_profile.dialog");
var menuDTO_1 = require("./menuDTO");
var MenuComponent = /** @class */ (function () {
    function MenuComponent(app, router, authService, appMessage, appService, dialog, _translate) {
        this.app = app;
        this.router = router;
        this.authService = authService;
        this.appMessage = appMessage;
        this.appService = appService;
        this.dialog = dialog;
        this._translate = _translate;
        this.click = 0;
        this.mouseover = false;
        this.items = Array();
        this.notificationHide = false;
        this.brands = [this.app.BRAND_RENAULT, this.app.BRAND_NISSAN, this.app.BRAND_RCI];
        this.buidMsgCurrentUser();
    }
    MenuComponent.prototype.teste = function (test) {
        console.log(test);
    };
    MenuComponent.prototype.ngOnInit = function () {
        if (this.appService.hasRole('VIEW_SIMULATION')) {
            this.items.push(new menuDTO_1.menuDTO("queue", this._translate.translate('btn-new-simulation').toUpperCase(), "./simulation", undefined));
        }
        if (this.appService.hasRole('VIEW_MY_AGREEMENT')) {
            this.items.push(new menuDTO_1.menuDTO("library_books", this._translate.translate('btn-my-proposals').toUpperCase(), "./my_agreement", undefined));
        }
        if (this.appService.hasRole('ADMINISTRADOR')) {
            var menuAdm = Array();
            if (this.appService.hasRole('VIEW_AVAILABLE')) {
                menuAdm.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('btn-deactivation-of-services').toUpperCase(), "./available", undefined));
            }
            if (this.appService.hasRole('VIEW_MANDATORY')) {
                menuAdm.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('btn-services-configuration-required').toUpperCase(), "./mandatory", undefined));
            }
            if (this.appService.hasRole('VIEW_DEALER_PROPOSAL')) {
                menuAdm.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('btn-dealer-proposal').toUpperCase(), "./dealer_proposal", undefined));
            }
            if (this.appService.hasRole('VIEW_COMMISSION_LEVEL')) {
                menuAdm.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('btn-commission-level').toUpperCase(), "./commission_level", undefined));
            }
            if (this.appService.hasRole('VIEW_SUBMISSAO')) {
                menuAdm.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('btn-submission-process-configuration').toUpperCase(), "./submissao", undefined));
            }
            if (this.appService.hasRole('VIEW_NEWS_ADMIN')) {
                menuAdm.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('btn-news-administration').toUpperCase(), "./news_admin", undefined));
            }
            if (this.appService.hasRole('VIEW_PROMOTIONAL_IMAGES')) {
                menuAdm.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('btn-promotional-images').toUpperCase(), "./promotional_images", undefined));
            }
            if (this.appService.hasRole('VIEW_MODEL')) {
                menuAdm.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('btn-models').toUpperCase(), "./model", undefined));
            }
            this.items.push(new menuDTO_1.menuDTO("settings", this._translate.translate('btn-administration').toUpperCase(), undefined, menuAdm));
        }
        if (this.appService.hasRole('ANALISTA_CREDITO') || this.appService.hasRole('CORRETOR')) {
            var menuInsurance = Array();
            var subMenu = Array();
            if (this.appService.hasRole('VIEW_SELL_ON_SIGHT')) {
                subMenu.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('lb-selling-on-sight').toUpperCase(), "./insurance_sell", undefined));
            }
            if (this.appService.hasRole('VIEW_INSURANCE_REPORTS_SOLD')) {
                subMenu.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('lb-sales-report').toUpperCase(), "./insurance_sold", undefined));
            }
            if (this.appService.hasRole('VIEW_DENIED_INSURANCE_REPORT')) {
                subMenu.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('lb-denied-insurance-report').toUpperCase(), "./insurance_denied", undefined));
            }
            menuInsurance.push(new menuDTO_1.menuDTO(undefined, this._translate.translate('btn-auto-insurance').toUpperCase(), undefined, subMenu));
            this.items.push(new menuDTO_1.menuDTO("directions_car", this._translate.translate('btn-insurance').toUpperCase(), undefined, menuInsurance));
        }
        /*       )
       
       
           items = [
       
               {
                   icon: 'queue',
                   text: 'NOVA SIMULAÇÃO',
                   route: './simulation',
               
               },
               {
                   icon: 'library_books',
                   text: 'MINHAS PROPOSTAS',
                   route: './simulation',
               },
               {
                   icon: 'directions_car',
                   text: 'SEGURO',
                   items:
                       [
                           {
                               iconseta: 'arrow_right',
                               text: 'Seguro-auto',
                               items: [{
                                           text: 'Venda à Vista',
                                           route: './insurance_sell'
                                       },
                                       {
                                           text: 'Relatório de Vendas',
                                           route: './insurance_sold'
                                       },
                                       {
                                           text: 'Relatório de Seguros Negados',
                                           route: './insurance_denied'
                                       }
                                   ],
                           }
                       ]
               },
               {
                   icon: 'settings',
                   text: 'ADMINISTRAÇÃO',
                   items:
                   [
                       {
                           text: 'DESATIVAÇÃO DOS SERVIÇOS',
                           route: './available',
                       },
                       {
                           text: 'CONFIGURAÇÃO DE SERVIÇOS OBRIGATÓRIOS',
                           route: './mandatory',
                       },
                       {
                           text: 'PROPOSTA COM ALTERAÇÃO DE CONCESSIONÁRIA',
                           route: './dealer_proposal',
                       },
       
       
       
       
       
                   ]
       
       
       
               }
               
       
       
       
       
       
           ];*/
    };
    MenuComponent.prototype.openMenu = function (trigger, level) {
        this.triggers
            .filter(function (x) { return x._element.nativeElement.dataset.level >= level && x !== trigger; })
            .forEach(function (x) { return x.closeMenu(); });
        trigger.openMenu();
    };
    MenuComponent.prototype.closeMenu = function () {
        this.triggers.forEach(function (x) { return x.closeMenu(); });
    };
    MenuComponent.prototype.buidMsgCurrentUser = function () {
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser) {
            var welcome = this._translate.instant('lb-welcome');
            this.msgCurrentUser = welcome + ' <b>' + currentUser['name'] + '</b>';
        }
    };
    MenuComponent.prototype.onMouseOver = function () {
        this.mouseover = true;
    };
    MenuComponent.prototype.onMouseOut = function () {
        this.mouseover = false;
    };
    /* mudaTheme(event) {
         let item = {};
         switch (this.click) {
             case 0:
                 this.click = 2;
                 item["value"] = this.app.BRAND_RENAULT
                 console.log(item)
                 this.app.changeTheme(item);
                 break;
             case 1:
                 this.click = 0;
                 item["value"] = this.app.BRAND_NISSAN
                 this.app.changeTheme(item);
                 break;
             case 2:
                 this.click = 1;
                 item["value"] = this.app.BRAND_RCI
                 this.app.changeTheme(item);
                 break;
         }
     }*/
    MenuComponent.prototype.dialogPerfil = function () {
        var dialogRef = this.dialog.open(my_profile_dialog_1.MyProfileComponent, { width: '50%' });
    };
    MenuComponent.prototype.notificationClick = function () {
        this.notificationHide = !this.notificationHide;
    };
    __decorate([
        core_1.ViewChildren(material_1.MdMenuTrigger),
        __metadata("design:type", core_1.QueryList)
    ], MenuComponent.prototype, "triggers", void 0);
    __decorate([
        core_1.HostListener('mouseenter'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MenuComponent.prototype, "onMouseOver", null);
    __decorate([
        core_1.HostListener('mouseleave'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MenuComponent.prototype, "onMouseOut", null);
    MenuComponent = __decorate([
        core_2.Component({
            selector: 'app-menu',
            templateUrl: './app/menu/menu.component.html',
        }),
        __metadata("design:paramtypes", [app_component_1.AppComponent,
            router_1.Router,
            auth_service_1.AuthService,
            app_message_1.AppMessage,
            app_service_1.AppService,
            material_1.MdDialog,
            translate_service_1.TranslateService])
    ], MenuComponent);
    return MenuComponent;
}());
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map