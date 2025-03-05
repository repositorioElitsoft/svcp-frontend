


export function convertErrorMessageToI18(input: string): string {
    if (input.includes("INTGVIOLADA001")) {
        return "alertas.toastr.errors.integridadViolada"
    }
    return "alertas.toastr.errors.generic";
}