import { MdDialogRef } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { Simulation } from "../dto/Simulation.dto";

@Component({
    selector: 'discard-insurance-quote-dialog',
    templateUrl: 'app/simulation/discardInsuranceQuoteDialog/discard-insurance-quote-dialog.dialog.html'
})

export class DiscardInsuranceQuoteDialog implements OnInit {

    response: boolean = false;

    ngOnInit(): void {
    }

    constructor(private dialogRef: MdDialogRef<DiscardInsuranceQuoteDialog>) {
    }

    confirm(result: boolean) {
        this.response = result;
        this.dialogRef.close();
    }

}