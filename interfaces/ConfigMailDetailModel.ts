import PrintingCompanyModel from "./PrintingCompanyModel";

export default interface ConfigMailDetailModel {
  fundName: string;
  printingCompanySelected: number;
  printingCompanies: PrintingCompanyModel[];
}
