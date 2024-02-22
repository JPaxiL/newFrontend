(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["login-login-module"],{

/***/ "NOti":
/*!****************************************************!*\
  !*** ./src/app/dashboard/service/users.service.ts ***!
  \****************************************************/
/*! exports provided: UsersService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsersService", function() { return UsersService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ "AytR");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "tk/3");




class UsersService {
    constructor(http) {
        this.http = http;
    }
    getAll() {
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].apiUrl + `/api/user`);
    }
    getUsers(currentPage) {
        //console.log(environment.apiUrl , currentPage);
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].apiUrl + 'clientes?page=' + currentPage);
        // .map(res => res.json());
    }
    setUserInLocalStorage() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            yield this.http.get(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].apiUrl}/api/user`)
                .toPromise()
                .then(res => {
                localStorage.setItem('user_id', res.data.id);
            });
        });
    }
}
UsersService.ɵfac = function UsersService_Factory(t) { return new (t || UsersService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"])); };
UsersService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: UsersService, factory: UsersService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "V1Ps":
/*!*****************************************************!*\
  !*** ./src/app/login/components/login.component.ts ***!
  \*****************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var src_app_core_store_auth_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/core/store/auth.actions */ "jThn");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _ngxs_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngxs/store */ "AcyG");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "1kSV");
/* harmony import */ var src_app_dashboard_service_users_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/dashboard/service/users.service */ "NOti");
/* harmony import */ var src_app_events_services_event_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/events/services/event.service */ "Eq0F");
/* harmony import */ var src_app_events_services_event_socket_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/events/services/event-socket.service */ "mEh3");
/* harmony import */ var src_app_profile_config_services_user_data_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/profile-config/services/user-data.service */ "6mAC");
/* harmony import */ var src_app_vehicles_services_vehicle_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/app/vehicles/services/vehicle.service */ "EdFl");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ "ofXK");














function LoginComponent_div_22_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "button", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function LoginComponent_div_22_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r3.resetLoginAlert(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r0.errMsg, " ");
} }
function LoginComponent_div_30_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Iniciar Sesi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function LoginComponent_div_31_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
class LoginComponent {
    constructor(store, router, config, fb, userService, eventService, eventSocketService, userDataService, vehicleService) {
        this.store = store;
        this.router = router;
        this.fb = fb;
        this.userService = userService;
        this.eventService = eventService;
        this.eventSocketService = eventSocketService;
        this.userDataService = userDataService;
        this.vehicleService = vehicleService;
        this.showNavigationArrows = false;
        this.showNavigationIndicators = false;
        this.images = [
            `./assets/images/login/background_cc.png`,
            `./assets/images/login/background_city.png`
        ];
        this.validCredentials = 0; //-1 es credenciales fallidas, 0 es estado inicial, 1 es login exitoso
        this.isLoggingIn = false;
        this.errMsg = '';
        // customize default values of carousels used by this component tree
        config.showNavigationArrows = true;
        config.showNavigationIndicators = true;
        config.interval = 5000;
        config.wrap = true;
    }
    ngOnInit() {
        this.loginForm = this.fb.group({
            name: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
    }
    resetLoginAlert() {
        this.validCredentials = 0;
    }
    save() {
        console.log("LOGIN ISVALID: ", this.loginForm.valid);
        if (this.loginForm.valid) {
            const params = this.loginForm.value;
            // params['registrador_id'] = params['registrador']['id'];
            this.isLoggingIn = true;
            //console.log(params);
            this.store.dispatch(new src_app_core_store_auth_actions__WEBPACK_IMPORTED_MODULE_2__["SignIn"](params.name, params.password)).subscribe((data) => {
                // Animación de carga de Iniciando sesión...
                this.validCredentials = 1;
                console.log('Inicio de sesión exitoso');
                //console.log(data);
                this.startSession();
                /* this.userService.setUserInLocalStorage();
                this.router.navigate(['/panel'], {
                  state: {
                    //flag para mostrar toast de bienvenida
                    recentLogIn: true,
                  }
                });
                this.eventSocketService.listen(); */
            }, error => {
                // if(error.status == 400){
                switch (error.error.error) {
                    case 'invalid_grant':
                        this.errMsg = 'Nombre de Usuario o Contraseña inválidos';
                        break;
                    case 'inactive_user':
                        this.errMsg = 'Tu cuenta aún no ha sido activada';
                        break;
                    case 'user_not_found':
                        this.errMsg = 'El usuario no existe';
                        break;
                    default:
                        this.errMsg = 'Hubo un error. Inténtalo nuevamente';
                        break;
                }
                this.isLoggingIn = false;
                //console.log(error.error.error);
                this.validCredentials = -1;
            });
            // let categoria = <Categoria>params;
            // this.confirmSave(categoria);
        }
        else {
        }
    }
    startSession() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            console.log("starting SESION");
            yield this.userService.setUserInLocalStorage();
            this.router.navigate(['/panel'], {
                state: {
                    //flag para mostrar toast de bienvenida
                    recentLogIn: true,
                }
            });
            this.eventSocketService.user_id = localStorage.getItem('user_id');
            this.eventSocketService.initializeSocket(this.eventSocketService.user_id);
            // this.vehicleService.setDefaultStatusDataVehicle();
            // this.vehicleService.initialize();
            this.eventService.getAll();
            this.eventSocketService.listen();
            // this.userDataService.getUserData();
        });
    }
}
LoginComponent.ɵfac = function LoginComponent_Factory(t) { return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngxs_store__WEBPACK_IMPORTED_MODULE_4__["Store"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__["NgbCarouselConfig"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_dashboard_service_users_service__WEBPACK_IMPORTED_MODULE_7__["UsersService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_events_services_event_service__WEBPACK_IMPORTED_MODULE_8__["EventService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_events_services_event_socket_service__WEBPACK_IMPORTED_MODULE_9__["EventSocketService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_profile_config_services_user_data_service__WEBPACK_IMPORTED_MODULE_10__["UserDataService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_vehicles_services_vehicle_service__WEBPACK_IMPORTED_MODULE_11__["VehicleService"])); };
LoginComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: LoginComponent, selectors: [["app-login"]], decls: 60, vars: 5, consts: [[1, "main-background"], ["src", "./assets/images/login/login-background.png", 1, "mh-100", 2, "width", "100%", "height", "100vh", "object-fit", "cover"], [1, "color-overlay"], [1, "overlay", "h-100", "position-absolute", "d-flex", "flex-column"], [1, "row", "w-100", "flex-grow-1"], [1, "col-5", "offset-1", "d-flex", "justify-content-center"], [1, "row", "d-flex", "flex-column", "align-items-center"], [1, "welcome-panel"], [1, "row"], [1, "col-12", "logo", "align-self-start", "mb-4"], ["src", "./assets/images/logo-gl-tracker.svg", "alt", "logo", 1, "load"], [1, "col-12"], [1, "logo-underline", "align-self-start", "mb-4"], [1, "row", "futura-md-bt-bold"], [1, "col-5", "d-flex", "justify-content-center"], [1, "login-panel", "general-font"], [1, "row", "error-msg"], ["class", "d-flex alert alert-danger alert-dismissible fade show", "role", "alert", 4, "ngIf"], [1, "row", "input-header", "mb-3"], ["autocomplete", "on", "novalidate", "", 1, "row", "gap-3", 3, "formGroup"], ["formControlName", "name", "type", "text", "placeholder", "Nombre de usuario"], ["formControlName", "password", "type", "password", "placeholder", "Contrase\u00F1a"], ["type", "submit", 1, "btn", "btn-success", "w-100", 3, "disabled", "click"], [4, "ngIf"], [1, "row", "mt-3", "text-center"], [1, "input-forgot"], [1, "input-contact"], [1, "row", "my-3", 2, "height", "1px", "background-color", "#fff"], [1, "row", "mt-3", "input-footer", "text-center"], [1, "row", "w-100"], [1, "overlay-footer", "general-font"], [1, "row", "justify-content-center"], [1, "text-center"], [1, "align-self-center", "my-3", 2, "width", "28rem", "height", "1px", "background-color", "#fff"], [1, "col-12", "pb-4", "d-flex", "flex-wrap", "justify-content-center", "align-items-center", "certif-logos-container"], ["src", "./assets/images/login/footer-iso-29110.svg", 1, "load"], ["src", "./assets/images/login/footer-ntp.svg", 1, "load"], ["src", "./assets/images/login/footer-moprosoft.svg", 1, "load"], ["src", "./assets/images/login/footer-apesoft.svg", 1, "load"], ["src", "./assets/images/login/footer-mtc.svg", 1, "load"], ["src", "./assets/images/login/footer-sutran.svg", 1, "load"], ["src", "./assets/images/login/footer-ccl.svg", 1, "load"], ["src", "./assets/images/login/footer-indecopi.png", 1, "load"], ["src", "./assets/images/login/footer-osinergmin.svg", 1, "load"], ["role", "alert", 1, "d-flex", "alert", "alert-danger", "alert-dismissible", "fade", "show"], [1, "flex-grow-1"], [1, "btn-close-container"], ["type", "button", "aria-label", "Cerrar", 1, "btn-close", "btn-close-white", 3, "click"], ["role", "status", "aria-hidden", "true", 1, "spinner-border", "spinner-border-sm"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "img", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "img", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](12, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15, "PLATAFORMA");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17, "DE MONITOREO");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](22, LoginComponent_div_22_Template, 5, 1, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](25, "Ingrese sus datos:");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](26, "form", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](27, "input", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](28, "input", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function LoginComponent_Template_button_click_29_listener() { return ctx.save(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](30, LoginComponent_div_30_Template, 2, 0, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](31, LoginComponent_div_31_Template, 2, 0, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](32, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](33, "p", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](34, "\u00BFOlvidaste tu nombre de usuario o contrase\u00F1a?");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](35, "p", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](36, "Cont\u00E1ctate con el administrador de nuestro servicio");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](37, "div", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](38, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](39, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](40, "Sistema de Monitoreo Vehicular GL Tracker Sur S.A.C.");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](41, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](42, "Todos los derechos reservados - 2022");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](43, "div", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](44, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](45, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](46, "div", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](47, "p", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](48, "Nuestras Certificaciones");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](49, "div", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](50, "div", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](51, "img", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](52, "img", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](53, "img", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](54, "img", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](55, "img", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](56, "img", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](57, "img", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](58, "img", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](59, "img", 43);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.validCredentials == -1 && !ctx.isLoggingIn);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx.loginForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.loginForm.invalid || ctx.isLoggingIn);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.isLoggingIn);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.isLoggingIn);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_12__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_ba"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"]], styles: [".futura-md-bt-bold[_ngcontent-%COMP%] {\n  font-family: Futura-MD-BT-Bold, \"Verdana-Bold\", sans-serif;\n}\n\n.alert-danger[_ngcontent-%COMP%] {\n  color: #ffffff;\n  background-color: #B83F38;\n  border: none;\n}\n\n.general-font[_ngcontent-%COMP%] {\n  font-family: var(--general-font-family);\n}\n\n.btn-close[_ngcontent-%COMP%]:hover {\n  background: transparent url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e\") center/1em auto no-repeat;\n}\n\n.main-background[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  object-fit: cover;\n}\n\n.main-background[_ngcontent-%COMP%]   .color-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: var(--gl-blue-dark-alpha);\n}\n\n.overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 12;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  align-items: center;\n  overflow: visible;\n}\n\n.welcome-panel[_ngcontent-%COMP%] {\n  color: #FFF;\n  font-size: 4.5rem;\n  line-height: 4.5rem;\n}\n\n.welcome-panel[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]    > .load[_ngcontent-%COMP%] {\n  width: 240px;\n  height: auto;\n}\n\n.welcome-panel[_ngcontent-%COMP%]   .logo-underline[_ngcontent-%COMP%] {\n  width: 3ch;\n  height: 0.25ch;\n  background-color: var(--gl-yellow);\n}\n\n.welcome-panel[_ngcontent-%COMP%], .login-panel[_ngcontent-%COMP%] {\n  padding-top: 20vh;\n}\n\n.login-panel[_ngcontent-%COMP%] {\n  --input-radius: 1.8rem;\n  max-width: 26rem;\n  color: #fff;\n}\n\n.login-panel[_ngcontent-%COMP%]   .input-header[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  padding-left: var(--input-radius);\n  font-size: 1.25rem;\n  font-weight: bold;\n}\n\n.login-panel[_ngcontent-%COMP%]   .alert-danger[_ngcontent-%COMP%] {\n  border-radius: var(--input-radius);\n  padding-left: var(--input-radius);\n}\n\n.login-panel[_ngcontent-%COMP%]   .alert-danger[_ngcontent-%COMP%]   .btn-close-container[_ngcontent-%COMP%] {\n  height: 100%;\n  width: 1.125rem;\n  display: flex;\n  align-items: center;\n  overflow-x: visible;\n  padding-left: 1.125rem;\n}\n\n.login-panel[_ngcontent-%COMP%]   .alert-danger[_ngcontent-%COMP%]   .btn-close-container[_ngcontent-%COMP%]   .btn-close[_ngcontent-%COMP%] {\n  position: static;\n  padding: 0;\n  margin-right: -1.125rem;\n}\n\n.login-panel[_ngcontent-%COMP%]   .alert-danger[_ngcontent-%COMP%]   button.btn-close[_ngcontent-%COMP%]:focus {\n  outline: none !important;\n  box-shadow: none;\n}\n\n.login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > input[type=text][_ngcontent-%COMP%], .login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%] {\n  background-color: var(--gl-blue-dark-alpha);\n  color: #ffffff;\n  height: calc(var(--input-radius) * 2);\n  border: 1px solid white;\n  border-radius: var(--input-radius);\n  padding: var(--input-radius);\n  font-size: calc(var(--input-radius) * 3 / 5);\n}\n\n.login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > input[type=text][_ngcontent-%COMP%]::placeholder, .login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%]::placeholder {\n  color: #91d8f7;\n}\n\n.login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > input[type=text][_ngcontent-%COMP%]:focus, .login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%]:focus {\n  outline: none !important;\n  box-shadow: none;\n}\n\n.login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > button[_ngcontent-%COMP%] {\n  border: none;\n  height: calc(var(--input-radius) * 2);\n  border-radius: var(--input-radius);\n  background-color: var(--gl-yellow);\n  font-size: calc(var(--input-radius) * 2 / 3);\n  font-weight: 500;\n  color: var(--gl-blue-dark);\n}\n\n.login-panel[_ngcontent-%COMP%]   .input-forgot[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  font-weight: 500;\n}\n\n.login-panel[_ngcontent-%COMP%]   .input-contact[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n\n.login-panel[_ngcontent-%COMP%]   .input-footer[_ngcontent-%COMP%] {\n  line-height: 1.125rem;\n}\n\n.overlay-footer[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: center;\n  width: 100%;\n}\n\n.overlay-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 1.125rem;\n}\n\n.overlay-footer[_ngcontent-%COMP%]   .certif-logos-container[_ngcontent-%COMP%] {\n  column-gap: 4vw;\n  row-gap: 0.75rem;\n  padding-left: 4.5%;\n  padding-right: 4.5%;\n}\n\n.overlay-footer[_ngcontent-%COMP%]   .certif-logos-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 8rem;\n  max-height: 4rem;\n}\n\n\n\nlabel[_ngcontent-%COMP%] {\n  display: flex;\n  column-gap: 5px;\n  align-items: center;\n}\n\np[_ngcontent-%COMP%] {\n  margin: 0;\n}\n\n.ok-btn[_ngcontent-%COMP%] {\n  color: #ffffff;\n  background-color: #76C04E;\n  font-size: 1.75rem;\n  padding: 0.6rem 2.5rem;\n}\n\n.demo-btn[_ngcontent-%COMP%] {\n  margin-top: 1.25rem;\n  margin-bottom: 4rem;\n}\n\nbutton[_ngcontent-%COMP%]:hover {\n  background-image: linear-gradient(rgba(0, 0, 0, 0.125) 0 0);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxsb2dpbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNDLDBEQUFBO0FBQ0Q7O0FBRUE7RUFDSSxjQUFBO0VBQ0EseUJBQUE7RUFDSCxZQUFBO0FBQ0Q7O0FBRUE7RUFDQyx1Q0FBQTtBQUNEOztBQUVBO0VBQ0MsMldBQUE7QUFDRDs7QUFFQTtFQUNDLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLGlCQUFBO0FBQ0Q7O0FBQUM7RUFDQyxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSwyQ0FBQTtBQUVGOztBQUVBO0VBQ0Msa0JBQUE7RUFDQSxXQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQkFBQTtBQUNEOztBQUVBO0VBQ0MsV0FBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7QUFDRDs7QUFDQztFQUNDLFlBQUE7RUFDQSxZQUFBO0FBQ0Y7O0FBRUM7RUFDQyxVQUFBO0VBQ0EsY0FBQTtFQUNBLGtDQUFBO0FBQUY7O0FBSUE7RUFDQyxpQkFBQTtBQUREOztBQUlBO0VBQ0Msc0JBQUE7RUFHQSxnQkFBQTtFQUVBLFdBQUE7QUFKRDs7QUFNQztFQUNDLGlDQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtBQUpGOztBQU9DO0VBQ0Msa0NBQUE7RUFDQSxpQ0FBQTtBQUxGOztBQU9FO0VBQ0MsWUFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLHNCQUFBO0FBTEg7O0FBT0c7RUFDQyxnQkFBQTtFQUNBLFVBQUE7RUFDQSx1QkFBQTtBQUxKOztBQVNFO0VBQ0Msd0JBQUE7RUFDQSxnQkFBQTtBQVBIOztBQVlFO0VBQ0MsMkNBQUE7RUFDQSxjQUFBO0VBQ0EscUNBQUE7RUFDQSx1QkFBQTtFQUNBLGtDQUFBO0VBQ0EsNEJBQUE7RUFFQSw0Q0FBQTtBQVhIOztBQWFHO0VBQ0MsY0FBQTtBQVhKOztBQWNHO0VBQ0Msd0JBQUE7RUFDQSxnQkFBQTtBQVpKOztBQWdCRTtFQUNDLFlBQUE7RUFDQSxxQ0FBQTtFQUNBLGtDQUFBO0VBQ0Esa0NBQUE7RUFDQSw0Q0FBQTtFQUNBLGdCQUFBO0VBQ0EsMEJBQUE7QUFkSDs7QUFrQkM7RUFDQyxtQkFBQTtFQUNBLGdCQUFBO0FBaEJGOztBQWtCQztFQUNDLGVBQUE7QUFoQkY7O0FBbUJDO0VBQ0MscUJBQUE7QUFqQkY7O0FBcUJBO0VBQ0MsYUFBQTtFQUNBLGVBQUE7RUFFQSxxQkFBQTtFQUNBLFdBQUE7QUFuQkQ7O0FBcUJDO0VBQ0MsV0FBQTtFQUNBLG1CQUFBO0FBbkJGOztBQXNCQztFQUNDLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7QUFwQkY7O0FBcUJFO0VBQ0MsZUFBQTtFQUNBLGdCQUFBO0FBbkJIOztBQXdCQSw0QkFBQTs7QUFDQTtFQUNJLGFBQUE7RUFDSCxlQUFBO0VBQ0EsbUJBQUE7QUFyQkQ7O0FBd0JBO0VBQ0MsU0FBQTtBQXJCRDs7QUF3QkE7RUFDQyxjQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtFQUNBLHNCQUFBO0FBckJEOztBQXlCQTtFQUNDLG1CQUFBO0VBQ0EsbUJBQUE7QUF0QkQ7O0FBeUJBO0VBQ0MsMkRBQUE7QUF0QkQ7O0FBeUJBLFVBQUE7O0FBQ0E7Ozs7Ozs7Ozs7OztHQUFBOztBQW1CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUFBIiwiZmlsZSI6ImxvZ2luLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmZ1dHVyYS1tZC1idC1ib2xke1xyXG5cdGZvbnQtZmFtaWx5OiBGdXR1cmEtTUQtQlQtQm9sZCwgXCJWZXJkYW5hLUJvbGRcIiwgc2Fucy1zZXJpZjtcclxufVxyXG5cclxuLmFsZXJ0LWRhbmdlciB7XHJcbiAgICBjb2xvcjogI2ZmZmZmZjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNCODNGMzg7XHJcblx0Ym9yZGVyOiBub25lO1xyXG59XHJcblxyXG4uZ2VuZXJhbC1mb250e1xyXG5cdGZvbnQtZmFtaWx5OiB2YXIoLS1nZW5lcmFsLWZvbnQtZmFtaWx5KTtcclxufVxyXG5cclxuLmJ0bi1jbG9zZTpob3ZlcntcclxuXHRiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWwsJTNjc3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDE2IDE2JyBmaWxsPSclMjMwMDAnJTNlJTNjcGF0aCBkPSdNLjI5My4yOTNhMSAxIDAgMDExLjQxNCAwTDggNi41ODYgMTQuMjkzLjI5M2ExIDEgMCAxMTEuNDE0IDEuNDE0TDkuNDE0IDhsNi4yOTMgNi4yOTNhMSAxIDAgMDEtMS40MTQgMS40MTRMOCA5LjQxNGwtNi4yOTMgNi4yOTNhMSAxIDAgMDEtMS40MTQtMS40MTRMNi41ODYgOCAuMjkzIDEuNzA3YTEgMSAwIDAxMC0xLjQxNHonLyUzZSUzYy9zdmclM2VcIikgY2VudGVyLzFlbSBhdXRvIG5vLXJlcGVhdDtcclxufVxyXG5cclxuLm1haW4tYmFja2dyb3VuZHtcclxuXHRwb3NpdGlvbjogYWJzb2x1dGU7XHJcblx0dG9wOiAwO1xyXG5cdGxlZnQ6IDA7XHJcblx0cmlnaHQ6IDA7XHJcblx0Ym90dG9tOiAwO1xyXG5cdG9iamVjdC1maXQ6IGNvdmVyO1xyXG5cdC5jb2xvci1vdmVybGF5e1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0dG9wOiAwO1xyXG5cdFx0bGVmdDogMDtcclxuXHRcdHJpZ2h0OiAwO1xyXG5cdFx0Ym90dG9tOiAwO1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ2wtYmx1ZS1kYXJrLWFscGhhKTtcclxuXHR9XHJcbn1cclxuXHJcbi5vdmVybGF5IHsgXHJcblx0cG9zaXRpb246YWJzb2x1dGU7XHJcblx0ei1pbmRleDoxMjtcclxuXHR3aWR0aDogMTAwJTtcclxuXHRoZWlnaHQ6IDEwMCU7XHJcblx0ZGlzcGxheTogZmxleDtcclxuXHRmbGV4LWRpcmVjdGlvbjogcm93O1xyXG5cdGZsZXgtd3JhcDogd3JhcDtcclxuXHRhbGlnbi1pdGVtczogY2VudGVyO1xyXG5cdG92ZXJmbG93OiB2aXNpYmxlO1xyXG59XHJcblxyXG4ud2VsY29tZS1wYW5lbHtcclxuXHRjb2xvcjogI0ZGRjsgXHJcblx0Zm9udC1zaXplOiA0LjVyZW07ICBcclxuXHRsaW5lLWhlaWdodDo0LjVyZW07XHJcblxyXG5cdC5sb2dvID4gLmxvYWR7XHJcblx0XHR3aWR0aDogMjQwcHg7XHJcblx0XHRoZWlnaHQ6IGF1dG87XHJcblx0fVxyXG5cclxuXHQubG9nby11bmRlcmxpbmV7XHJcblx0XHR3aWR0aDogM2NoO1xyXG5cdFx0aGVpZ2h0OiAwLjI1Y2g7XHJcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1nbC15ZWxsb3cpO1xyXG5cdH1cclxufVxyXG5cclxuLndlbGNvbWUtcGFuZWwsIC5sb2dpbi1wYW5lbHtcclxuXHRwYWRkaW5nLXRvcDogMjB2aDtcclxufVxyXG5cclxuLmxvZ2luLXBhbmVse1xyXG5cdC0taW5wdXQtcmFkaXVzOiAxLjhyZW07XHJcblxyXG5cdC8vbWF4LXdpZHRoOiA0NzVweDtcclxuXHRtYXgtd2lkdGg6IDI2cmVtO1xyXG5cclxuXHRjb2xvcjogI2ZmZjtcclxuXHJcblx0LmlucHV0LWhlYWRlciBzcGFue1xyXG5cdFx0cGFkZGluZy1sZWZ0OiB2YXIoLS1pbnB1dC1yYWRpdXMpO1xyXG5cdFx0Zm9udC1zaXplOiAxLjI1cmVtO1xyXG5cdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XHJcblx0fVxyXG5cclxuXHQuYWxlcnQtZGFuZ2Vye1xyXG5cdFx0Ym9yZGVyLXJhZGl1czogdmFyKC0taW5wdXQtcmFkaXVzKTtcclxuXHRcdHBhZGRpbmctbGVmdDogdmFyKC0taW5wdXQtcmFkaXVzKTtcclxuXHJcblx0XHQuYnRuLWNsb3NlLWNvbnRhaW5lcntcclxuXHRcdFx0aGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHR3aWR0aDogMS4xMjVyZW07XHJcblx0XHRcdGRpc3BsYXk6IGZsZXg7XHJcblx0XHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcblx0XHRcdG92ZXJmbG93LXg6IHZpc2libGU7XHJcblx0XHRcdHBhZGRpbmctbGVmdDogMS4xMjVyZW07XHJcblxyXG5cdFx0XHQuYnRuLWNsb3Nle1xyXG5cdFx0XHRcdHBvc2l0aW9uOiBzdGF0aWM7XHJcblx0XHRcdFx0cGFkZGluZzogMDtcclxuXHRcdFx0XHRtYXJnaW4tcmlnaHQ6IC0xLjEyNXJlbTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGJ1dHRvbi5idG4tY2xvc2U6Zm9jdXMge1xyXG5cdFx0XHRvdXRsaW5lOiBub25lICFpbXBvcnRhbnQ7XHJcblx0XHRcdGJveC1zaGFkb3c6IG5vbmU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmb3Jte1xyXG5cdFx0PiBpbnB1dFt0eXBlPVwidGV4dFwiXSwgaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJde1xyXG5cdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1nbC1ibHVlLWRhcmstYWxwaGEpO1xyXG5cdFx0XHRjb2xvcjogI2ZmZmZmZjtcclxuXHRcdFx0aGVpZ2h0OiBjYWxjKHZhcigtLWlucHV0LXJhZGl1cykgKiAyKTtcclxuXHRcdFx0Ym9yZGVyOiAxcHggc29saWQgd2hpdGU7XHJcblx0XHRcdGJvcmRlci1yYWRpdXM6IHZhcigtLWlucHV0LXJhZGl1cyk7XHJcblx0XHRcdHBhZGRpbmc6IHZhcigtLWlucHV0LXJhZGl1cyk7XHJcblx0XHRcdC8vZm9udC1zaXplOiBjYWxjKHZhcigtLWlucHV0LXJhZGl1cykgKiAyIC8gMyk7XHJcblx0XHRcdGZvbnQtc2l6ZTogY2FsYyh2YXIoLS1pbnB1dC1yYWRpdXMpICogMyAvIDUpO1xyXG5cdFxyXG5cdFx0XHQmOjpwbGFjZWhvbGRlcntcclxuXHRcdFx0XHRjb2xvcjogIzkxZDhmNztcclxuXHRcdFx0fVxyXG5cdFxyXG5cdFx0XHQmOmZvY3VzIHtcclxuXHRcdFx0XHRvdXRsaW5lOiBub25lICFpbXBvcnRhbnQ7XHJcblx0XHRcdFx0Ym94LXNoYWRvdzogbm9uZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdD4gYnV0dG9ue1xyXG5cdFx0XHRib3JkZXI6IG5vbmU7XHJcblx0XHRcdGhlaWdodDogY2FsYyh2YXIoLS1pbnB1dC1yYWRpdXMpICogMik7XHJcblx0XHRcdGJvcmRlci1yYWRpdXM6IHZhcigtLWlucHV0LXJhZGl1cyk7XHJcblx0XHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdsLXllbGxvdyk7XHJcblx0XHRcdGZvbnQtc2l6ZTogY2FsYyh2YXIoLS1pbnB1dC1yYWRpdXMpICogMiAvIDMpO1xyXG5cdFx0XHRmb250LXdlaWdodDogNTAwO1xyXG5cdFx0XHRjb2xvcjogdmFyKC0tZ2wtYmx1ZS1kYXJrKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC5pbnB1dC1mb3Jnb3R7XHJcblx0XHRmb250LXNpemU6IDEuMTI1cmVtO1xyXG5cdFx0Zm9udC13ZWlnaHQ6IDUwMDtcclxuXHR9XHJcblx0LmlucHV0LWNvbnRhY3R7XHJcblx0XHRmb250LXNpemU6IDFyZW07XHJcblx0fVxyXG5cclxuXHQuaW5wdXQtZm9vdGVye1xyXG5cdFx0bGluZS1oZWlnaHQ6IDEuMTI1cmVtO1xyXG5cdH1cclxufVxyXG5cclxuLm92ZXJsYXktZm9vdGVye1xyXG5cdGRpc3BsYXk6IGZsZXg7XHJcblx0ZmxleC13cmFwOiB3cmFwO1xyXG5cdC8vYWxpZ24tY29udGVudDogZmxleC1lbmQ7XHJcblx0YWxpZ24tY29udGVudDogY2VudGVyO1xyXG5cdHdpZHRoOiAxMDAlOyBcclxuXHQvL2hlaWdodDogMTh2aDsgXHJcblx0cCB7XHJcblx0XHRjb2xvcjogI2ZmZjsgXHJcblx0XHRmb250LXNpemU6IDEuMTI1cmVtOyBcclxuXHR9XHJcblxyXG5cdC5jZXJ0aWYtbG9nb3MtY29udGFpbmVye1xyXG5cdFx0Y29sdW1uLWdhcDogNHZ3O1xyXG5cdFx0cm93LWdhcDogMC43NXJlbTtcclxuXHRcdHBhZGRpbmctbGVmdDogNC41JTsgXHJcblx0XHRwYWRkaW5nLXJpZ2h0OiA0LjUlO1xyXG5cdFx0aW1nIHtcclxuXHRcdFx0bWF4LXdpZHRoOiA4cmVtO1xyXG5cdFx0XHRtYXgtaGVpZ2h0OiA0cmVtO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLypBbGluZWFtaWVudG8gZGVsIGNoZWNrYm94Ki9cclxubGFiZWx7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG5cdGNvbHVtbi1nYXA6IDVweDtcclxuXHRhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG5wIHtcclxuXHRtYXJnaW46IDA7XHJcbn1cclxuXHJcbi5vay1idG57XHJcblx0Y29sb3I6I2ZmZmZmZjsgXHJcblx0YmFja2dyb3VuZC1jb2xvcjogIzc2QzA0RTsgXHJcblx0Zm9udC1zaXplOiAxLjc1cmVtOyBcclxuXHRwYWRkaW5nOiAwLjZyZW0gMi41cmVtOyBcclxuXHRcclxufVxyXG5cclxuLmRlbW8tYnRue1xyXG5cdG1hcmdpbi10b3A6IDEuMjVyZW07XHJcblx0bWFyZ2luLWJvdHRvbTogNHJlbTtcclxufVxyXG5cclxuYnV0dG9uOmhvdmVye1xyXG5cdGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChyZ2JhKDAsIDAsIDAsIDAuMTI1KSAwIDApO1xyXG59XHJcblxyXG4vKlNwaW5uZXIqL1xyXG4vKiAubG9hZGluZy1zcGlubmVyIHtcclxuXHRiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDAuOCk7XHJcblx0Y29sb3I6ICNmZmY7XHJcblx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdHotaW5kZXg6IDIwO1xyXG5cdGRpc3BsYXk6IGZsZXg7XHJcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcclxuXHR3aWR0aDogMTAwJTtcclxuXHRoZWlnaHQ6IDEwMCU7XHJcblx0ZGlzcGxheTogZmxleDtcclxuXHRmbGV4LWZsb3c6IGNvbHVtbjtcclxufSAqL1xyXG5cclxuXHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAxMjgwcHgpe1xyXG59XHJcblxyXG4vKiBAbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAxMjAwcHgpe1xyXG5cdC5sZWZ0LWJhY2tncm91bmR7XHJcblx0XHRtYXNrLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XHJcblx0XHQtLXdlYmtpdC1tYXNrLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XHJcblx0fVxyXG5cdC5sZWZ0LWJhY2tncm91bmQgPiBpbWcge1xyXG5cdFx0aGVpZ2h0OiA5Ni4xdmggIWltcG9ydGFudDtcclxuXHR9XHJcblxyXG5cclxuXHQubWFpbi1iYWNrZ3JvdW5ke1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogIzMyNEI4MSAhaW1wb3J0YW50O1xyXG5cdH1cclxuXHJcblx0Lm92ZXJsYXktaGVhZHtcclxuXHRcdGhlaWdodDogMnZoO1xyXG5cdH1cclxuXHJcblx0Lm92ZXJsYXktYm9keXtcclxuXHRcdGhlaWdodDogOTh2aDtcclxuXHRcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG5cdFx0YWxpZ24tY29udGVudDogZmxleC1zdGFydDtcclxuXHR9XHJcblxyXG5cdC53ZWxjb21lLXBhbmVse1xyXG5cdFx0d2lkdGg6IDEwMCU7XHJcblx0XHRoZWlnaHQ6IDk4dmg7XHJcblx0XHRcclxuXHRcdGRpc3BsYXk6IGZsZXg7XHJcblx0XHRmbGV4LWRpcmVjdGlvbjogcm93O1xyXG5cdFx0ZmxleC13cmFwOiB3cmFwO1xyXG5cdFx0anVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG5cdFx0YWxpZ24tY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuXHRcdHBhZGRpbmc6IDA7XHJcblx0fVxyXG5cclxuXHQubG9naW4tcGFuZWwge1xyXG5cdFx0bWFyZ2luLXRvcDogMTByZW07XHJcblx0XHRwYWRkaW5nOiAwO1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0ei1pbmRleDogMTtcclxuXHR9XHJcblxyXG5cdC53ZWxjb21lLW1lc3NhZ2V7XHJcblx0XHR3aWR0aDogYXV0bztcclxuXHRcdGZvbnQtc2l6ZTogMy41cmVtO1xyXG5cdFx0bGluZS1oZWlnaHQ6IDMuNXJlbTtcclxuXHRcdHRleHQtYWxpZ246IHJpZ2h0O1xyXG5cdFx0cGFkZGluZy1yaWdodDogNCU7XHJcblx0fVxyXG5cclxuXHRAbWVkaWEgc2NyZWVuIGFuZCAobWF4LWhlaWdodDogNzUwcHgpe1xyXG5cdFx0LndlbGNvbWUtbWVzc2FnZXtcclxuXHRcdFx0Zm9udC1zaXplOiAzcmVtO1xyXG5cdFx0XHRsaW5lLWhlaWdodDogM3JlbTtcclxuXHRcdH1cclxuXHJcblx0XHQubG9naW4tcGFuZWx7XHJcblx0XHRcdHRyYW5zZm9ybTogc2NhbGUoMC44NSk7XHJcblx0XHRcdG1hcmdpbi10b3A6IDUuNzVyZW07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRAbWVkaWEgc2NyZWVuIGFuZCAobWF4LWhlaWdodDogNjAwcHgpe1xyXG5cdFx0LndlbGNvbWUtbWVzc2FnZXtcclxuXHRcdFx0Zm9udC1zaXplOiAyLjVyZW07XHJcblx0XHRcdGxpbmUtaGVpZ2h0OiAyLjVyZW07XHJcblx0XHR9XHJcblxyXG5cdFx0LmxvZ2luLXBhbmVse1xyXG5cdFx0XHR0cmFuc2Zvcm06IHNjYWxlKDAuNzUpO1xyXG5cdFx0XHRtYXJnaW4tdG9wOiAzLjVyZW07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQubG9nbyB7XHJcblx0XHR3aWR0aDogMjYlO1xyXG5cdFx0cGFkZGluZy1sZWZ0OiA0JTtcclxuXHR9XHJcblxyXG5cdC5sb2dvID4gaW1ne1xyXG5cdFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcdFxyXG5cdH1cclxuXHJcblx0XHJcblxyXG5cdC53ZWxjb21lLWJvdHRvbXtcclxuXHRcdHdpZHRoOiAxMDAlO1xyXG5cdFx0ZGlzcGxheTogZmxleDtcclxuXHRcdGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcblx0XHRmbGV4LXdyYXA6IHdyYXA7XHJcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHR9XHJcblxyXG5cdC53ZWxjb21lLWZvb3RlcntcclxuXHRcdGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XHJcblx0XHR3aWR0aDogMTAwJTtcclxuXHRcdHBhZGRpbmc6IDEuNXZoIDEuNXZoO1xyXG5cdFx0Y29sb3I6ICM4NDg2ODg7XHJcblx0XHRvcmRlcjogMTtcclxuXHR9XHJcblxyXG5cdC5vay1idG57XHJcblx0XHRmb250LXNpemU6IDFyZW07IFxyXG5cdFx0cGFkZGluZzogMC40cmVtIDEuNzVyZW07IFxyXG5cdH1cclxuXHRcclxufVxyXG5cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogODAwcHgpe1xyXG5cdC53ZWxjb21lLW1lc3NhZ2V7XHJcblx0XHRmb250LXNpemU6IDIuNXJlbTtcclxuXHRcdGxpbmUtaGVpZ2h0OiAyLjVyZW07XHJcblx0fVxyXG59XHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA4MDBweCl7XHJcblx0LmxvZ2luLXBhbmVsIHtcclxuXHRcdHdpZHRoOiA5MCU7XHJcblx0fVxyXG59XHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LWhlaWdodDogODAwcHgpIGFuZCAobWluLXdpZHRoOiAxMjAwcHgpIHtcclxuXHQub3ZlcmxheS1oZWFke1xyXG5cdFx0aGVpZ2h0OiA2dmg7XHJcblx0fVxyXG5cdC53ZWxjb21lLXBhbmVsID4gcCB7XHJcblx0XHRmb250LXNpemU6MS42cmVtO1xyXG5cdH1cclxuXHJcblx0LmxvZ2luLXBhbmVsID4gcCB7XHJcblx0XHRmb250LXNpemU6IDAuOXJlbTtcclxuXHRcdG1hcmdpbi1ib3R0b206IDAuMjVyZW07XHJcblx0fVxyXG5cclxuXHQud2VsY29tZS1tZXNzYWdle1xyXG5cdFx0Zm9udC1zaXplOiAzcmVtO1xyXG5cdFx0bGluZS1oZWlnaHQ6IDNyZW07XHJcblx0fVxyXG5cclxuXHQud2VsY29tZS1mb290ZXJ7XHJcblx0XHRmb250LXNpemU6IDAuODVyZW07IFxyXG5cdFx0bGluZS1oZWlnaHQ6IDAuODVyZW07XHJcblx0fVxyXG5cclxuXHQuZGVtby1idG57XHJcblx0XHRtYXJnaW4tdG9wOiAwLjdyZW07XHJcblx0XHRtYXJnaW4tYm90dG9tOiAyLjJyZW07XHJcblx0XHRmb250LXNpemU6IDEuMTVyZW07XHJcblx0XHRwYWRkaW5nOiAwLjRyZW0gMnJlbTtcclxuXHR9XHJcblx0XHJcblx0Lm92ZXJsYXktZm9vdGVyID4gZGl2ID4gcCB7XHJcblx0XHRmb250LXNpemU6IDFyZW07IFxyXG5cdFx0cGFkZGluZy1ib3R0b206IDAuNXJlbTtcclxuXHR9XHJcblxyXG5cdC5sb2dvID4gLmxvYWR7XHJcblx0XHR3aWR0aDogMTkwcHg7XHJcblx0fVxyXG5cclxuXHQuY2VydGlmLWxvZ29zLWNvbnRhaW5lciA+IGRpdiA+IGltZ3tcclxuXHRcdHRyYW5zZm9ybTogc2NhbGUoMC42KTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LWhlaWdodDogNTUwcHgpIHtcclxuXHRcclxufVxyXG5cclxuXHJcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtaGVpZ2h0OiA4MDBweCkgYW5kIChtYXgtd2lkdGg6IDEyMDBweCkge1xyXG5cdC5vay1idG57XHJcblx0XHRmb250LXNpemU6IDFyZW07IFxyXG5cdFx0cGFkZGluZzogMC4zcmVtIDEuNXJlbTsgXHJcblx0fVxyXG59XHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1NTBweCl7XHJcblx0LndlbGNvbWUtbWVzc2FnZXtcclxuXHRcdGZvbnQtc2l6ZTogMnJlbTtcclxuXHRcdGxpbmUtaGVpZ2h0OiAycmVtO1xyXG5cdH1cclxufVxyXG5cclxuQG1lZGlhIChtaW4tYXNwZWN0LXJhdGlvOiAxNC85KSB7XHJcblx0LmxlZnQtYmFja2dyb3VuZCA+IGltZ3tcclxuXHRcdG9iamVjdC1wb3NpdGlvbjogNDMlIDAgIWltcG9ydGFudDtcclxuXHR9XHJcbiAgfVxyXG5cclxuQG1lZGlhIChtaW4tYXNwZWN0LXJhdGlvOiAzLzIpIHtcclxuXHQubGVmdC1iYWNrZ3JvdW5kID4gaW1ne1xyXG5cdFx0b2JqZWN0LXBvc2l0aW9uOiAyNSUgMCAhaW1wb3J0YW50O1xyXG5cdH1cclxuICB9XHJcblxyXG4gIEBtZWRpYSAobWF4LWFzcGVjdC1yYXRpbzogMy8yKSB7XHJcblx0LmxlZnQtYmFja2dyb3VuZCA+IGltZ3tcclxuXHRcdG9iamVjdC1wb3NpdGlvbjogMTclIDAgIWltcG9ydGFudDtcclxuXHR9XHJcbiAgfSAqLyJdfQ== */"] });


/***/ }),

/***/ "X3zk":
/*!***************************************!*\
  !*** ./src/app/login/login.module.ts ***!
  \***************************************/
/*! exports provided: LoginModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginModule", function() { return LoginModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _login_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login-routing.module */ "euwS");
/* harmony import */ var _components_login_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/login.component */ "V1Ps");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "1kSV");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");






class LoginModule {
}
LoginModule.ɵfac = function LoginModule_Factory(t) { return new (t || LoginModule)(); };
LoginModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({ type: LoginModule });
LoginModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({ imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
            _login_routing_module__WEBPACK_IMPORTED_MODULE_1__["LoginRoutingModule"],
            _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](LoginModule, { declarations: [_components_login_component__WEBPACK_IMPORTED_MODULE_2__["LoginComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
        _login_routing_module__WEBPACK_IMPORTED_MODULE_1__["LoginRoutingModule"],
        _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"]] }); })();


/***/ }),

/***/ "euwS":
/*!***********************************************!*\
  !*** ./src/app/login/login-routing.module.ts ***!
  \***********************************************/
/*! exports provided: LoginRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginRoutingModule", function() { return LoginRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_login_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/login.component */ "V1Ps");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");




const routes = [{ path: '', component: _components_login_component__WEBPACK_IMPORTED_MODULE_1__["LoginComponent"] }];
class LoginRoutingModule {
}
LoginRoutingModule.ɵfac = function LoginRoutingModule_Factory(t) { return new (t || LoginRoutingModule)(); };
LoginRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: LoginRoutingModule });
LoginRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](LoginRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ })

}]);
//# sourceMappingURL=login-login-module.js.map