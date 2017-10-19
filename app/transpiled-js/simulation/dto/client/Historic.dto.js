"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SaleType_dto_1 = require("./../SaleType.dto");
var province_dto_1 = require("./../../../commons/province/dto/province.dto");
var Phone_dto_1 = require("./Phone.dto");
var Historic = /** @class */ (function () {
    function Historic() {
        this.phone = new Phone_dto_1.Phone();
        this.province = new province_dto_1.Province();
        this.saleType = new SaleType_dto_1.SaleType();
    }
    return Historic;
}());
exports.Historic = Historic;
//# sourceMappingURL=Historic.dto.js.map