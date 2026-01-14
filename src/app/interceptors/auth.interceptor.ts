import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token = null;
  const storedUser = sessionStorage.getItem('CurrentUser');
  
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      token = userObj.token;
    } catch (e) {
      console.error('Eroare la parsarea userului din session', e);
    }
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};