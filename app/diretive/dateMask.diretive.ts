import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { ControlValueAccessor, NgModel } from '@angular/forms';
import { AppMessage } from "../app.message";

@Directive({
    selector: '[dateMask]',
    providers: [{
        provide: [],
        useExisting: dateMaskDirective,
        multi: true
    }]
})

export class dateMaskDirective implements ControlValueAccessor {
    onTouched: any;
    onChange: any;
    @Input('dateMask') kzMask: string;
    @Input('valid') valid;


    constructor(public model: NgModel, private appMessage: AppMessage) {
        this.valid = true;
    }

    writeValue(value: any): void {

    }

    registerOnChange(fn: any): void {

        this.onChange = fn;

    }

    registerOnTouched(fn: any): void {

        this.onTouched = fn;

    }

    @HostListener('keyup', ['$event'])

    onKeyup($event: any) {
        // retorna caso pressionado backspace
        if ($event.keyCode === 8) {
            //console.log("apagando..")
        } else {
            var valor = $event.currentTarget.value.replace(/\D/g, '');

            var pad = this.kzMask.replace(/\D/g, '').replace(/9/g, '_');

            var valorMask = valor + pad.substring(0, pad.length - valor.length);

            if (valor.length > 5) {
                this.validateDate(valor)
            }

            if (valor.length <= pad.length) {
                //this.onChange(valor);
            }
            var valorMaskPos = 0;
            valor = '';

            for (var i = 0; i < this.kzMask.length; i++) {

                if (isNaN(parseInt(this.kzMask.charAt(i)))) {

                    valor += this.kzMask.charAt(i);

                } else {

                    valor += valorMask[valorMaskPos++];

                }

            }


            if (valor.indexOf('_') > -1) {
                valor = valor.substr(0, valor.indexOf('_'));
            }
            $event.currentTarget.value = valor;

        }

    }

    @HostListener('blur', ['$event'])

    onBlur($event: any) {       
        if (!this.valid) {
            this.appMessage.showError("Data inválida");
            let parent = $event.currentTarget.closest('md-input-container');
            parent.className = parent.className.replace(" fieldInvalid", "");
             parent.className += " fieldInvalid"
        }
             this.valid = true;
       // this.valid = this.valid;

        if ($event.currentTarget.value.length === this.kzMask.length) {
            return;
        }

        $event.currentTarget.value = '';
       

    }

    private validateDate(pObj: any) {

        var aRet = true

        if ((pObj) && (pObj != '')) {

            var dia = pObj.substring(0, 2);

            var mes = pObj.substring(2, 4);

            var ano = pObj.substring(6, 9);

            if ((mes === '04' || mes === '06' || mes === '09' || mes === '11') && dia > '30') {
                aRet = false;
                this.valid = false;
            } else if ((mes === '01' || mes === '03' || mes === '05' || mes === '07' || mes === '08'
                || mes === '10' || mes === '12') && dia > '31') {
                aRet = false;
                this.valid = false;
            } else if (mes === '02' && dia > '28') {
                aRet = false;
                this.valid = false;
            } else if (mes > 12) {
                aRet = false;
                this.valid = false;
            }
            return aRet;
        }

    }

}