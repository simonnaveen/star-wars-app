import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private baseUrl = 'https://swapi.py4e.com/api';

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/people/?page=${page}`);
  }

  getCharacterDetails(id:any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/people/${id}`);
  }
}
