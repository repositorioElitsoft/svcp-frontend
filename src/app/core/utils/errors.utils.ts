const prefixToSection: { [key: string]: string } = {
    CLNT: 'cliente',
    CNTC: 'contacto',
    DOID: 'documentoIdentificacion',
    EMPL: 'empleado',
    ERRI: 'general',
    TPDR: 'tipoDireccion',
    TPDI: 'tipoDocumentoIdentificacion'
};

const errorKeyMappings: { [key: string]: { [key: string]: string } } = {
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
        '000': 'ERROR_INTERNO'
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
};


export function convertErrorMessageToI18(input: string): string {
    const codeMatch = input.match(/^([A-Z]{4})_(\d{3})$/);

    if (!codeMatch) {
        return 'alertas.toastr.errors.general.ERROR_INTERNO'; // <-- Fallback a error general
    }

    const prefix = codeMatch[1];
    const suffix = codeMatch[2];

    const section = prefixToSection[prefix];
    if (!section) {
        return 'alertas.toastr.errors.general.ERROR_INTERNO'; // <-- Fallback a error general
    }

    const errorMap = errorKeyMappings[prefix];
    if (!errorMap) {
        return 'alertas.toastr.errors.general.ERROR_INTERNO'; // <-- Fallback a error general
    }

    const errorKey = errorMap[suffix];
    if (!errorKey) {
        return 'alertas.toastr.errors.general.ERROR_INTERNO'; // <-- Fallback a error general
    }

    // Si es error general, retornar directamente su path
    if (prefix === 'ERRI') {
        return `alertas.toastr.errors.general.${errorKey}`;
    }

    return `alertas.toastr.errors.${section}.${errorKey}`;
}

