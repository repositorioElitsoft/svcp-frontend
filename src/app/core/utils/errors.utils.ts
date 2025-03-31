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
    ZNAS: 'zona'
};

const errorKeyMappings: { [key: string]: { [key: string]: string } } = {


    GRCM: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'CONTRASENA_REQUERIDO',
        '005': 'CORREO_DUPLICADO',
        '006': 'CORREO_REQUERIDO',
        '007': 'CORREO_NO_ENCONTRADO',
        '008': 'ID_REQUERIDO',
        '009': 'ID_INVALIDO'

    },
    CLNT: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'CONTRASENA_REQUERIDO',
        '005': 'CORREO_DUPLICADO',
        '006': 'CORREO_REQUERIDO',
        '007': 'CORREO_NO_ENCONTRADO',
        '008': 'ID_REQUERIDO',
        '009': 'ID_INVALIDO'
    },
    CNTC: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'ID_REQUERIDO',
        '005': 'ID_INVALIDO'
    },
    DOID: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'NUMERO_REQUERIDO',
        '005': 'DIGITO_VERIFICADOR_REQUERIDO'
    },
    EMPL: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'CONTRASENA_REQUERIDO',
        '005': 'CORREO_DUPLICADO',
        '006': 'CORREO_REQUERIDO',
        '007': 'CORREO_NO_ENCONTRADO',
        '008': 'ID_REQUERIDO',
        '009': 'ID_INVALIDO'
    },
    ERRI: {
        '000': 'ERROR_INTERNO',
        '001': 'INTEGRIDAD_VIOLADA',
    },
    TPDR: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'ID_REQUERIDO',
        '005': 'ID_INVALIDO'
    },
    TPDI: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'ID_REQUERIDO',
        '005': 'ID_INVALIDO'
    }
    ,

    TPCL: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'ID_REQUERIDO',
        '005': 'ID_INVALIDO'
    },
    TPPR: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'ID_REQUERIDO',
        '005': 'ID_INVALIDO'
    },
    ZNAS: {
        '000': 'NO_ENCONTRADO',
        '001': 'INTEGRIDAD_VIOLADA',
        '002': 'REQUERIDO',
        '003': 'DUPLICADO',
        '004': 'ID_REQUERIDO',
        '005': 'ID_INVALIDO'
    }
};


export function convertErrorMessageToI18(response: any): string {
    // Verificar la estructura completa de la respuesta para asegurarnos de que errorCode existe
    console.log("Estructura completa de la respuesta:", response.error.errorCode); // <-- Cambiado a response.error.errorCode

    const errorCode = response.error.errorCode; // Accediendo directamente a errorCode

    if (!errorCode) {
        console.log("ErrorCode no encontrado en el objeto de error");
        return 'alertas.toastr.errors.general.ERROR_INTERNO'; // <-- Fallback a error general
    }

    console.log("Código de error recibido:", errorCode);

    const codeMatch = errorCode.match(/^([A-Z]+)_(\d{3})$/); // Expresión regular para separar el prefijo y sufijo

    if (!codeMatch) {
        console.log("Error en la expresión regular, no se pudo dividir el errorCode");
        return 'alertas.toastr.errors.general.ERROR_INTERNO'; // <-- Fallback a error general
    }

    const prefix = codeMatch[1]; // Prefijo
    const suffix = codeMatch[2]; // Sufijo

    console.log("Prefijo:", prefix);
    console.log("Sufijo:", suffix);

    const section = prefixToSection[prefix]; // Buscar la sección correspondiente al prefijo
    if (!section) {
        console.log("Sección no encontrada para el prefijo:", prefix);
        return 'alertas.toastr.errors.general.ERROR_INTERNO'; // <-- Fallback a error general
    }

    const errorMap = errorKeyMappings[prefix]; // Buscar el mapeo de errores
    if (!errorMap) {
        console.log("ErrorMap no encontrado para el prefijo:", prefix);
        return 'alertas.toastr.errors.general.ERROR_INTERNO'; // <-- Fallback a error general
    }

    const errorKey = errorMap[suffix]; // Obtener el mensaje del error
    if (!errorKey) {
        console.log("ErrorKey no encontrado para el sufijo:", suffix);
        return 'alertas.toastr.errors.general.ERROR_INTERNO'; // <-- Fallback a error general
    }

    // Si es un error general, retornar el path correspondiente
    if (prefix === 'ERRI') {
        return `alertas.toastr.errors.general.${errorKey}`;
    }

    return `alertas.toastr.errors.${section}.${errorKey}`;
}