import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root',
})
export class ExportarDocService {

    constructor() { }

    // Función para aplanar objetos anidados manteniendo el ID del objeto principal y renombrando las descripciones
    private flattenObject(obj: any, parentKey: string = ''): any {
        let flattened: any = {};
        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            if (key === 'id' && parentKey === '') { // Mantener el ID del objeto principal
                flattened[key] = obj[key];
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                Object.assign(flattened, this.flattenObject(obj[key], key));
            } else if (!key.endsWith('id')) { // Excluir claves con 'id' en objetos anidados
                flattened[parentKey || key] = obj[key];
            }
        }
        return flattened;
    }

    // Función para exportar a Excel con objetos anidados correctamente desplegados
    exportToExcel(data: any[], filename: string) {
        // Aplanar cada objeto de la lista
        const flattenedData = data.map(item => this.flattenObject(item));

        // Crear hoja de cálculo
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedData);

        // Crear libro de trabajo y agregar hoja
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Convertimos el archivo a formato binario
        const wbout: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Guardamos el archivo
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${filename}.xlsx`);
    }

    // Función para exportar a CSV con objetos anidados correctamente desplegados
    exportToCSV(data: any[], filename: string) {
        const flattenedData = data.map(item => this.flattenObject(item));
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedData);
        const csv: string = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}.csv`);
    }
}