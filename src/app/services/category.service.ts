import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.productUrl;
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>(this.baseUrl + 'categories').pipe(
      tap((response) => {
        console.log(response);
      }),
    );
  }
}
