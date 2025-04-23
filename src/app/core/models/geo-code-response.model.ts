
export interface GeoCodeResponse {
    results: {
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
        address_components: any[];
        formatted_address: string;
    }[];
    status: string;
}
