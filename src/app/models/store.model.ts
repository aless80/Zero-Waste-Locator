// store.model.ts

export interface Store {
    //id: string
    coords: [number, number];  // [Long; Lat]
    address: string; 
    street_num: string,
    zip: string; 
    locality: string;
    country: string;  
    descr: string;
    type: string;
    username: string;
}