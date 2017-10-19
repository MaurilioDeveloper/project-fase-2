import { FinancialTablePromotional } from './FinancialTablePromotional.dto';

export class FinancialTable {
    public productId: string;
    public description: string;
    public promotional: boolean;
    public productInformation: string;
    public listProductPromotional: FinancialTablePromotional[];
    constructor() {
    }
}