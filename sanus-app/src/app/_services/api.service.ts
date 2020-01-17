import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    baseUri:string = 'http://localhost:8080/api';
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }


    // get("/api/employees")
    getEmployees() {
        return this.http.get(`${this.baseUri}/employees`);
    }

    /**
     * get("/api/locate")
     * @param name of the person you're trying to locate in the daycare
     */
    locatePerson(name): Observable<any> {
        let url = `${this.baseUri}/locate`;
        return this.http.get(url, {params:{staff_id: name}}).pipe(
            map((res: Response) => {
                return res || {}
            }),
            catchError(this.errorMgmt)
        )
    }








    // Error handling 
    errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

}
