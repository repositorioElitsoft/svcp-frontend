import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Injectable({
    providedIn: 'root',
})
export class ExportarDocService {

    constructor() { }

    // Función para exportar a Excel
    exportToExcel(data: any[], filename: string, config: ExportConfig) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: config.headers });
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        const wbout: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${filename}.xlsx`);
    }

    // Función para exportar a CSV
    exportToCSV(data: any[], filename: string, config: ExportConfig) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: config.headers });
        const csv: string = XLSX.utils.sheet_to_csv(ws);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}.csv`);
    }
}

// Interface para los parámetros configurables
export interface ExportConfig {
    headers?: string[];  // Define los encabezados de las columnas
}
