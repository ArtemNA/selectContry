import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

export interface Country {
  name: string,
  flag: string,
  checked: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getListOfCountries() {
    return this.http.get('https://restcountries.com/v3.1/all').pipe(map((items ) => {
      return Object.values(items).map(el => ({name: el.name?.common, flag: el.flag, checked: false})).sort((a, b) => a.name.localeCompare(b.name))
    }));
  }
}
