import { Button } from '@progress/kendo-react-buttons';
import {
  Grid,
  GridCellProps,
  GridColumn,
  GridNoRecords,
  GridPageChangeEvent,
  GridSortChangeEvent,
} from '@progress/kendo-react-grid';
import Link from 'next/link';
import { PropsWithChildren, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import {
  API_BASE_CONFIG_MAIL,
  fieldName,
  OPERATING_COMPANY_SID,
  PAGE_ABLE,
} from '../../common/constant';
import {
  mapGridPageClientToSever,
  mapGridPageSeverToClient,
} from '../../common/FunctionUtilities';
import CustomGridCell from '../../components/CustomGridCell';
import ConfigMailModel from '../../interfaces/ConfigMailModel';
import GridColumnModel from '../../interfaces/GridColumnModel';
import GridPageClientModel from '../../interfaces/GridPageClientModel';

export default function ConfigMailList() {
  const [listConfigMail, setListConfigMail] = useState<ConfigMailModel[]>([]);
  const [configMailSearch, setConfigMailSearch] = useState<GridPageClientModel>(
    {
      totalRecords: 0,
      skip: 0,
      take: 10,
      sort: [],
    }
  );

  const fetcherMails = (url: string) =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        operatingCompanySid: OPERATING_COMPANY_SID,
        fundCode: '',
        fundName: '',
        printingCompanyName: '',
        ...mapGridPageClientToSever(configMailSearch),
      }),
    }).then((res) => res.json());

  const { data: dataMails, error } = useSWR(
    `${API_BASE_CONFIG_MAIL}/Gets`,
    fetcherMails,
    {
      revalidateOnFocus: false,
    }
  );

  const gridColumns: GridColumnModel[] = [
    {
      field: fieldName.fundCode,
      title: 'Fund code',
      className: 'text-center',
      width: 300,
      sortable: true,
    },
    {
      field: fieldName.fundName,
      title: 'Fund name',
      className: '',
      width: 250,
      sortable: false,
    },
    {
      field: fieldName.printingCompanyName,
      title: 'Printing company name',
      className: '',
      width: 250,
      sortable: false,
    },
    {
      className: 'text-center',
      width: 150,
      sortable: false,
      locked: true,
      cell: (props: PropsWithChildren<GridCellProps>) => {
        return CustomGridCell(
          props,
          <Button themeColor="primary" className="px-4">
            <Link href={`/client-side/${props.dataItem.mailSid}`}>Detail</Link>
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    mutate(`${API_BASE_CONFIG_MAIL}/Gets`);
  }, [configMailSearch]);

  useEffect(() => {
    if (dataMails?.success && dataMails?.code === 200 && dataMails?.data) {
      setListConfigMail(dataMails.data.dataPaging);
      setConfigMailSearch({
        ...mapGridPageSeverToClient(configMailSearch, dataMails.data.paging),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMails]);

  return (
    <div>
      <Grid
        className="mx-auto custom-w-fit mt-5"
        pageable={listConfigMail.length ? PAGE_ABLE : false}
        data={listConfigMail}
        skip={configMailSearch.skip}
        take={configMailSearch.take}
        total={configMailSearch.totalRecords}
        onPageChange={(event: GridPageChangeEvent) => {
          setConfigMailSearch({
            ...configMailSearch,
            skip: event.page.skip,
            take: event.page.take,
          });
        }}
        sortable
        sort={configMailSearch.sort}
        onSortChange={(event: GridSortChangeEvent) => {
          if (
            event.sort &&
            (event.sort.length === 0 ||
              (event.sort.length === 1 &&
                event.sort[0].field &&
                [fieldName.fundCode].includes(event.sort[0].field))) &&
            listConfigMail.length > 0
          ) {
            setConfigMailSearch({
              ...configMailSearch,
              sort: event.sort,
            });
          }
        }}
      >
        {gridColumns.map((item: GridColumnModel, index: number) => {
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
              sortable={item.sortable}
            />
          );
        })}
        <GridNoRecords>No Data Available</GridNoRecords>
      </Grid>
    </div>
  );
}
