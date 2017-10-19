import { MdDialog } from '@angular/material';
import { QuotationDialog } from './../simulation/card_client/dialogQuotation/dialogQuotation.dialog';
import { Historic } from './../simulation/dto/client/Historic.dto';
import { SimulationService } from './../simulation/simulation.service';
import { Simulation } from './../simulation/dto/Simulation.dto';
import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { AppService } from './../app.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { StepEnum } from './../simulation/step.enum';
import { DiscardInsuranceQuoteDialog } from './../simulation/discardInsuranceQuoteDialog/discard-insurance-quote-dialog.dialog';
import { NewOnesService } from "./../simulation/new_ones/service/new-ones.service";

@Component({
  selector: 'stepper',
  templateUrl: './app/stepper/stepper.component.html',
  providers: [NewOnesService]
})


export class StepperComponent implements OnChanges {

  @Input() steep: number;
  simulation: Simulation;

  @Output() changeStep: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() private save : EventEmitter<any> = new EventEmitter<any>();

  count: number;


  leftIcon: String;
  leftText: String;
  rightIcon: String;
  rightText: String;
  stepFour: String;
  canNext: boolean;
  // @ViewChild('buttonChoiseVehicle') formClient;
  enabledNextStep: boolean;
  stepOne: any;
  browser: string;
  private segAuto: boolean = false;


  constructor(private simulationService: SimulationService, public dialog: MdDialog, private newOnesService: NewOnesService) {
  };

  ngOnInit() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      this.browser = "IE";
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      this.browser = "IE";
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      this.browser = "IE";
    }

    this.simulationService.load.subscribe((simulation: Simulation) => {
      this.simulation = simulation;
      if (this.simulation) {
        this.onload();
      }
    });

  }

  private onload() {
  }

  getStep() {
    return StepEnum;
  }

  change(toFront: boolean) {
    //this.segAuto = true;
    //Verifica se tem algum serviço "Cotizador" contratado. 
    if (this.simulation.calculationSelected.selected) {
      if (this.simulation.calculationSelected.serviceCotizador) {
        this.segAuto = true;
      }
    }

    if (!this.segAuto) {
      this.saveInfo();
      this.changeStep.emit(toFront);
    } else {
      if (this.verifyChange() && this.simulation.step == 0) {
        this.quotationDialog();
      /*} else if (this.verifyChangesVehicle() && this.simulation.step == StepEnum.STEP_VEHICLE && toFront) {
        this.openDiscardInsuranceQuoteDialog();*/
      } else {
        this.changeStep.emit(toFront);
      }
    }

    //this.saveInitialValues();
  }

// -----

openDiscardInsuranceQuoteDialog() {
  let dialogRef = this.dialog.open(DiscardInsuranceQuoteDialog, { width: '50%' });
  dialogRef.disableClose = true;
  dialogRef.afterClosed().subscribe(result => {
      this.simulation.calculations
      if (dialogRef.componentInstance.response) {
          if (this.simulation.calculationSelected.services) {
              this.simulation.calculationSelected.services.forEach(service =>{
                  if(service.serviceTypeId === 30){
                      service.checked = false;
                  }
              });
          }
          this.changeStep.emit(true);
      } else {
          this.loadInitialValues();
          this.newOnesService.init();
          this.newOnesService.recalcT();
      }
  });
}

verifyChangesVehicle() : boolean {
  if (JSON.stringify(this.simulation.brand) != this.simulation.initialBrand) {
      return true;
  }
  if (JSON.stringify(this.simulation.car) != this.simulation.initialCar) {
      return true;
  }
  if (JSON.stringify(this.simulation.specialTypes) != this.simulation.initialSpecialTypes) {
      return true;
  }
  return false;
}

saveInitialValues() {
  console.log("saveInitialValues()");

  console.log(this.simulation.initialCar);

  this.simulation.initialBrand = JSON.stringify(this.simulation.brand);
  this.simulation.initialCar = JSON.stringify(this.simulation.car);
  this.simulation.initialSpecialTypes = JSON.stringify(this.simulation.specialTypes);
}

loadInitialValues() {
  this.simulation.brand = JSON.parse(this.simulation.initialBrand);
  this.simulation.car = JSON.parse(this.simulation.initialCar);
  this.simulation.specialTypes = JSON.parse(this.simulation.initialSpecialTypes);
}


// -----

  verifyChange() {

    if (this.segAuto) {
      if (this.simulation.client.aux.cpfCnpj != this.simulation.client.cpfCnpj) {
        return true;
      }
      if (this.simulation.client.aux.name != this.simulation.client.name) {
        return true;
      }
      if (this.simulation.client.aux.phone.number != this.simulation.client.phone.number) {
        return true;
      }
      if (this.simulation.client.aux.email != this.simulation.client.email) {
        return true;
      }
      if (this.simulation.client.aux.province != this.simulation.client.province) {
        return true;
      }
      if (this.simulation.client.aux.saleType != this.simulation.saleType) {
        return true;
      }
    }

  }


  quotationDialog() {
    let dialogRef = this.dialog.open(QuotationDialog, { width: '50%' });

    //Envia opção de pular steps para dialog
    dialogRef.componentInstance.changeStep = this.changeStep;
  }


  saveInfo() {

    this.simulation.client.aux = new Historic();
    this.simulation.client.aux.cpfCnpj = this.simulation.client.cpfCnpj;
    this.simulation.client.aux.name = this.simulation.client.name;
    this.simulation.client.aux.email = this.simulation.client.email;
    this.simulation.client.aux.phone.number = this.simulation.client.phone.number;
    this.simulation.client.aux.province = this.simulation.client.province;
    this.simulation.client.aux.saleType = this.simulation.saleType;


  }


  ngOnChanges(changes: SimpleChanges) {
    switch (this.steep) {
      case StepEnum.STEP_CLIENT:
        this.rightIcon = 'directions_car';
        this.rightText = 'Editar <br>Veiculo';
        this.stepFour = 'stepNo';
        this.stepOne = document.body.getElementsByTagName('app-root')[0].getElementsByTagName('div')[0].getElementsByClassName("ng-invalid");
        // this.stepOne = document.body.getElementsByTagName('app-root')[0].getElementsByTagName('div')[0].getElementsByTagName('form');
        // this.stepOne = document.body.getElementsByTagName('app-root')[0].getElementsByTagName('div')[0].getElementsByTagName('form');
        // console.log(this.formClient);


        // this.stepOne = document.body.getElementsByTagName('app-root')[0].getElementsByTagName('div')[0].getElementsByClassName("ng-invalid")[0];
        if (this.stepOne.length > StepEnum.STEP_CLIENT) {
          this.enabledNextStep = true;
        } else {
          this.enabledNextStep = false;
        }
        // this.stepOne = this.formClient.nativeElement.parentElement.parentElement.get("#formClient");
        // console.log(this.stepOne);
        // let stepOne = document.getElementById("formClient").getElementsByTagName("div")[0].getElementsByClassName("ng-invalid")[0];
        // console.log(stepOne);

        break;
      case StepEnum.STEP_VEHICLE:
        this.leftIcon = 'person';
        this.leftText = 'Editar <br>Cliente';
        this.rightIcon = 'keyboard';
        this.rightText = 'Editar <br>Simulação';
        this.stepFour = 'stepNo';
        this.canNext = this.simulation.step2CanNext;

        break;
      case StepEnum.STEP_SIMULATION:
        this.leftIcon = 'directions_car';
        this.leftText = 'Editar <br>Veiculo';
        this.rightIcon = 'recent_actors';
        this.rightText = 'Ficha do  <br>Cliente';
        this.stepFour = 'stepNo';
        this.canNext = this.simulation.step3CanNext;
        break;
      case StepEnum.STEP_CUSTOMER_CARD:
        this.leftIcon = 'keyboard';
        this.leftText = 'Editar <br>Simulação';
        this.rightIcon = 'near_me';
        this.rightText = 'Enviar <br>Proposta';
        this.stepFour = 'stepNo';
        this.canNext = this.simulation.step4CanNext;
        break;
      case StepEnum.STEP_SEND:
        this.leftIcon = 'recent_actors';
        this.leftText = 'Voltar para<br>Ficha';
        this.rightIcon = 'description';
        this.rightText = 'Documentação<br>Disponível';
        this.stepFour = 'stepFour';
        this.canNext = this.simulation.step5CanNext;
        /**TODO Fazer a ligação do front com o Back */
        break;
      case StepEnum.STEP_DOCUMENT:
        this.leftIcon = 'description';
        this.leftText = 'Voltar para<br>Envio';
        this.stepFour = 'stepNo';
        this.canNext = this.simulation.step6CanNext;
        break;

      default:
        break;
    }
  }

 	saveDossier(toFront: boolean){
    this.save.emit();
	}
}