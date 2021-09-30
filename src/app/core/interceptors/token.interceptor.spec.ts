import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { AuthState } from 'src/app/core/store/auth.state';

import { TokenInterceptor } from './token.interceptor';
import { HttpClientModule } from '@angular/common/http';

describe('TokenInterceptorCore', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      NgxsModule.forRoot([AuthState]),
      NgxsStoragePluginModule.forRoot({
        key: ['auth.token', 'auth.access_token', 'auth.name', 'auth.expires_in', 'auth.refresh_token']
      }),
    ],
    providers: [
      TokenInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenInterceptor = TestBed.inject(TokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
