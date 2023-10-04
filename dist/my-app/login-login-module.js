(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["login-login-module"],{

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
        if (this.loginForm.valid) {
            const params = this.loginForm.value;
            // params['registrador_id'] = params['registrador']['id'];
            this.isLoggingIn = true;
            //console.log(params);
            this.store.dispatch(new src_app_core_store_auth_actions__WEBPACK_IMPORTED_MODULE_2__["SignIn"](params.name, params.password)).subscribe((data) => {
                // Animación de carga de Iniciando sesión...
                this.validCredentials = 1;
                //console.log('Inicio de sesión exitoso');
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
            yield this.userService.setUserInLocalStorage();
            this.router.navigate(['/panel'], {
                state: {
                    //flag para mostrar toast de bienvenida
                    recentLogIn: true,
                }
            });
            this.eventSocketService.user_id = localStorage.getItem('user_id');
            this.vehicleService.initialize();
            this.eventService.getAll();
            this.eventSocketService.listen();
            this.userDataService.getUserData();
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
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_12__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_ba"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"]], styles: [".futura-md-bt-bold[_ngcontent-%COMP%] {\n  font-family: Futura-MD-BT-Bold, \"Verdana-Bold\", sans-serif;\n}\n\n.alert-danger[_ngcontent-%COMP%] {\n  color: #ffffff;\n  background-color: #B83F38;\n  border: none;\n}\n\n.general-font[_ngcontent-%COMP%] {\n  font-family: var(--general-font-family);\n}\n\n.btn-close[_ngcontent-%COMP%]:hover {\n  background: transparent url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e\") center/1em auto no-repeat;\n}\n\n.main-background[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  object-fit: cover;\n}\n\n.main-background[_ngcontent-%COMP%]   .color-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: var(--gl-blue-dark-alpha);\n}\n\n.overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 12;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  align-items: center;\n  overflow: visible;\n}\n\n.welcome-panel[_ngcontent-%COMP%] {\n  color: #FFF;\n  font-size: 4.5rem;\n  line-height: 4.5rem;\n}\n\n.welcome-panel[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]    > .load[_ngcontent-%COMP%] {\n  width: 240px;\n  height: auto;\n}\n\n.welcome-panel[_ngcontent-%COMP%]   .logo-underline[_ngcontent-%COMP%] {\n  width: 3ch;\n  height: 0.25ch;\n  background-color: var(--gl-yellow);\n}\n\n.welcome-panel[_ngcontent-%COMP%], .login-panel[_ngcontent-%COMP%] {\n  padding-top: 20vh;\n}\n\n.login-panel[_ngcontent-%COMP%] {\n  --input-radius: 1.8rem;\n  max-width: 26rem;\n  color: #fff;\n}\n\n.login-panel[_ngcontent-%COMP%]   .input-header[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  padding-left: var(--input-radius);\n  font-size: 1.25rem;\n  font-weight: bold;\n}\n\n.login-panel[_ngcontent-%COMP%]   .alert-danger[_ngcontent-%COMP%] {\n  border-radius: var(--input-radius);\n  padding-left: var(--input-radius);\n}\n\n.login-panel[_ngcontent-%COMP%]   .alert-danger[_ngcontent-%COMP%]   .btn-close-container[_ngcontent-%COMP%] {\n  height: 100%;\n  width: 1.125rem;\n  display: flex;\n  align-items: center;\n  overflow-x: visible;\n  padding-left: 1.125rem;\n}\n\n.login-panel[_ngcontent-%COMP%]   .alert-danger[_ngcontent-%COMP%]   .btn-close-container[_ngcontent-%COMP%]   .btn-close[_ngcontent-%COMP%] {\n  position: static;\n  padding: 0;\n  margin-right: -1.125rem;\n}\n\n.login-panel[_ngcontent-%COMP%]   .alert-danger[_ngcontent-%COMP%]   button.btn-close[_ngcontent-%COMP%]:focus {\n  outline: none !important;\n  box-shadow: none;\n}\n\n.login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > input[type=text][_ngcontent-%COMP%], .login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%] {\n  background-color: var(--gl-blue-dark-alpha);\n  color: #ffffff;\n  height: calc(var(--input-radius) * 2);\n  border: 1px solid white;\n  border-radius: var(--input-radius);\n  padding: var(--input-radius);\n  font-size: calc(var(--input-radius) * 3 / 5);\n}\n\n.login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > input[type=text][_ngcontent-%COMP%]::placeholder, .login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%]::placeholder {\n  color: #91d8f7;\n}\n\n.login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > input[type=text][_ngcontent-%COMP%]:focus, .login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%]:focus {\n  outline: none !important;\n  box-shadow: none;\n}\n\n.login-panel[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > button[_ngcontent-%COMP%] {\n  border: none;\n  height: calc(var(--input-radius) * 2);\n  border-radius: var(--input-radius);\n  background-color: var(--gl-yellow);\n  font-size: calc(var(--input-radius) * 2 / 3);\n  font-weight: 500;\n  color: var(--gl-blue-dark);\n}\n\n.login-panel[_ngcontent-%COMP%]   .input-forgot[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  font-weight: 500;\n}\n\n.login-panel[_ngcontent-%COMP%]   .input-contact[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n\n.login-panel[_ngcontent-%COMP%]   .input-footer[_ngcontent-%COMP%] {\n  line-height: 1.125rem;\n}\n\n.overlay-footer[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: center;\n  width: 100%;\n}\n\n.overlay-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 1.125rem;\n}\n\n.overlay-footer[_ngcontent-%COMP%]   .certif-logos-container[_ngcontent-%COMP%] {\n  column-gap: 4vw;\n  row-gap: 0.75rem;\n  padding-left: 4.5%;\n  padding-right: 4.5%;\n}\n\n.overlay-footer[_ngcontent-%COMP%]   .certif-logos-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 8rem;\n  max-height: 4rem;\n}\n\n\n\nlabel[_ngcontent-%COMP%] {\n  display: flex;\n  column-gap: 5px;\n  align-items: center;\n}\n\np[_ngcontent-%COMP%] {\n  margin: 0;\n}\n\n.ok-btn[_ngcontent-%COMP%] {\n  color: #ffffff;\n  background-color: #76C04E;\n  font-size: 1.75rem;\n  padding: 0.6rem 2.5rem;\n}\n\n.demo-btn[_ngcontent-%COMP%] {\n  margin-top: 1.25rem;\n  margin-bottom: 4rem;\n}\n\nbutton[_ngcontent-%COMP%]:hover {\n  background-image: linear-gradient(rgba(0, 0, 0, 0.125) 0 0);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Fzc2V0cy9pbWFnZXMvb2JqZWN0cy9udWV2by9sb2dpbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNDLDBEQUFBO0FBQ0Q7O0FBRUE7RUFDSSxjQUFBO0VBQ0EseUJBQUE7RUFDSCxZQUFBO0FBQ0Q7O0FBRUE7RUFDQyx1Q0FBQTtBQUNEOztBQUVBO0VBQ0MsMldBQUE7QUFDRDs7QUFFQTtFQUNDLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLGlCQUFBO0FBQ0Q7O0FBQUM7RUFDQyxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSwyQ0FBQTtBQUVGOztBQUVBO0VBQ0Msa0JBQUE7RUFDQSxXQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQkFBQTtBQUNEOztBQUVBO0VBQ0MsV0FBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7QUFDRDs7QUFDQztFQUNDLFlBQUE7RUFDQSxZQUFBO0FBQ0Y7O0FBRUM7RUFDQyxVQUFBO0VBQ0EsY0FBQTtFQUNBLGtDQUFBO0FBQUY7O0FBSUE7RUFDQyxpQkFBQTtBQUREOztBQUlBO0VBQ0Msc0JBQUE7RUFHQSxnQkFBQTtFQUVBLFdBQUE7QUFKRDs7QUFNQztFQUNDLGlDQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtBQUpGOztBQU9DO0VBQ0Msa0NBQUE7RUFDQSxpQ0FBQTtBQUxGOztBQU9FO0VBQ0MsWUFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLHNCQUFBO0FBTEg7O0FBT0c7RUFDQyxnQkFBQTtFQUNBLFVBQUE7RUFDQSx1QkFBQTtBQUxKOztBQVNFO0VBQ0Msd0JBQUE7RUFDQSxnQkFBQTtBQVBIOztBQVlFO0VBQ0MsMkNBQUE7RUFDQSxjQUFBO0VBQ0EscUNBQUE7RUFDQSx1QkFBQTtFQUNBLGtDQUFBO0VBQ0EsNEJBQUE7RUFFQSw0Q0FBQTtBQVhIOztBQWFHO0VBQ0MsY0FBQTtBQVhKOztBQWNHO0VBQ0Msd0JBQUE7RUFDQSxnQkFBQTtBQVpKOztBQWdCRTtFQUNDLFlBQUE7RUFDQSxxQ0FBQTtFQUNBLGtDQUFBO0VBQ0Esa0NBQUE7RUFDQSw0Q0FBQTtFQUNBLGdCQUFBO0VBQ0EsMEJBQUE7QUFkSDs7QUFrQkM7RUFDQyxtQkFBQTtFQUNBLGdCQUFBO0FBaEJGOztBQWtCQztFQUNDLGVBQUE7QUFoQkY7O0FBbUJDO0VBQ0MscUJBQUE7QUFqQkY7O0FBcUJBO0VBQ0MsYUFBQTtFQUNBLGVBQUE7RUFFQSxxQkFBQTtFQUNBLFdBQUE7QUFuQkQ7O0FBcUJDO0VBQ0MsV0FBQTtFQUNBLG1CQUFBO0FBbkJGOztBQXNCQztFQUNDLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7QUFwQkY7O0FBcUJFO0VBQ0MsZUFBQTtFQUNBLGdCQUFBO0FBbkJIOztBQXdCQSw0QkFBQTs7QUFDQTtFQUNJLGFBQUE7RUFDSCxlQUFBO0VBQ0EsbUJBQUE7QUFyQkQ7O0FBd0JBO0VBQ0MsU0FBQTtBQXJCRDs7QUF3QkE7RUFDQyxjQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtFQUNBLHNCQUFBO0FBckJEOztBQXlCQTtFQUNDLG1CQUFBO0VBQ0EsbUJBQUE7QUF0QkQ7O0FBeUJBO0VBQ0MsMkRBQUE7QUF0QkQ7O0FBeUJBLFVBQUE7O0FBQ0E7Ozs7Ozs7Ozs7OztHQUFBOztBQW1CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUFBIiwiZmlsZSI6ImxvZ2luLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmZ1dHVyYS1tZC1idC1ib2xke1xuXHRmb250LWZhbWlseTogRnV0dXJhLU1ELUJULUJvbGQsIFwiVmVyZGFuYS1Cb2xkXCIsIHNhbnMtc2VyaWY7XG59XG5cbi5hbGVydC1kYW5nZXIge1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNCODNGMzg7XG5cdGJvcmRlcjogbm9uZTtcbn1cblxuLmdlbmVyYWwtZm9udHtcblx0Zm9udC1mYW1pbHk6IHZhcigtLWdlbmVyYWwtZm9udC1mYW1pbHkpO1xufVxuXG4uYnRuLWNsb3NlOmhvdmVye1xuXHRiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWwsJTNjc3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDE2IDE2JyBmaWxsPSclMjMwMDAnJTNlJTNjcGF0aCBkPSdNLjI5My4yOTNhMSAxIDAgMDExLjQxNCAwTDggNi41ODYgMTQuMjkzLjI5M2ExIDEgMCAxMTEuNDE0IDEuNDE0TDkuNDE0IDhsNi4yOTMgNi4yOTNhMSAxIDAgMDEtMS40MTQgMS40MTRMOCA5LjQxNGwtNi4yOTMgNi4yOTNhMSAxIDAgMDEtMS40MTQtMS40MTRMNi41ODYgOCAuMjkzIDEuNzA3YTEgMSAwIDAxMC0xLjQxNHonLyUzZSUzYy9zdmclM2VcIikgY2VudGVyLzFlbSBhdXRvIG5vLXJlcGVhdDtcbn1cblxuLm1haW4tYmFja2dyb3VuZHtcblx0cG9zaXRpb246IGFic29sdXRlO1xuXHR0b3A6IDA7XG5cdGxlZnQ6IDA7XG5cdHJpZ2h0OiAwO1xuXHRib3R0b206IDA7XG5cdG9iamVjdC1maXQ6IGNvdmVyO1xuXHQuY29sb3Itb3ZlcmxheXtcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0dG9wOiAwO1xuXHRcdGxlZnQ6IDA7XG5cdFx0cmlnaHQ6IDA7XG5cdFx0Ym90dG9tOiAwO1xuXHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdsLWJsdWUtZGFyay1hbHBoYSk7XG5cdH1cbn1cblxuLm92ZXJsYXkgeyBcblx0cG9zaXRpb246YWJzb2x1dGU7XG5cdHotaW5kZXg6MTI7XG5cdHdpZHRoOiAxMDAlO1xuXHRoZWlnaHQ6IDEwMCU7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiByb3c7XG5cdGZsZXgtd3JhcDogd3JhcDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0b3ZlcmZsb3c6IHZpc2libGU7XG59XG5cbi53ZWxjb21lLXBhbmVse1xuXHRjb2xvcjogI0ZGRjsgXG5cdGZvbnQtc2l6ZTogNC41cmVtOyAgXG5cdGxpbmUtaGVpZ2h0OjQuNXJlbTtcblxuXHQubG9nbyA+IC5sb2Fke1xuXHRcdHdpZHRoOiAyNDBweDtcblx0XHRoZWlnaHQ6IGF1dG87XG5cdH1cblxuXHQubG9nby11bmRlcmxpbmV7XG5cdFx0d2lkdGg6IDNjaDtcblx0XHRoZWlnaHQ6IDAuMjVjaDtcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1nbC15ZWxsb3cpO1xuXHR9XG59XG5cbi53ZWxjb21lLXBhbmVsLCAubG9naW4tcGFuZWx7XG5cdHBhZGRpbmctdG9wOiAyMHZoO1xufVxuXG4ubG9naW4tcGFuZWx7XG5cdC0taW5wdXQtcmFkaXVzOiAxLjhyZW07XG5cblx0Ly9tYXgtd2lkdGg6IDQ3NXB4O1xuXHRtYXgtd2lkdGg6IDI2cmVtO1xuXG5cdGNvbG9yOiAjZmZmO1xuXG5cdC5pbnB1dC1oZWFkZXIgc3Bhbntcblx0XHRwYWRkaW5nLWxlZnQ6IHZhcigtLWlucHV0LXJhZGl1cyk7XG5cdFx0Zm9udC1zaXplOiAxLjI1cmVtO1xuXHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHR9XG5cblx0LmFsZXJ0LWRhbmdlcntcblx0XHRib3JkZXItcmFkaXVzOiB2YXIoLS1pbnB1dC1yYWRpdXMpO1xuXHRcdHBhZGRpbmctbGVmdDogdmFyKC0taW5wdXQtcmFkaXVzKTtcblxuXHRcdC5idG4tY2xvc2UtY29udGFpbmVye1xuXHRcdFx0aGVpZ2h0OiAxMDAlO1xuXHRcdFx0d2lkdGg6IDEuMTI1cmVtO1xuXHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdFx0XHRvdmVyZmxvdy14OiB2aXNpYmxlO1xuXHRcdFx0cGFkZGluZy1sZWZ0OiAxLjEyNXJlbTtcblxuXHRcdFx0LmJ0bi1jbG9zZXtcblx0XHRcdFx0cG9zaXRpb246IHN0YXRpYztcblx0XHRcdFx0cGFkZGluZzogMDtcblx0XHRcdFx0bWFyZ2luLXJpZ2h0OiAtMS4xMjVyZW07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0YnV0dG9uLmJ0bi1jbG9zZTpmb2N1cyB7XG5cdFx0XHRvdXRsaW5lOiBub25lICFpbXBvcnRhbnQ7XG5cdFx0XHRib3gtc2hhZG93OiBub25lO1xuXHRcdH1cblx0fVxuXG5cdGZvcm17XG5cdFx0PiBpbnB1dFt0eXBlPVwidGV4dFwiXSwgaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJde1xuXHRcdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ2wtYmx1ZS1kYXJrLWFscGhhKTtcblx0XHRcdGNvbG9yOiAjZmZmZmZmO1xuXHRcdFx0aGVpZ2h0OiBjYWxjKHZhcigtLWlucHV0LXJhZGl1cykgKiAyKTtcblx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xuXHRcdFx0Ym9yZGVyLXJhZGl1czogdmFyKC0taW5wdXQtcmFkaXVzKTtcblx0XHRcdHBhZGRpbmc6IHZhcigtLWlucHV0LXJhZGl1cyk7XG5cdFx0XHQvL2ZvbnQtc2l6ZTogY2FsYyh2YXIoLS1pbnB1dC1yYWRpdXMpICogMiAvIDMpO1xuXHRcdFx0Zm9udC1zaXplOiBjYWxjKHZhcigtLWlucHV0LXJhZGl1cykgKiAzIC8gNSk7XG5cdFxuXHRcdFx0Jjo6cGxhY2Vob2xkZXJ7XG5cdFx0XHRcdGNvbG9yOiAjOTFkOGY3O1xuXHRcdFx0fVxuXHRcblx0XHRcdCY6Zm9jdXMge1xuXHRcdFx0XHRvdXRsaW5lOiBub25lICFpbXBvcnRhbnQ7XG5cdFx0XHRcdGJveC1zaGFkb3c6IG5vbmU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0PiBidXR0b257XG5cdFx0XHRib3JkZXI6IG5vbmU7XG5cdFx0XHRoZWlnaHQ6IGNhbGModmFyKC0taW5wdXQtcmFkaXVzKSAqIDIpO1xuXHRcdFx0Ym9yZGVyLXJhZGl1czogdmFyKC0taW5wdXQtcmFkaXVzKTtcblx0XHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdsLXllbGxvdyk7XG5cdFx0XHRmb250LXNpemU6IGNhbGModmFyKC0taW5wdXQtcmFkaXVzKSAqIDIgLyAzKTtcblx0XHRcdGZvbnQtd2VpZ2h0OiA1MDA7XG5cdFx0XHRjb2xvcjogdmFyKC0tZ2wtYmx1ZS1kYXJrKTtcblx0XHR9XG5cdH1cblxuXHQuaW5wdXQtZm9yZ290e1xuXHRcdGZvbnQtc2l6ZTogMS4xMjVyZW07XG5cdFx0Zm9udC13ZWlnaHQ6IDUwMDtcblx0fVxuXHQuaW5wdXQtY29udGFjdHtcblx0XHRmb250LXNpemU6IDFyZW07XG5cdH1cblxuXHQuaW5wdXQtZm9vdGVye1xuXHRcdGxpbmUtaGVpZ2h0OiAxLjEyNXJlbTtcblx0fVxufVxuXG4ub3ZlcmxheS1mb290ZXJ7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtd3JhcDogd3JhcDtcblx0Ly9hbGlnbi1jb250ZW50OiBmbGV4LWVuZDtcblx0YWxpZ24tY29udGVudDogY2VudGVyO1xuXHR3aWR0aDogMTAwJTsgXG5cdC8vaGVpZ2h0OiAxOHZoOyBcblx0cCB7XG5cdFx0Y29sb3I6ICNmZmY7IFxuXHRcdGZvbnQtc2l6ZTogMS4xMjVyZW07IFxuXHR9XG5cblx0LmNlcnRpZi1sb2dvcy1jb250YWluZXJ7XG5cdFx0Y29sdW1uLWdhcDogNHZ3O1xuXHRcdHJvdy1nYXA6IDAuNzVyZW07XG5cdFx0cGFkZGluZy1sZWZ0OiA0LjUlOyBcblx0XHRwYWRkaW5nLXJpZ2h0OiA0LjUlO1xuXHRcdGltZyB7XG5cdFx0XHRtYXgtd2lkdGg6IDhyZW07XG5cdFx0XHRtYXgtaGVpZ2h0OiA0cmVtO1xuXHRcdH1cblx0fVxufVxuXG4vKkFsaW5lYW1pZW50byBkZWwgY2hlY2tib3gqL1xubGFiZWx7XG4gICAgZGlzcGxheTogZmxleDtcblx0Y29sdW1uLWdhcDogNXB4O1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG5wIHtcblx0bWFyZ2luOiAwO1xufVxuXG4ub2stYnRue1xuXHRjb2xvcjojZmZmZmZmOyBcblx0YmFja2dyb3VuZC1jb2xvcjogIzc2QzA0RTsgXG5cdGZvbnQtc2l6ZTogMS43NXJlbTsgXG5cdHBhZGRpbmc6IDAuNnJlbSAyLjVyZW07IFxuXHRcbn1cblxuLmRlbW8tYnRue1xuXHRtYXJnaW4tdG9wOiAxLjI1cmVtO1xuXHRtYXJnaW4tYm90dG9tOiA0cmVtO1xufVxuXG5idXR0b246aG92ZXJ7XG5cdGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChyZ2JhKDAsIDAsIDAsIDAuMTI1KSAwIDApO1xufVxuXG4vKlNwaW5uZXIqL1xuLyogLmxvYWRpbmctc3Bpbm5lciB7XG5cdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMC44KTtcblx0Y29sb3I6ICNmZmY7XG5cdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0ei1pbmRleDogMjA7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHR3aWR0aDogMTAwJTtcblx0aGVpZ2h0OiAxMDAlO1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWZsb3c6IGNvbHVtbjtcbn0gKi9cblxuXG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDEyODBweCl7XG59XG5cbi8qIEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDEyMDBweCl7XG5cdC5sZWZ0LWJhY2tncm91bmR7XG5cdFx0bWFzay1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xuXHRcdC0td2Via2l0LW1hc2staW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcblx0fVxuXHQubGVmdC1iYWNrZ3JvdW5kID4gaW1nIHtcblx0XHRoZWlnaHQ6IDk2LjF2aCAhaW1wb3J0YW50O1xuXHR9XG5cblxuXHQubWFpbi1iYWNrZ3JvdW5ke1xuXHRcdGJhY2tncm91bmQtY29sb3I6ICMzMjRCODEgIWltcG9ydGFudDtcblx0fVxuXG5cdC5vdmVybGF5LWhlYWR7XG5cdFx0aGVpZ2h0OiAydmg7XG5cdH1cblxuXHQub3ZlcmxheS1ib2R5e1xuXHRcdGhlaWdodDogOTh2aDtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0XHRhbGlnbi1jb250ZW50OiBmbGV4LXN0YXJ0O1xuXHR9XG5cblx0LndlbGNvbWUtcGFuZWx7XG5cdFx0d2lkdGg6IDEwMCU7XG5cdFx0aGVpZ2h0OiA5OHZoO1xuXHRcdFxuXHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0ZmxleC1kaXJlY3Rpb246IHJvdztcblx0XHRmbGV4LXdyYXA6IHdyYXA7XG5cdFx0anVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXHRcdGFsaWduLWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cdFx0cGFkZGluZzogMDtcblx0fVxuXG5cdC5sb2dpbi1wYW5lbCB7XG5cdFx0bWFyZ2luLXRvcDogMTByZW07XG5cdFx0cGFkZGluZzogMDtcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0ei1pbmRleDogMTtcblx0fVxuXG5cdC53ZWxjb21lLW1lc3NhZ2V7XG5cdFx0d2lkdGg6IGF1dG87XG5cdFx0Zm9udC1zaXplOiAzLjVyZW07XG5cdFx0bGluZS1oZWlnaHQ6IDMuNXJlbTtcblx0XHR0ZXh0LWFsaWduOiByaWdodDtcblx0XHRwYWRkaW5nLXJpZ2h0OiA0JTtcblx0fVxuXG5cdEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtaGVpZ2h0OiA3NTBweCl7XG5cdFx0LndlbGNvbWUtbWVzc2FnZXtcblx0XHRcdGZvbnQtc2l6ZTogM3JlbTtcblx0XHRcdGxpbmUtaGVpZ2h0OiAzcmVtO1xuXHRcdH1cblxuXHRcdC5sb2dpbi1wYW5lbHtcblx0XHRcdHRyYW5zZm9ybTogc2NhbGUoMC44NSk7XG5cdFx0XHRtYXJnaW4tdG9wOiA1Ljc1cmVtO1xuXHRcdH1cblx0fVxuXG5cdEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtaGVpZ2h0OiA2MDBweCl7XG5cdFx0LndlbGNvbWUtbWVzc2FnZXtcblx0XHRcdGZvbnQtc2l6ZTogMi41cmVtO1xuXHRcdFx0bGluZS1oZWlnaHQ6IDIuNXJlbTtcblx0XHR9XG5cblx0XHQubG9naW4tcGFuZWx7XG5cdFx0XHR0cmFuc2Zvcm06IHNjYWxlKDAuNzUpO1xuXHRcdFx0bWFyZ2luLXRvcDogMy41cmVtO1xuXHRcdH1cblx0fVxuXG5cdC5sb2dvIHtcblx0XHR3aWR0aDogMjYlO1xuXHRcdHBhZGRpbmctbGVmdDogNCU7XG5cdH1cblxuXHQubG9nbyA+IGltZ3tcblx0XHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1x0XG5cdH1cblxuXHRcblxuXHQud2VsY29tZS1ib3R0b217XG5cdFx0d2lkdGg6IDEwMCU7XG5cdFx0ZGlzcGxheTogZmxleDtcblx0XHRmbGV4LWRpcmVjdGlvbjogcm93O1xuXHRcdGZsZXgtd3JhcDogd3JhcDtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0fVxuXG5cdC53ZWxjb21lLWZvb3Rlcntcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xuXHRcdHdpZHRoOiAxMDAlO1xuXHRcdHBhZGRpbmc6IDEuNXZoIDEuNXZoO1xuXHRcdGNvbG9yOiAjODQ4Njg4O1xuXHRcdG9yZGVyOiAxO1xuXHR9XG5cblx0Lm9rLWJ0bntcblx0XHRmb250LXNpemU6IDFyZW07IFxuXHRcdHBhZGRpbmc6IDAuNHJlbSAxLjc1cmVtOyBcblx0fVxuXHRcbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogODAwcHgpe1xuXHQud2VsY29tZS1tZXNzYWdle1xuXHRcdGZvbnQtc2l6ZTogMi41cmVtO1xuXHRcdGxpbmUtaGVpZ2h0OiAyLjVyZW07XG5cdH1cbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogODAwcHgpe1xuXHQubG9naW4tcGFuZWwge1xuXHRcdHdpZHRoOiA5MCU7XG5cdH1cbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC1oZWlnaHQ6IDgwMHB4KSBhbmQgKG1pbi13aWR0aDogMTIwMHB4KSB7XG5cdC5vdmVybGF5LWhlYWR7XG5cdFx0aGVpZ2h0OiA2dmg7XG5cdH1cblx0LndlbGNvbWUtcGFuZWwgPiBwIHtcblx0XHRmb250LXNpemU6MS42cmVtO1xuXHR9XG5cblx0LmxvZ2luLXBhbmVsID4gcCB7XG5cdFx0Zm9udC1zaXplOiAwLjlyZW07XG5cdFx0bWFyZ2luLWJvdHRvbTogMC4yNXJlbTtcblx0fVxuXG5cdC53ZWxjb21lLW1lc3NhZ2V7XG5cdFx0Zm9udC1zaXplOiAzcmVtO1xuXHRcdGxpbmUtaGVpZ2h0OiAzcmVtO1xuXHR9XG5cblx0LndlbGNvbWUtZm9vdGVye1xuXHRcdGZvbnQtc2l6ZTogMC44NXJlbTsgXG5cdFx0bGluZS1oZWlnaHQ6IDAuODVyZW07XG5cdH1cblxuXHQuZGVtby1idG57XG5cdFx0bWFyZ2luLXRvcDogMC43cmVtO1xuXHRcdG1hcmdpbi1ib3R0b206IDIuMnJlbTtcblx0XHRmb250LXNpemU6IDEuMTVyZW07XG5cdFx0cGFkZGluZzogMC40cmVtIDJyZW07XG5cdH1cblx0XG5cdC5vdmVybGF5LWZvb3RlciA+IGRpdiA+IHAge1xuXHRcdGZvbnQtc2l6ZTogMXJlbTsgXG5cdFx0cGFkZGluZy1ib3R0b206IDAuNXJlbTtcblx0fVxuXG5cdC5sb2dvID4gLmxvYWR7XG5cdFx0d2lkdGg6IDE5MHB4O1xuXHR9XG5cblx0LmNlcnRpZi1sb2dvcy1jb250YWluZXIgPiBkaXYgPiBpbWd7XG5cdFx0dHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuXHR9XG5cbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC1oZWlnaHQ6IDU1MHB4KSB7XG5cdFxufVxuXG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtaGVpZ2h0OiA4MDBweCkgYW5kIChtYXgtd2lkdGg6IDEyMDBweCkge1xuXHQub2stYnRue1xuXHRcdGZvbnQtc2l6ZTogMXJlbTsgXG5cdFx0cGFkZGluZzogMC4zcmVtIDEuNXJlbTsgXG5cdH1cbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTUwcHgpe1xuXHQud2VsY29tZS1tZXNzYWdle1xuXHRcdGZvbnQtc2l6ZTogMnJlbTtcblx0XHRsaW5lLWhlaWdodDogMnJlbTtcblx0fVxufVxuXG5AbWVkaWEgKG1pbi1hc3BlY3QtcmF0aW86IDE0LzkpIHtcblx0LmxlZnQtYmFja2dyb3VuZCA+IGltZ3tcblx0XHRvYmplY3QtcG9zaXRpb246IDQzJSAwICFpbXBvcnRhbnQ7XG5cdH1cbiAgfVxuXG5AbWVkaWEgKG1pbi1hc3BlY3QtcmF0aW86IDMvMikge1xuXHQubGVmdC1iYWNrZ3JvdW5kID4gaW1ne1xuXHRcdG9iamVjdC1wb3NpdGlvbjogMjUlIDAgIWltcG9ydGFudDtcblx0fVxuICB9XG5cbiAgQG1lZGlhIChtYXgtYXNwZWN0LXJhdGlvOiAzLzIpIHtcblx0LmxlZnQtYmFja2dyb3VuZCA+IGltZ3tcblx0XHRvYmplY3QtcG9zaXRpb246IDE3JSAwICFpbXBvcnRhbnQ7XG5cdH1cbiAgfSAqLyJdfQ== */"] });


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