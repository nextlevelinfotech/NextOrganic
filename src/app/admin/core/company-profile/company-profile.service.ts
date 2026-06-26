import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Endpoint } from './company-profile-Url';
import { companyProfileModel } from './company-profile.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyProfileService {
  private baseurl = environment.apiBaseUrl;

  companyProfileModel: companyProfileModel = new companyProfileModel();

  constructor(private http: HttpClient) {}

  companyProfile(data: any) {
    return this.http.post(`${this.baseurl}${Endpoint.company}`, data);
  }

  getCompanyList(){
    return this.http.get(`${this.baseurl}${Endpoint.companyList}`);
  }


  companyUpdate(id: number, data: any) {
    return this.http.post(`${this.baseurl}${Endpoint.company}${id}`, data);
  }

// updateCompany(id: number, data: any) {
//   return this.http.put(
//     `https://your-api-url.com/company/${id}`,
//     data
//   );
// }

}
