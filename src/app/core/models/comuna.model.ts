import { Provincia } from "./provincia.models";

export interface Comuna {
    id: number;
    descripcionComuna: string;
    provincia: Provincia;
}
