export interface AddressDetails {
    formattedAddress?: string; // Dirección completa formateada
    country?: string; // País
    countryCode?: string; // Código del país (ISO 3166-1 Alpha-2)
    administrativeArea?: string; // Estado/Provincia/Región
    administrativeAreaLevel2?: string; // Segundo nivel administrativo (ej. condado, departamento)
    locality?: string; // Ciudad o localidad
    sublocality?: string; // Suburbio, barrio o distrito
    postalCode?: string; // Código postal
    street?: string; // Calle
    streetNumber?: string; // Número de calle
    route?: string; // Nombre de la vía (carretera, avenida, etc.)
    neighborhood?: string; // Vecindario o colonia
    lat: number; // Latitud
    lng: number; // Longitud
}
