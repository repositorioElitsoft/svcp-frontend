export function convertErrorMessageToI18(error: any): string {
    if (!error) return 'alertas.toastr.error';

    if (error.error?.code) {
        switch (error.error.code) {
            case 'NOT_FOUND':
                return 'alertas.toastr.error.notFound';
            case 'VALIDATION_ERROR':
                return 'alertas.toastr.error.validacion';
            case 'UNAUTHORIZED':
                return 'alertas.toastr.error.noAutorizado';
            case 'FORBIDDEN':
                return 'alertas.toastr.error.prohibido';
            case 'INTERNAL_SERVER_ERROR':
                return 'alertas.toastr.error.servidor';
            default:
                return 'alertas.toastr.error';
        }
    }

    if (error.error?.message) {
        const message = error.error.message.toLowerCase();
        if (message.includes('not found')) return 'alertas.toastr.error.notFound';
        if (message.includes('validation')) return 'alertas.toastr.error.validacion';
        if (message.includes('unauthorized')) return 'alertas.toastr.error.noAutorizado';
        if (message.includes('forbidden')) return 'alertas.toastr.error.prohibido';
        if (message.includes('internal server error')) return 'alertas.toastr.error.servidor';
    }

    return 'alertas.toastr.error';
}
