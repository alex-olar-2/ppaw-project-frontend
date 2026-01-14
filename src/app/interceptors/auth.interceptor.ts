import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Încercăm să luăm token-ul din sessionStorage (sau localStorage, depinde unde l-ai salvat)
  // Notă: E bine să verifici și structura, dacă ai salvat tot obiectul User, parsează-l.
  let token = null;
  const storedUser = sessionStorage.getItem('CurrentUser');
  
  if (storedUser) {
    const userObj = JSON.parse(storedUser);
    token = userObj.token;
  }

  // 2. Dacă avem token, clonăm cererea și adăugăm header-ul Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // 3. Dacă nu avem token, lăsăm cererea așa cum e (pentru Login/Register)
  return next(req);
};