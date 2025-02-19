import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"

@Injectable({
    providedIn: "root",
})
export class TableDataService {
    private data: TableData[] = [
        { id: "1", name: "John Doe", age: 30, email: "john@example.com" },
        { id: "2", name: "Jane Smith", age: 25, email: "jane@example.com" },
        { id: "3", name: "Bob Johnson", age: 35, email: "bob@example.com" },
        { id: "4", name: "John Doe", age: 30, email: "john@example.com" },
        { id: "5", name: "Jane Smith", age: 25, email: "jane@example.com" },
        { id: "6", name: "Bob Johnson", age: 35, email: "bob@example.com" },
    ]

    getData(): Observable<TableData[]> {
        return of(this.data)
    }
}


export interface TableData {
    id: string
    name: string
    age: number
    email: string
}
