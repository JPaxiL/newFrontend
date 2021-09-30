import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { AuthState } from 'src/app/core/store/auth.state';

import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptorCore', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[
      HttpClientModule,
      RouterTestingModule,
      NgxsModule.forRoot([AuthState]),
      NgxsStoragePluginModule.forRoot({
        key: ['auth.token', 'auth.access_token', 'auth.name', 'auth.expires_in', 'auth.refresh_token']
      }),
    ],
    providers: [
      ErrorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
