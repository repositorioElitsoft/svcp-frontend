import { ClienteError } from '../enums/cliente.error.enum';
import { ContactoError } from '../enums/contacto.error.enum';
import { DocumentoIdentificacionError } from '../enums/documento-identificacion.error.enum';
import { EmpleadoError } from '../enums/empleado.error.enum';
import { GeneralError } from '../enums/error-general.error.enum';
import { TipoDocumentoIdentificacionError } from '../enums/tipo-documento-enumeracion.error.enum';
import { TipoDireccionError } from '../enums/tipo-direccion.error.enum';
import { SectorError } from '../enums/sector.error.enum';
import { RolesError } from '../enums/role.error.enum';
import { TareaError } from '../enums/tarea.error.enum';
import { ContratoDetalleProductoError } from '../enums/contrato-detalle-producto.error.enum';
import { ContratoDetalleTipoProductoError } from '../enums/contrato-detalle-tipo-producto.error.enum';
import { ContratoError } from '../enums/contrato.error.enum';
import { ServicioError } from '../enums/servicio.error.enum';
import { TipoEmpleadoError } from '../enums/tipo-empleado.error.enum';
import { TipoProductoTipoComponenteError } from '../enums/tipo-producto-tipo-componente.error.enum';
import { TipoProductoError } from '../enums/tipo-producto.error.enum';
import { TrabajoError } from '../enums/trabajo.error.enum';
import { ClasificacionClienteError } from '../enums/clasificacion-cliente.error.enum';
import { CarroError } from '../enums/carro.error.enum';
import { TrabajoTareaError } from '../enums/trabajo-tarea.error.enum';

// Mapa de prefijo a sección para construir los paths de i18n
const prefixToSection: { [key: string]: string } = {
    GRCM: 'agrupacionComercial',
    CLNT: 'cliente',
    CNTC: 'contacto',
    DOID: 'documentoIdentificacion',
    EMPL: 'empleado',
    ERRI: 'general',
    TPDR: 'tipoDireccion',
    TPDI: 'tipoDocumentoIdentificacion',
    TPCL: 'tipoCliente',
    TPPR: 'tipoProducto',
    ZNAS: 'zona',
    TPSEV: 'tipoServicio',
    RUTA: 'ruta',
    TPEM: 'tipoEmpleado',
    SCTR: 'sector',
    RLES: 'role',
    TPCM: 'tipoComponente',
    TRTR: 'trabajoTarea',
    SVCS: 'servicio',
    TRBJ: 'trabajo'
};

// Creamos un mapa inverso para buscar por código de error
const errorCodeToKey: { [code: string]: string } = {};

// Procesamos todos los enums de errores
const errorEnums = [
    ClienteError,
    ContactoError,
    DocumentoIdentificacionError,
    EmpleadoError,
    GeneralError,
    TipoDocumentoIdentificacionError,
    TipoDireccionError,
    SectorError,
    RolesError,
    TareaError,
    ServicioError,
    TipoProductoError,
    TipoProductoTipoComponenteError,
    TrabajoError,
    TipoEmpleadoError,
    ContratoError,
    ContratoDetalleProductoError,
    ContratoDetalleTipoProductoError,
    CarroError,
    ClasificacionClienteError,
    TrabajoTareaError
];

// Creamos el mapa inverso de códigos
errorEnums.forEach(enumObj => {
    // Usamos type assertion para evitar errores de tipado
    const enumAsRecord = enumObj as Record<string, string | number>;
    Object.keys(enumAsRecord).forEach(key => {
        if (isNaN(Number(key)) && typeof enumAsRecord[key] === 'string') {
            errorCodeToKey[enumAsRecord[key] as string] = key;
        }
    });
});

// Mapeo común de sufijos numéricos a tipos de error
const commonErrorTypes: { [suffix: string]: string } = {
    '000': 'NO_ENCONTRADO',
    '001': 'INTEGRIDAD_VIOLADA',
    '002': 'REQUERIDO',
    '003': 'DUPLICADO',
    '004': 'ID_REQUERIDO',
    '005': 'ID_INVALIDO'
};

export function convertErrorMessageToI18(response: any): string {
    const errorCode = response?.error?.errorCode;

    if (!errorCode) {
        return 'alertas.toastr.errors.general.ERROR_INTERNO';
    }

    // Buscar el código de error en el mapa inverso
    const errorKey = errorCodeToKey[errorCode];

    // Extraer prefijo y sufijo del código
    const codeMatch = errorCode.match(/^([A-Z]+)_(\d{3})$/);

    if (!codeMatch) {
        return 'alertas.toastr.errors.general.ERROR_INTERNO';
    }

    const prefix = codeMatch[1];
    const suffix = codeMatch[2];

    // Buscar la sección correspondiente al prefijo
    const section = prefixToSection[prefix];

    if (!section) {
        return 'alertas.toastr.errors.general.ERROR_INTERNO';
    }

    // Si tenemos la clave de error en el mapa, la usamos
    if (errorKey) {
        // Caso especial para errores generales
        if (prefix === 'ERRI') {
            return `alertas.toastr.errors.general.${errorKey}`;
        }

        return `alertas.toastr.errors.${section}.${errorKey}`;
    }

    // Si no la tenemos, usamos el mapeo común basado en el sufijo
    const errorType = commonErrorTypes[suffix] || 'ERROR_DESCONOCIDO';

    // Caso especial para errores generales
    if (prefix === 'ERRI') {
        return `alertas.toastr.errors.general.${errorType}`;
    }

    return `alertas.toastr.errors.${section}.${errorType}`;
}