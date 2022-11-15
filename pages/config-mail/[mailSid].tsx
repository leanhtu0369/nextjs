import {
  DropDownList,
  DropDownListChangeEvent,
} from '@progress/kendo-react-dropdowns';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { useEffect, useState } from 'react';
import {
  API_BASE_CONFIG_MAIL,
  OPERATING_COMPANY_SID,
  VALUE_COOKIE_AUTH,
} from '../../common/constant';
import ConfigMailDetailModel from '../../interfaces/ConfigMailDetailModel';
import ConfigMailModel from '../../interfaces/ConfigMailModel';
import PrintingCompanyModel from '../../interfaces/PrintingCompanyModel';

export interface IConfigMailDetailProps {
  mail: ConfigMailDetailModel;
}

export default function ConfigMailDetail(props: IConfigMailDetailProps) {
  const { mail } = props;
  const [printingCompanySelected, setPrintingCompanySelected] =
    useState<PrintingCompanyModel>();

  const _handleOnChangePrintingCompany = (event: DropDownListChangeEvent) => {
    setPrintingCompanySelected(event.target.value);
  };

  useEffect(() => {
    const printingCompanySelectedInit = mail.printingCompanies.find(
      (item: PrintingCompanyModel) =>
        item.flPrintingCompanyInfoSid === mail.printingCompanySelected
    );

    setPrintingCompanySelected(printingCompanySelectedInit);
  }, [mail]);

  return (
    <div>
      <p>{mail?.fundName}</p>
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
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  var myHeaders = new Headers();
  myHeaders.append('Cookie', VALUE_COOKIE_AUTH);
  myHeaders.append('Content-Type', 'application/json');

  const response = fetch(`${API_BASE_CONFIG_MAIL}/Gets`, {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify({
      operatingCompanySid: OPERATING_COMPANY_SID,
      fundCode: '',
      fundName: '',
      printingCompanyName: '',
      pageNumber: 1,
      pageSize: 10,
      orderBy: '',
      orderDirection: 0,
    }),
  });
  const data = await (await response).json();

  if (data.success && data.code === 200) {
    return {
      paths: data.data.dataPaging.map((mail: ConfigMailModel) => ({
        params: { mailSid: mail.mailSid.toString() },
      })),
      fallback: true,
    };
  }

  if (data.errors) {
    console.log(data.errors);
  }

  return {
    paths: {
      params: { mailSid: undefined },
    },
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<IConfigMailDetailProps> = async (
  context: GetStaticPropsContext
) => {
  const mailSid = context.params?.mailSid;
  if (!mailSid) return { notFound: true };

  var myHeaders = new Headers();
  myHeaders.append('Cookie', VALUE_COOKIE_AUTH);
  myHeaders.append('Content-Type', 'application/json');

  const response = fetch(
    `${API_BASE_CONFIG_MAIL}/GetConfigMailDetail?configMailSid=${mailSid}`,
    {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
  );
  const data = await (await response).json();

  if (data.success && data.code === 200) {
    return {
      props: {
        mail: data.data,
      },
      revalidate: 300,
    };
  }

  if (data.errors) {
    console.log(data.errors);
  }

  return {
    props: {
      mail: {
        fundName: '',
        printingCompanySelected: '',
        printingCompanies: [],
      },
    },
    revalidate: 300,
  };
};
