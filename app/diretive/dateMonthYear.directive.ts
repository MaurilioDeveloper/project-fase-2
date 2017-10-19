import { AppMessage } from './../app.message';
import { NgModel } from '@angular/forms';
import { Directive, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[monthyear]',
    host: {
        '(blur)': 'onBlur($event)',
        '(keyup)': 'onKeyup($event)',
        '(keypress)': 'onKeypress($event)'
    }
})
export class DateMonthYear {

    @Input('valid') valid;
    public keycode: boolean;
    public keypres;


    @HostListener('keyup', ['$event'])
    onKeyup($event: any) {
        let data = $event.target.value;
        if ($event.keyCode === 8) {
            this.keycode = true;
        } else {
            if (!data) {
                return;
            }
            var valorMask = "";
            if (data.length == 1) {
                let valor: number = parseInt(data);
                if (valor > 1) {
                    this.model.valueAccessor.writeValue("");
                    this.valid = false;
                    return;
                }
            }
            if (data.length == 2) {
                let valor: number = parseInt(data);
                let fistValue = data.substr(0, 1);
                let secondValue = data.substr(1, 2);
                if (secondValue > 2 && fistValue == 1) {
                    this.model.valueAccessor.writeValue(fistValue);
                    this.valid = false;
                    return;
                }
                valorMask = data.substr(0, 2) + '/';
                data = valorMask;
            }
            if (data.length == 4) {
                let valor = data.substr(3, 4);
                if (valor < 1 || valor > 2) {
                    this.model.valueAccessor.writeValue(data.substr(0, 3));
                    this.valid = false;
                    return;
                }
            }

            if (data instanceof Date) {

                let month = data.getMonth() + 1;
                let newMonth;
                if (month < 10) {
                    newMonth = "0" + month;
                }
                month = newMonth;
                let year = data.getFullYear();
                data = month + "/" + year;
            }

            if (data.length == 6 && data.indexOf('/') == -1) {
                data = data.substr(0, 2) + "/" + data.substr(2, 6);
            }

            if (data.length >= 7) {
                data = data.substr(0, 7);
                this.valid = true;
            }


            let valor = data.replace(/\D/g, '');
            this.model.valueAccessor.writeValue(data);
            this.model.viewToModelUpdate(valor);
            this.model.model = valor;


        }
    }

    @HostListener('keypress', ['$event'])
    onKeypress($event: any) {
        let data = $event.target.value;
        if ($event.keyCode === 8) {
            this.keycode = true;
        } else {
            if (!data) {
                return;
            }
            var valorMask = "";

            console.log(this.model);
            if (data.length == 1) {
                let valor: number = parseInt(data);
                if (valor > 1) {
                    this.model.valueAccessor.writeValue("");
                    this.valid = false;
                    return;
                }
            }
            if (data.length == 2) {
                let valor: number = parseInt(data);
                let fistValue = data.substr(0, 1);
                let secondValue = data.substr(1, 2);
                if (secondValue > 2 && fistValue == 1) {
                    this.model.valueAccessor.writeValue(fistValue);
                    this.valid = false;
                    return;
                }
                valorMask = data.substr(0, 2) + '/';
                data = valorMask;
            }
            if (data.length == 4) {
                let valor = data.substr(3, 4);
                if (valor < 1 || valor > 2) {
                    this.model.valueAccessor.writeValue(data.substr(0, 3));
                    this.valid = false;
                    return;
                }
            }

            if (data instanceof Date) {

                let month = data.getMonth() + 1;
                let newMonth;
                if (month < 10) {
                    newMonth = "0" + month;
                }
                month = newMonth;
                let year = data.getFullYear();
                data = month + "/" + year;
            }

            if (data.length == 6 && data.indexOf('/') == -1) {
                data = data.substr(0, 2) + "/" + data.substr(2, 6);
            }

            if (data.length >= 7) {
                data = data.substr(0, 7);
                this.valid = true;
            }


            let valor = data.replace(/\D/g, '');
            this.model.valueAccessor.writeValue(data);
            this.model.viewToModelUpdate(valor);
            this.model.model = valor;


        }
    }

    onBlur($event) {
        if (!this.valid) {
            this.appMessage.showError("Campo inválido");
        }
        this.valid = this.valid;

        let parent = $event.srcElement.closest('md-input-container');
        parent.className = parent.className.replace(" fieldInvalid", "");
        if (!this.valid) {
            parent.className += " fieldInvalid"
        }
    }

    constructor(public model: NgModel, private appMessage: AppMessage) {
        this.model.control.valueChanges.subscribe(data => {
            if (!data) {
                data = "";
            }else{
                if(data instanceof Date) {
                    let month = data.getMonth() + 1;
                    if(data.getMonth() != undefined && !isNaN(month)) {
                        let newMonth;
                        if (month < 10) {
                            newMonth = "0" + month;
                            month = newMonth;
                        }
                        
                        let year = data.getFullYear();
                        data =  month + "/" + year;
                    }else{
                        data = "";
                            
                    }
                }else {
                    var lengthh = Math.log(data) * Math.LOG10E + 1 | 0;
                    if(lengthh > 10) { 
                        data = new Date(parseInt(data));
                        let month = data.getMonth() + 1;
                        let newMonth;
                        if (month < 10) {
                            newMonth = "0" + month;
                            month = newMonth;
                        }
                        
                        let year = data.getFullYear();
                        data =  month + "/" + year;
                    }
                }
            }
            this.model.valueAccessor.writeValue(data);
            let dateToModel: Date = new Date("01" + "/" + data);
            this.model.viewToModelUpdate(dateToModel);
            this.model.model = dateToModel;

        });
    }


}