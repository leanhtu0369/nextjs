import { GetStaticProps, GetStaticPropsContext } from 'next';
import Link from 'next/link';
import {
  API_BASE_CONFIG_MAIL,
  OPERATING_COMPANY_SID,
  VALUE_COOKIE_AUTH,
} from '../../common/constant';
import ConfigMailModel from '../../interfaces/ConfigMailModel';

export interface IConfigMailListProps {
  listConfigMail: ConfigMailModel[];
}

export default function ConfigMailList(props: IConfigMailListProps) {
  const { listConfigMail } = props;

  return (
    <div>
      listConfigMail:
      <ul>
        {listConfigMail.map((configMail) => (
          <li key={configMail.mailSid} style={{ marginBottom: 10 }}>
            {typeof configMail.mailSid}
            <p>{configMail.fundCode}</p>
            <p>{configMail.fundName}</p>
            <p>{configMail.printingCompanyName}</p>
            <Link href={`/config-mail/${configMail.mailSid}`}>Detail</Link>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps<IConfigMailListProps> = async (
  context: GetStaticPropsContext
) => {
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
      props: {
        listConfigMail: data.data.dataPaging,
      },
    };
  }

  if (data.errors) {
    console.log(data.errors);
  }

  return {
    props: {
      listConfigMail: [],
    },
  };
};
