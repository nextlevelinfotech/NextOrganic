import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RedZoomModule } from 'ngx-red-zoom';

import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

// दुवै छुट्टाछुट्टै इन्टरसेप्टरहरूलाई फरक नाम (Alias) दिएर इम्पोर्ट गरिएको:
import { tokenInterceptor as adminInterceptor } from './app/admin/core/Auth/encryptionservice/returntoken/token-interceptor.service';
import { tokenInterceptor as userAdminInterceptor } from  './app/user-admin/core/auth/encryptionservice/returntoken/token-interceptor.service'; ;
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),

    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        timeOut: 1500,
        preventDuplicates: true
      }),
      RedZoomModule
    ),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),

    // यहाँ एउटै HTTP क्लाइन्टभित्र दुवै इन्टरसेप्टरहरू लिस्टमा राखिएका छन्
    provideHttpClient(
      withInterceptors([
        userAdminInterceptor,
        adminInterceptor,
      ])
    )
  ]
}).catch(err => console.error(err));