import { House } from "./house_pb";

export class Mapper {
  public house(house: House.AsObject): House {
    const houseGrpc: House = new House();
    houseGrpc.setId(house.id);
    houseGrpc.setStreetname(house.streetname);
    houseGrpc.setHousenumber(house.housenumber);
    houseGrpc.setNumberofbedrooms(house.numberofbedrooms);
    return houseGrpc;
  }

  public houses(houses: House.AsObject[]): House []{
    return houses.map((h)=>this.house(h));
  }
}


export const mapping = new Mapper();