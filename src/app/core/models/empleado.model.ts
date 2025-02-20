export interface Empleado {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    imagenPerfil: string;
    telefonoFijo: string;
    telefonoMovil: string;
    fechaNacimiento: string; // Assuming LocalDate is serialized as a string (ISO 8601)
    email: string;
    rut: number;
    rutDv: string; // Using string for single-character values
    nombreUsuario: string;
    tipoEmpleadoId: number;
    roleId: number;
    estadoId: number;
}
