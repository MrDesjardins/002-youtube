import grpc from "grpc";
import { IHouseServiceServer, HouseServiceService } from "./house_grpc_pb";
import {
  HousesBySizeResponse,
  HousesBySizeRequest,
  House,
  HouseRequest,
  HouseResponse,
  HousesRequest,
  HousesResponse,
} from "./house_pb";
import { mapping } from "./mapping";
const allHouse: House.AsObject[] = [
  {
    id: 1,
    housenumber: "123",
    squarefeet: 1200,
    streetname: "Funny Street",
    numberofbedrooms: 1,
  },
  {
    id: 2,
    housenumber: "500",
    squarefeet: 2000,
    streetname: "Zoo",
    numberofbedrooms: 2,
  },
  {
    id: 3,
    housenumber: "67",
    squarefeet: 890,
    streetname: "Spring Cir",
    numberofbedrooms: 3,
  },
];
class HouseService implements IHouseServiceServer {
  public getHousesBySize(
    call: grpc.ServerUnaryCall<HousesBySizeRequest>,
    callback: grpc.sendUnaryData<HousesBySizeResponse>
  ): void {
    const request = call.request;
    const min = request.getMinsquarefeet();
    const ids = allHouse.filter((d) => d.squarefeet >= min).map((f) => f.id);
    const response = new HousesBySizeResponse();
    response.setIdsList(ids);
    callback(null, response);
  }

  public getHouse(
    call: grpc.ServerUnaryCall<HouseRequest>,
    callback: grpc.sendUnaryData<HouseResponse>
  ): void {
    const request = call.request;
    const house = allHouse.filter((d) => d.id === request.getId()).shift();
    const response = new HouseResponse();
    let houseGrpc: House = new House();
    if (house !== undefined) {
      houseGrpc = mapping.house(house);
    }
    response.setHouse(houseGrpc);
    callback(null, response);
  }

  public getHouses(
    call: grpc.ServerUnaryCall<HousesRequest>,
    callback: grpc.sendUnaryData<HousesResponse>
  ): void {
    const request = call.request;
    const houses = request.getIdList();
    const response = new HousesResponse();
    const housesO = houses.map((d) =>
      allHouse.find((ff) => ff.id === d)
    ) as House.AsObject[];
    const housesObj = mapping.houses(housesO);
    response.setHousesList(housesObj);
    callback(null, response);
  }
}

const server = new grpc.Server();
server.addService<IHouseServiceServer>(HouseServiceService, new HouseService());
server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
server.start();
