import { Button } from '@progress/kendo-react-buttons';
import {
  DropDownList,
  DropDownListChangeEvent
} from '@progress/kendo-react-dropdowns';
import {
  Grid,
  GridCellProps,
  GridColumn,
  GridNoRecords
} from '@progress/kendo-react-grid';
import { Input } from '@progress/kendo-react-inputs';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  API_BASE_CONFIG_MAIL,
  API_BASE_USER,
  fieldName,
  OPERATING_COMPANY_SID
} from '../../common/constant';
import CustomGridCell from '../../components/CustomGridCell';
import ConfigMailDetailModel from '../../interfaces/ConfigMailDetailModel';
import GridColumnModel from '../../interfaces/GridColumnModel';
import PrintingCompanyModel from '../../interfaces/PrintingCompanyModel';
import PrintingUserModel from '../../interfaces/PrintingUserModel';

const fetcherMailDetail = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then((res) => res.json());

const fetcherPrintingUsersByConfigMail = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then((res) => res.json());

const fetcherPrintingUser = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then((res) => res.json());

export default function ConfigMailDetail() {
  const router = useRouter();
  const { mailSid } = router.query;

  const [mail, setMail] = useState<ConfigMailDetailModel>();
  const [printingUsers, setPrintingUsers] = useState<PrintingUserModel[]>([]);

  const [printingCompanySelected, setPrintingCompanySelected] =
    useState<PrintingCompanyModel>();

  const _handleOnChangePrintingCompany = (event: DropDownListChangeEvent) => {
    setPrintingCompanySelected(event.target.value);
  };

  const _handleOnClickSave = () => {
    if (printingCompanySelected && mailSid) {
      const a = fetch(`${API_BASE_CONFIG_MAIL}/Update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          operatingCompanySid: OPERATING_COMPANY_SID,
          printingCompanySid: printingCompanySelected.flPrintingCompanyInfoSid,
          configMailSid: mailSid,
          operatingCompanyMailCcUsers: [],
          trustCompanyMailCcUsers: [],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && dataMail.code === 200) {
            alert('Save success');
          }
        });
    }
  };

  const { data: dataMail } = useSWR(
    mailSid
      ? `${API_BASE_CONFIG_MAIL}/GetConfigMailDetail?configMailSid=${mailSid}`
      : null,
    fetcherMailDetail,
    {
      revalidateOnFocus: false,
    }
  );
  const { data: dataPrintingUsersByConfigMail } = useSWR(
    mailSid
      ? `${API_BASE_USER}/GetPrintingUserOfConfigMail?configMailSid=${mailSid}`
      : null,
    fetcherPrintingUsersByConfigMail,
    {
      revalidateOnFocus: false,
    }
  );
  const { data: dataPrintingUsers } = useSWR(
    printingCompanySelected
      ? `${API_BASE_USER}/GetsByPrintingCompany?operatingCompanySid=${OPERATING_COMPANY_SID}&printingCompanySid=${printingCompanySelected.flPrintingCompanyInfoSid}`
      : null,
    fetcherPrintingUser,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    }
  );

  const gridColumnsPrintingUsers: GridColumnModel[] = [
    {
      field: fieldName.printingCompanyEmail,
      title: 'User Id',
      className: '',
    },
    {
      field: fieldName.printingCompanyUserName,
      title: 'User Name',
      className: 'text-center',
    },
  ];

  useEffect(() => {
    if (dataMail?.success && dataMail?.code === 200 && dataMail?.data) {
      setMail(dataMail.data);
    }
  }, [dataMail]);

  useEffect(() => {
    if (
      dataPrintingUsersByConfigMail?.success &&
      dataPrintingUsersByConfigMail?.code === 200 &&
      dataPrintingUsersByConfigMail?.data
    ) {
      setPrintingUsers(dataPrintingUsersByConfigMail.data);
    }
  }, [dataPrintingUsersByConfigMail]);

  useEffect(() => {
    const printingCompanySelectedInit = mail?.printingCompanies.find(
      (item: PrintingCompanyModel) =>
        item.flPrintingCompanyInfoSid === mail.printingCompanySelected
    );

    setPrintingCompanySelected(printingCompanySelectedInit);
  }, [mail]);

  useEffect(() => {
    if (
      dataPrintingUsers?.success &&
      dataPrintingUsers?.code === 200 &&
      dataPrintingUsers?.data
    ) {
      setPrintingUsers(dataPrintingUsers.data);
    }
  }, [dataPrintingUsers]);

  return (
    <div className="px-5 mt-5">
      <div className="row mb-3">
        <label className="col-2 d-flex align-items-center">Fund Name:</label>
        <div className="col-10">
          <Input
            type="text"
            name="printingCompanyNameDetail"
            value={mail?.fundName}
            readOnly
            style={{ width: 300 }}
          />
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-2 config-printing-company-detail__body__title d-flex align-items-center">
          Printing Company Name:
        </label>
        <div className="col-10">
          {mail?.printingCompanies && (
            <DropDownList
              dataItemKey={'flPrintingCompanyInfoSid'}
              textField={'printingCompanyName'}
              style={{ width: 300 }}
              data={mail.printingCompanies}
              value={printingCompanySelected}
              onChange={_handleOnChangePrintingCompany}
            />
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-2">Email Destination:</label>
        <div className="col-10">
          <Grid data={printingUsers}>
            {gridColumnsPrintingUsers.map(
              (item: GridColumnModel, index: number) => {
                return (
                  <GridColumn
                    key={index}
                    className={item.className}
                    field={item.field}
                    title={item.title}
                    width={item.width}
                    locked={item.locked}
                    cell={
                      item.cell
                        ? item.cell
                        : (props: PropsWithChildren<GridCellProps>) =>
                            CustomGridCell(
                              props,
                              <span className="grid-limit-line">
                                {props.dataItem[item.field || '']}
                              </span>
                            )
                    }
                  />
                );
              }
            )}
            <GridNoRecords>No Data Available</GridNoRecords>
          </Grid>
        </div>
      </div>

      <div className="text-end">
        <Button
          themeColor="primary"
          className="px-3"
          onClick={_handleOnClickSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
