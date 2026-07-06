import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './user-admin/core/auth/encryptionservice/returntoken/token-interceptor.service';


export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ]
};