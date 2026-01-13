import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/models';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/Role`;

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/GetAllRoles`);
  }

  getRoleById(roleId: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/GetRoleById`, {
      params: new HttpParams().set('roleId', roleId)
    });
  }

  getDefaultRole(): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/GetDefaultRole`);
  }

  addRole(roleName: string, isDefault: boolean): Observable<void> {
    const params = new HttpParams()
      .set('roleName', roleName)
      .set('isDefault', isDefault);

    return this.http.post<void>(`${this.apiUrl}/AddRole`, null, { params });
  }

  editRole(roleId: string, newName: string, isDefault: boolean): Observable<void> {
    const params = new HttpParams()
      .set('roleId', roleId)
      .set('newName', newName)
      .set('isDefault', isDefault);

    return this.http.put<void>(`${this.apiUrl}/EditRole`, null, { params });
  }

  deleteRoleById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteRoleById`, {
      params: new HttpParams().set('id', id)
    });
  }

  deleteAllRoles(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteAllRole`);
  }
}