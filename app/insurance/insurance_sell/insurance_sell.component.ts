import { Component, ElementRef, Renderer, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { AppComponent } from './../../app.component';
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { BrowserDomAdapter } from "@angular/platform-browser/src/browser/browser_adapter";
import { AppService } from "../../app.service";


@Component({
  selector: 'insurance-sell',
  templateUrl: './app/insurance/insurance_sell/insurance-sell.component.html',
  styleUrls: ['./app/insurance/insurance_sell/insurance-sell.component.css']
})

export class InsuranceSellComponent implements AfterViewInit {
  title = 'app';
  cotacao: string = "teasteste";
  finalizada: string;
  tokenFecha: string;
  fipe: String;
  CLIENTE_NIMBLE = 'https://rci.nimble.com.br';
  _pmOrigin;
  nimbleAppPlace: any;
  _pmSource;
  wind;
  _produtor = 1;
  theme = 'rci';
  /*   - objeto de carga do nimble
  
  _carga = {
    'fipe': '003325-1',
    'ano_fabr': '2015',
    'ano_modelo': '2016',
    'portas': '4',
    'chassi': '9BGKS48R0FG314856',
    'placa': 'FLU4387',
    'placa_uf': 'SP',
    'combustivel': '5',
    'has_kitgas': '0',
    'is_zerokm': '0',
    'is_blindado': '0',
    'has_antifurto': '0',
    'is_adaptado': '0',
    'uso_trabalho': '0',
    'uso_locomocao_diaria': '1',
    'condutor_cpf': '146.133.771-29',
    'condutor_profissao_descricao': 'Programador',
    'condutor_cep_veiculo': '04653-055',
    'Condutores': [{
      'nome': 'Thiago Lagden',
      'sexo': 'M',
      'nascimento': '01/09/1981',
      'idade_habilitacao': '18',
      'dias_dirige': '7',
      'estado_civil': 'C',
      'possui_veiculo': '0'
    }]
  };
*/

  constructor(private appComponent:AppComponent,private appService:AppService,private elementRef: ElementRef, public renderer: Renderer, private media: ObservableMedia) {
    renderer.listenGlobal('window', 'message', this._postMessageNimble);
  
    this.media.subscribe((change) => {
      this.recalcSize();
    });
  }
  // TODO: algum dia uma alma de bom coração ira remover
  // ate la continuara assim
  recalcSize() {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;
    //100px  e o menu
    let frame = document.getElementById('nimbleAppIframe');
    if (frame) {
      frame.style.width = "100%";
      y = y - 135;
      frame.style.height = y + "px";
    }
  }

  async ngAfterViewInit() {
    await this.loadScript('https://rci.nimble.com.br/snippet.js');
    this.wind = (<any>window);
    this.nimbleAppPlace = document.getElementById('nimbleAppPlace');
    await this.getProductor();
  }

  getProductor(){
    this.initNimber();
    let observable = this.appService.xSearch('insurancequote','getProductor' );
    observable.subscribe(
        (data) => {
           let response = data.json();
           this._produtor = response.productorId;
           this.initNimber();
        },
        err => {
           console.log(err.json());
        }
   );
  }
  enviaPremioBackEnd(){
    
    let observable = this.appService.xSearchWithData('insurancequote/saveSell',this.tokenFecha)
    observable.subscribe(
        (data) => {
           let response = data.json();
            
        },
        err => {
           console.log(err.json());
        }
   );
  
  
    
  }
 


  loadScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }


  _nimblePreparado = (jwt, extra_doc) => {
    this.cotacao = jwt;
  }

  // Prêmio (postMessage)
  _nimblePremio = (dados) => {
    this.tokenFecha = dados['token'];
    console.log('_nimblePremio', 'Informa qual prêmio o usuário escolheu');
    // dados.token           - Token de identificação da cotação no TELEPORT
    // dados.calculo         - ID da cotação no TELEPORT
    // dados.seguradora      - ID da seguradora
    // dados.seguradora_nome - Nome da seguradora
    // dados.premio          - Valor total do prêmio
    // dados.opcao           - Franquia selecionada
    console.log(dados);
  }

  // Envia os dados para o Nimble preencher as perguntas (postMessage - cliente)

  // Handler (postMessage)
  _postMessageNimble = (event) => {
    const origin = event.origin || event.originalEvent.origin;

    // Valida a origin do postMessage
    console.log(origin);
    if (origin !== 'https://rci.nimble.com.br') {
      return;
    }

    // Armazena as referências
    const _pmOrigin = origin;
    const _pmSource = event.source;

    // Verifica a existência de dados
    const message = event.data;
    if (!message || !message.type) {
      return;
    }

    // Manipuladores
    switch (message.type) {
      case 'nimble.preparado':
        this._nimblePreparado(message.jwt, message.extra_doc);
        /* Carrega informações no nimble
        if (_pmSource && _pmOrigin) {
          _pmSource.postMessage({
            type: 'cliente.autofill',
            data: this._carga
          }, _pmOrigin);
        }*/
        break;

      case 'nimble.premio':
        this._nimblePremio(message);
        this.enviaPremioBackEnd();
        break;

      default:
        console.log(`message.type(${message.type}) sem manipulador`);
    }
  }

  initNimber() {
    // fechamento  = venda direta
    const fechamento = 1;
    // rci-nissan - nissan
    // rci - renaulht

    if(this.appComponent.theme == "renault"){
      this.theme = 'rci';
    }else{
      this.theme= 'rci-nissan';
    }
    const pacote = 'B';
    const modalidade = '1';

    //
    const dataQs = [
      'autoscroll=0',              // faz scroll entre os boxes automaticamente
      'erro=1',                    // exibe os erros de uma cotação
      'nova=1',                    // força uma nova cotação
      'useFB=0',                   // desativa o login via Facebook
      'config=1',                  // exibe os boxes de Coberturas, RCF, APP, etc
      'fechamento=' + fechamento,  // desabilita a transmissão via Nimble
      'pacote=' + pacote,          // pacote usado para o calculo
      'theme=' + this.theme,            // tema
      'produtor=' + this._produtor       // número do usuário
    ];

    // Para recuperar a cotação no Nimble
    // dataQs.push('jwt=' + jwt)

    // Monta a url do Nimble e carregar o iframe
    const qs = '?' + dataQs.join('&');
    const iframe = this.nimbleAppPlace.querySelector('iframe');
    if (iframe && iframe.id === 'nimbleAppIframe') {
      // Reload
      this.wind.texNimbleSnippetReload(qs);
    } else {
      // Inicializa
      this.wind.texNimbleSnippet(this.nimbleAppPlace, qs);

    }
    this.recalcSize();
    // this.wind.addEventListener('message', this._postMessageNimble, false);
    // (<any>window).addEventListener('message', this._postMessageNimble, false);
    // this.nimbleAppPlace.querySelector('iframe').addEventListener('message', this._postMessageNimble, false);
    // }

  }
}