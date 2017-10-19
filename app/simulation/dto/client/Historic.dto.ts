import { SaleType } from './../SaleType.dto';
import { Province } from './../../../commons/province/dto/province.dto';
import { Phone } from './Phone.dto';

export class Historic{
    public cpfCnpj: string;
    public name:string;
    public email:string 
    public phone: Phone;
    public province: Province;
    public saleType: SaleType;

    constructor(){
		this.phone = new Phone();
		this.province = new Province();
		this.saleType = new SaleType();
    }


}

