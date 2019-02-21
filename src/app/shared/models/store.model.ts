// store.model.ts

export interface Store {
  _id?: string,
  coords: [number, number]; // [Lng; Lat]
  address: string;
  street_num: string;
  zip: string;
  locality: string;
  country: string;
  descr: string;
  types: string[];
  username: string;
  rating: {
    total: number,
    count: number,
  }
}
