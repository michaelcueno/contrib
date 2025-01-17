import { FC } from 'react';

import clsx from 'clsx';
import { Col } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';

import { countries } from './countries';
import styles from '../styles.module.scss';

interface Props {
  labels: string[] | undefined;
  values: number[] | undefined;
  name: string;
  isAuctionPage?: boolean;
}
const DOUGHNUT_LABELS_LIMIT = 3;

export const ChartDoughnut: FC<Props> = ({ labels, values, name, isAuctionPage }) => {
  const isCountries = name === 'countries';

  if (!labels || !values) return null;

  const ChartValues = (labels: string[], values: number[]) => {
    return {
      labels: labels,
      datasets: [
        {
          cutout: 90,
          label: 'Clicks',
          data: values,
          backgroundColor: ['#476585', '#0f81b7', '#2492c9', '#27a7e0'],
          borderColor: ['#476585', '#0f81b7', '#2492c9', '#27a7e0'],
          borderWidth: 0,
          hoverBorderWidth: 0,
          hoverBackgroundColor: '#5a7864',
          hoverOffset: -20,
        },
      ],
    };
  };
  const refferersRest: number[] = [];
  const clickNum = values.reduce((acc: number, val: number) => acc + val, 0);
  type country = { label: string; value: string };
  return (
    <Col className={clsx('mb-4', isAuctionPage && styles.alignCenter)}>
      <p className="text-all-cups">{name}</p>
      <ul className={styles.doughnutLabelsReferrers}>
        {labels.map((label: string, i: number) => {
          if (i >= DOUGHNUT_LABELS_LIMIT) {
            return null;
          }
          refferersRest.push(values[i]);
          return (
            <li key={label}>
              <div title={label}>
                {isCountries
                  ? countries.filter((country: country) => country.value === label)[0]?.label ?? label
                  : label}
              </div>
              {values[i]}
            </li>
          );
        })}
        {labels.length > DOUGHNUT_LABELS_LIMIT && (
          <li>
            <div>+{labels.length - DOUGHNUT_LABELS_LIMIT} more</div>
            {clickNum - refferersRest.reduce((acc: number, val: number) => acc + val, 0)}
          </li>
        )}
      </ul>
      <Doughnut
        data={ChartValues(labels, values)}
        height={250}
        options={{
          responsive: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: (context: any) => {
                  const label = context[0].label;
                  return isCountries
                    ? countries.filter((country: country) => country.value === label)[0]?.label ?? label
                    : label;
                },
              },
            },
          },
        }}
        width={250}
      />
    </Col>
  );
};
