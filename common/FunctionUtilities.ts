import GridPageClientModel from '../interfaces/GridPageClientModel';
import GridPageReqServerModel from '../interfaces/GridPageReqServerModel';
import GridPageResServerModel from '../interfaces/GridPageResServerModel';
import { orderDirectionType } from './constant';

export const mapGridPageClientToSever = (
  pagingClient: GridPageClientModel
): GridPageReqServerModel => {
  return {
    pageNumber: 1 + pagingClient.skip / pagingClient.take,
    pageSize: pagingClient.take,
    orderBy:
      pagingClient.sort && pagingClient.sort.length > 0
        ? pagingClient.sort[0].field
        : '',
    orderDirection:
      pagingClient.sort && pagingClient.sort.length > 0
        ? orderDirectionType.findIndex(
            (item) => item === pagingClient.sort[0].dir
          )
        : 0,
  };
};

export const mapGridPageSeverToClient = (
  pagingClient: GridPageClientModel,
  pagingServer: GridPageResServerModel
): GridPageClientModel => {
  return {
    ...pagingClient,
    totalRecords: pagingServer.totalRecords,
    skip:
      pagingServer.pageNumber > 0
        ? (pagingServer.pageNumber - 1) * pagingClient.take
        : 0,
  };
};
