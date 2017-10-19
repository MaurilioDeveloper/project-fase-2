"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app_component_1 = require("./../../app.component");
var flex_layout_1 = require("@angular/flex-layout");
var app_service_1 = require("../../app.service");
var InsuranceSellComponent = /** @class */ (function () {
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
    function InsuranceSellComponent(appComponent, appService, elementRef, renderer, media) {
        var _this = this;
        this.appComponent = appComponent;
        this.appService = appService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.media = media;
        this.title = 'app';
        this.cotacao = "teasteste";
        this.CLIENTE_NIMBLE = 'https://rci.nimble.com.br';
        this._produtor = 1;
        this.theme = 'rci';
        this._nimblePreparado = function (jwt, extra_doc) {
            _this.cotacao = jwt;
        };
        // Prêmio (postMessage)
        this._nimblePremio = function (dados) {
            _this.tokenFecha = dados['token'];
            console.log('_nimblePremio', 'Informa qual prêmio o usuário escolheu');
            // dados.token           - Token de identificação da cotação no TELEPORT
            // dados.calculo         - ID da cotação no TELEPORT
            // dados.seguradora      - ID da seguradora
            // dados.seguradora_nome - Nome da seguradora
            // dados.premio          - Valor total do prêmio
            // dados.opcao           - Franquia selecionada
            console.log(dados);
        };
        // Envia os dados para o Nimble preencher as perguntas (postMessage - cliente)
        // Handler (postMessage)
        this._postMessageNimble = function (event) {
            var origin = event.origin || event.originalEvent.origin;
            // Valida a origin do postMessage
            console.log(origin);
            if (origin !== 'https://rci.nimble.com.br') {
                return;
            }
            // Armazena as referências
            var _pmOrigin = origin;
            var _pmSource = event.source;
            // Verifica a existência de dados
            var message = event.data;
            if (!message || !message.type) {
                return;
            }
            // Manipuladores
            switch (message.type) {
                case 'nimble.preparado':
                    _this._nimblePreparado(message.jwt, message.extra_doc);
                    /* Carrega informações no nimble
                    if (_pmSource && _pmOrigin) {
                      _pmSource.postMessage({
                        type: 'cliente.autofill',
                        data: this._carga
                      }, _pmOrigin);
                    }*/
                    break;
                case 'nimble.premio':
                    _this._nimblePremio(message);
                    _this.enviaPremioBackEnd();
                    break;
                default:
                    console.log("message.type(" + message.type + ") sem manipulador");
            }
        };
        renderer.listenGlobal('window', 'message', this._postMessageNimble);
        this.media.subscribe(function (change) {
            _this.recalcSize();
        });
    }
    // TODO: algum dia uma alma de bom coração ira remover
    // ate la continuara assim
    InsuranceSellComponent.prototype.recalcSize = function () {
        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        //100px  e o menu
        var frame = document.getElementById('nimbleAppIframe');
        if (frame) {
            frame.style.width = "100%";
            y = y - 135;
            frame.style.height = y + "px";
        }
    };
    InsuranceSellComponent.prototype.ngAfterViewInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadScript('https://rci.nimble.com.br/snippet.js')];
                    case 1:
                        _a.sent();
                        this.wind = window;
                        this.nimbleAppPlace = document.getElementById('nimbleAppPlace');
                        return [4 /*yield*/, this.getProductor()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    InsuranceSellComponent.prototype.getProductor = function () {
        var _this = this;
        this.initNimber();
        var observable = this.appService.xSearch('insurancequote', 'getProductor');
        observable.subscribe(function (data) {
            var response = data.json();
            _this._produtor = response.productorId;
            _this.initNimber();
        }, function (err) {
            console.log(err.json());
        });
    };
    InsuranceSellComponent.prototype.enviaPremioBackEnd = function () {
        var observable = this.appService.xSearchWithData('insurancequote/saveSell', this.tokenFecha);
        observable.subscribe(function (data) {
            var response = data.json();
        }, function (err) {
            console.log(err.json());
        });
    };
    InsuranceSellComponent.prototype.loadScript = function (scriptUrl) {
        return new Promise(function (resolve, reject) {
            var scriptElement = document.createElement('script');
            scriptElement.src = scriptUrl;
            scriptElement.onload = resolve;
            document.body.appendChild(scriptElement);
        });
    };
    InsuranceSellComponent.prototype.initNimber = function () {
        // fechamento  = venda direta
        var fechamento = 1;
        // rci-nissan - nissan
        // rci - renaulht
        if (this.appComponent.theme == "renault") {
            this.theme = 'rci';
        }
        else {
            this.theme = 'rci-nissan';
        }
        var pacote = 'B';
        var modalidade = '1';
        //
        var dataQs = [
            'autoscroll=0',
            'erro=1',
            'nova=1',
            'useFB=0',
            'config=1',
            'fechamento=' + fechamento,
            'pacote=' + pacote,
            'theme=' + this.theme,
            'produtor=' + this._produtor // número do usuário
        ];
        // Para recuperar a cotação no Nimble
        // dataQs.push('jwt=' + jwt)
        // Monta a url do Nimble e carregar o iframe
        var qs = '?' + dataQs.join('&');
        var iframe = this.nimbleAppPlace.querySelector('iframe');
        if (iframe && iframe.id === 'nimbleAppIframe') {
            // Reload
            this.wind.texNimbleSnippetReload(qs);
        }
        else {
            // Inicializa
            this.wind.texNimbleSnippet(this.nimbleAppPlace, qs);
        }
        this.recalcSize();
        // this.wind.addEventListener('message', this._postMessageNimble, false);
        // (<any>window).addEventListener('message', this._postMessageNimble, false);
        // this.nimbleAppPlace.querySelector('iframe').addEventListener('message', this._postMessageNimble, false);
        // }
    };
    InsuranceSellComponent = __decorate([
        core_1.Component({
            selector: 'insurance-sell',
            templateUrl: './app/insurance/insurance_sell/insurance-sell.component.html',
            styleUrls: ['./app/insurance/insurance_sell/insurance-sell.component.css']
        }),
        __metadata("design:paramtypes", [app_component_1.AppComponent, app_service_1.AppService, core_1.ElementRef, core_1.Renderer, flex_layout_1.ObservableMedia])
    ], InsuranceSellComponent);
    return InsuranceSellComponent;
}());
exports.InsuranceSellComponent = InsuranceSellComponent;
//# sourceMappingURL=insurance_sell.component.js.map