import { DocumentService } from './service/document.service';
import { SimulationService } from './../simulation.service';
import { AppComponent } from './../../app.component';
import { Simulation } from './../dto/Simulation.dto';
import { AppMessage } from './../../app.message';
import { EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';

@Component({
    selector: 'doc-simulation',
    templateUrl: './app/simulation/document/document.component.html',
    styleUrls: ['app/simulation/document/document.component.css'],
    providers: [DocumentService]
})
export class DocumentComponent implements OnInit {
   
    @Output() changeStep: EventEmitter<boolean> = new EventEmitter<boolean>();
  

    constructor(private documentService: DocumentService, private appService: AppService, private appMessage: AppMessage) {
    }

	ngOnInit() {
        this.documentService.init();
	}

    getSimulation(): Simulation {
        return this.documentService.simulation;
    }

    getListDocuments(): Object[] {
        return this.documentService.listDocuments;
    }

    downloadDoc(doc) {
        let documentCall;
        if (doc.idDoc == 1) {
            this.downloadDocFromSantander(doc, "CET");
            return;
        } else if (doc.idDoc == 2) {
            this.downloadDocFromSantander(doc, "CCB");
            return;
        } else if (doc.idDoc == 3) {
            this.downloadDocFromSantander(doc, "APROVACAO");
            return;
        } else if (doc.idDoc == 4) {
            this.downloadDocFromS3(doc, "CCB_CLAUSULAS");
            return;
        } else if (doc.idDoc == 5) {
            documentCall = this.appService.xFileDownload("documentationService", "printSPF/" + this.getSimulation().id + "/", "SPF", "pdf");
        } else if (doc.idDoc == 6) {
            documentCall = this.appService.xFileDownload("documentationService", "printGAP/" + this.getSimulation().id + "/", "GAP", "pdf");
        } else if (doc.idDoc == 7) {
            this.downloadDocFromS3(doc, "CTRL");
            return;
        } else if (doc.idDoc == 8) {
            this.downloadDocFromS3(doc, "CC");
            return;
        } else if (doc.idDoc == 9) {
            this.downloadDocFromS3(doc, "VISTORIA");
            return;
        } else if (doc.idDoc == 10) {
	        documentCall = this.appService.xFileDownload("documentationService", "printDocFromNimble/" + this.getSimulation().calculationSelected.id + "/", "COTACAO", "pdf");
        }

        documentCall.subscribe(
            (data) => {
                this.appMessage.showSuccess("msg-doc-generated");
            },
            err => {
                console.log(err.json());
            }
        );
        
    }

    downloadDocFromS3(doc, docName: string){
        let documentCall = this.appService.xFileDownload("documentationService", "printFileFromS3/" + doc.link + "/", docName, "pdf");
        documentCall.subscribe(
            (data) => {
                this.appMessage.showSuccess("msg-doc-generated");
            },
            err => {
                console.log(err.json());
            }
        );
    }

    downloadDocFromSantander(doc, docName: string){
        let documentCall = this.appService.xFileDownload("documentationService", "printDocsFromSantander/" + this.getSimulation().id + "/" + 1 + "/", docName, "pdf");
        documentCall.subscribe(
            (data) => {
                this.appMessage.showSuccess("msg-doc-generated");
            },
            err => {
                console.log(err.json());
            }
        );
    }
    
    sendEmail(doc) {
        let email;
        if (doc.idDoc == 1) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + 1 + "/" + null + "/" + 1 + "/");
        } else if (doc.idDoc == 2) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + 2 + "/" + null + "/" + 2 + "/");
        } else if (doc.idDoc == 3) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + 5 + "/" + null + "/" + 3 + "/");
        } else if (doc.idDoc == 4) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + doc.link + "/" + 4 + "/");
        } else if (doc.idDoc == 5) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + null + "/" + 5 + "/");
        } else if (doc.idDoc == 6) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + null + "/" + 6 + "/");
        } else if (doc.idDoc == 7) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + doc.link + "/" + 7 + "/");
        } else if (doc.idDoc == 8) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + doc.link + "/" + 8 + "/");
        } else if (doc.idDoc == 9) {
            email = this.appService.xSearch("documentationService", "sendEmail/" + this.getSimulation().id + "/" + null + "/" + doc.link + "/" + 9 + "/");
        }

        email.subscribe(
            (data) => {
                this.appMessage.showSuccess("msg-send-mail-success");
            },
            err => {
                console.log(err.json());
            }
        );
    }

    voltar() {
        this.changeStep.emit(false);
    }
}