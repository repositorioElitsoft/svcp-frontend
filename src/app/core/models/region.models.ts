import { Pais } from "./pais.models";

export interface Region {
    id: number;
    descripcionRegion: string;
    pais: Pais;
}