import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root',
})
export class ExportarDocService {

    constructor() { }

    // Función para exportar a Excel con estilos
    exportToExcel(data: any[], filename: string) {
        // Usamos las claves del primer objeto para generar los encabezados automáticamente
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        // Aplicar estilos a los encabezados
        const headerStyle = {
            fill: {
                fgColor: { rgb: "4F81BD" } // Color de fondo azul
            },
            font: {
                color: { rgb: "FFFFFF" }, // Color de texto blanco
                bold: true // Texto en negrita
            },
            alignment: {
                horizontal: 'center' // Centrar el texto
            },
            border: {
                top: { style: 'thin', color: { rgb: "000000" } },
                bottom: { style: 'thin', color: { rgb: "000000" } },
                left: { style: 'thin', color: { rgb: "000000" } },
                right: { style: 'thin', color: { rgb: "000000" } }
            }
        };

        // Obtener el rango de los encabezados
        if (ws['!ref']) {
            const range = XLSX.utils.decode_range(ws['!ref']);
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: C });
                if (!ws[cellAddress]) continue;
                ws[cellAddress].s = headerStyle;
            }
        }

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Convertimos el archivo a formato binario
        const wbout: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Guardamos el archivo
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${filename}.xlsx`);
    }

    // Función para exportar a CSV
    exportToCSV(data: any[], filename: string) {
        // Usamos las claves del primer objeto para generar los encabezados automáticamente
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        // Convertimos la hoja de trabajo a formato CSV
        const csv: string = XLSX.utils.sheet_to_csv(ws);

        // Creamos el archivo y lo descargamos
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}.csv`);
    }
}