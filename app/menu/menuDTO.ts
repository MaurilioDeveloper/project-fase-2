export class menuDTO {
    public icon: string;
    public text: string;
    public route: string;
    public items: Array<menuDTO>;

    constructor(icon,text,route,items) {

        this.icon= icon;
        this.text= text;
        this.route= route;
        this.items= items;
        
    }
}