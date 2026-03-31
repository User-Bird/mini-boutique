import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast'; // ← fix

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject<ToastService>(ToastService);
  const startTime = Date.now();

  console.log(`[HTTP] ${req.method} ${req.url}`);

  return next(req).pipe(
    tap((event) => {
      if (event.type !== 0) {
        const duration = Date.now() - startTime;
        console.log(`[HTTP] ${req.method} ${req.url} - ${duration}ms`);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const duration = Date.now() - startTime;
      console.error(
        `[HTTP ERROR] ${req.method} ${req.url} - ${error.status} - ${duration}ms`
      );

      if (error.status === 0) {
        toast.error('Connexion au serveur impossible. Vérifiez votre connexion Internet.');
      } else if (error.status === 404) {
        toast.error('Ressource introuvable (404).');
      } else if (error.status >= 500) {
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        toast.error(`Erreur HTTP ${error.status}`);
      }

      return throwError(() => error);
    })
  );
};
