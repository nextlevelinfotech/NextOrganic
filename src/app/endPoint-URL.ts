import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class endPoint {
  home:string ='Home/sp';
  page:string ='Page/GetById';
  posts:string ='Page/RecentPosts';
  contact:string= 'Contact/SendMail';
}
