import { Output, EventEmitter, HostListener, ViewChildren, QueryList } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SalesmanCommunicationComponent } from './salesman_communication/salesman_communication.component';
import { TranslateService } from './../translate/translate.service';
import { MdDialog, MdMenuTrigger } from '@angular/material';
import { AppService } from './../app.service';
import { AppComponent } from './../app.component';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../login/auth.service';
import { AppMessage } from './../app.message';
import { Router, NavigationExtras } from '@angular/router';

import { MyProfileComponent } from './profile/my_profile.dialog';
import { menuDTO } from "./menuDTO";



@Component({
    selector: 'app-menu',
    templateUrl: './app/menu/menu.component.html',

})
export class MenuComponent implements OnInit {
    // buidMsgCurrentUser: any;

    public brands: Array<string>;
    public click: number = 0;
    private theme: string;
    private msgCurrentUser: string;
    public mouseover: boolean = false;
    public items: Array<menuDTO> = Array<menuDTO>();
    public notificationHide: boolean;

    constructor(public app: AppComponent,
        public router: Router,
        public authService: AuthService,
        private appMessage: AppMessage,
        public appService: AppService,
        public dialog: MdDialog,
        private _translate: TranslateService) {

        this.notificationHide = false;

        this.brands = [this.app.BRAND_RENAULT, this.app.BRAND_NISSAN, this.app.BRAND_RCI];
        this.buidMsgCurrentUser();
    }
    @ViewChildren(MdMenuTrigger) triggers: QueryList<MdMenuTrigger>;

    teste(test) {
        console.log(test);
    }

    ngOnInit() {

        if (this.appService.hasRole('VIEW_SIMULATION')) {
            this.items.push(new menuDTO("queue", this._translate.translate('btn-new-simulation').toUpperCase(), "./simulation", undefined));
        }
        if (this.appService.hasRole('VIEW_MY_AGREEMENT')) {
            this.items.push(new menuDTO("library_books", this._translate.translate('btn-my-proposals').toUpperCase(), "./my_agreement", undefined));
        }
        if (this.appService.hasRole('ADMINISTRADOR')) {
            let menuAdm: Array<menuDTO> = Array<menuDTO>();

            if (this.appService.hasRole('VIEW_AVAILABLE')) {
                menuAdm.push(new menuDTO(undefined, this._translate.translate('btn-deactivation-of-services').toUpperCase(), "./available", undefined))
            }
            if (this.appService.hasRole('VIEW_MANDATORY')) {
                menuAdm.push(new menuDTO(undefined, this._translate.translate('btn-services-configuration-required').toUpperCase(), "./mandatory", undefined));
            }
            if (this.appService.hasRole('VIEW_DEALER_PROPOSAL')) {
                menuAdm.push(new menuDTO(undefined, this._translate.translate('btn-dealer-proposal').toUpperCase(), "./dealer_proposal", undefined));
            }
            if (this.appService.hasRole('VIEW_COMMISSION_LEVEL')) {
                menuAdm.push(new menuDTO(undefined, this._translate.translate('btn-commission-level').toUpperCase(), "./commission_level", undefined));
            }
            if (this.appService.hasRole('VIEW_SUBMISSAO')) {
                menuAdm.push(new menuDTO(undefined, this._translate.translate('btn-submission-process-configuration').toUpperCase(), "./submissao", undefined));
            }
            if (this.appService.hasRole('VIEW_NEWS_ADMIN')) {
                menuAdm.push(new menuDTO(undefined, this._translate.translate('btn-news-administration').toUpperCase(), "./news_admin", undefined));
            }
            if (this.appService.hasRole('VIEW_PROMOTIONAL_IMAGES')) {
                menuAdm.push(new menuDTO(undefined, this._translate.translate('btn-promotional-images').toUpperCase(), "./promotional_images", undefined));
            }
            if (this.appService.hasRole('VIEW_MODEL')) {
                menuAdm.push(new menuDTO(undefined, this._translate.translate('btn-models').toUpperCase(), "./model", undefined));
            }

            this.items.push(new menuDTO("settings", this._translate.translate('btn-administration').toUpperCase(), undefined, menuAdm));
        }
        if (this.appService.hasRole('ANALISTA_CREDITO') || this.appService.hasRole('CORRETOR')) {
            let menuInsurance: Array<menuDTO> = Array<menuDTO>();


            let subMenu: Array<menuDTO> = Array<menuDTO>();

            if (this.appService.hasRole('VIEW_SELL_ON_SIGHT')) {
                subMenu.push(new menuDTO(undefined, this._translate.translate('lb-selling-on-sight').toUpperCase(), "./insurance_sell", undefined));
            }
            if (this.appService.hasRole('VIEW_INSURANCE_REPORTS_SOLD')) {
                subMenu.push(new menuDTO(undefined, this._translate.translate('lb-sales-report').toUpperCase(), "./insurance_sold", undefined));
            }
            if (this.appService.hasRole('VIEW_DENIED_INSURANCE_REPORT')) {
                subMenu.push(new menuDTO(undefined, this._translate.translate('lb-denied-insurance-report').toUpperCase(), "./insurance_denied", undefined));
            }


            menuInsurance.push(new menuDTO(undefined, this._translate.translate('btn-auto-insurance').toUpperCase(), undefined, subMenu));
            this.items.push(new menuDTO("directions_car", this._translate.translate('btn-insurance').toUpperCase(), undefined, menuInsurance));
           
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
    }

    openMenu(trigger: MdMenuTrigger, level: number) {
        this.triggers
            .filter((x: any) => x._element.nativeElement.dataset.level >= level && x !== trigger)
            .forEach(x => x.closeMenu());
        trigger.openMenu();
    }

    closeMenu() {
        this.triggers.forEach(x => x.closeMenu());
    }

    buidMsgCurrentUser() {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser) {
            let welcome = this._translate.instant('lb-welcome');
            this.msgCurrentUser = welcome + ' <b>' + currentUser['name'] + '</b>';
        }
    }

    @HostListener('mouseenter')
    onMouseOver() {
        this.mouseover = true;
    }

    @HostListener('mouseleave')
    onMouseOut() {
        this.mouseover = false;
    }

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


    dialogPerfil() {
        let dialogRef = this.dialog.open(MyProfileComponent, { width: '50%' });
    }

    notificationClick() {
        this.notificationHide = !this.notificationHide;
    }

}