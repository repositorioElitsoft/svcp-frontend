import { Region } from "./region.models";

export interface Provincia {
    id: number;
    descripcionCiudad: string;
    region: Region;
}