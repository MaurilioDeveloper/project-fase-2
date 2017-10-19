import { ServiceResponseDTO } from './../calculationPainel/calculationDialog/calculation/servicesDialog/ServiceResponseDTO';
import { InstallmentGroup } from './InstallmentGroup.dto';
import { Repackage } from './Repackage.dto';
import { Coefficient } from './Coefficient.dto';
import { Installment } from './Installment.dto';
import { Commission } from './Commission.dto';
import { FinancialTable } from './FinancialTable.dto';
import { FinancialType } from './FinancialType.dto';
import { Rate } from './Rate.dto';
import { Service } from './Service.dto';
import { Term } from './Term.dto';
export class Calculation {
    public id: string;
    public financialType: FinancialType;
    public financialTable: FinancialTable;
    public coeficiente:Coefficient;
    public entranceValue:number;
    public delay:number;//carencia
    public services:Service[];
    public serviceCotizador: ServiceResponseDTO;
    public serviceList:  Array<ServiceResponseDTO>;
    public rates:[Rate];
    public selected:Boolean;
    public commission:Commission;
    public term:number;//parcelas
    public financedAmount:number;
    public totalValue:number;
    public instalmentAmount:number;
    public montlyRate:number;
    public installments: Installment[];
    public terms: [Term];
    public creditReport: string;
    public storeControl: string;
    public repackage: Repackage;

    constructor() {
        this.financialType = new FinancialType();
        this.financialTable = new FinancialTable();
        this.serviceList =  new Array<ServiceResponseDTO>();
        this.totalValue = 0;
    }
}