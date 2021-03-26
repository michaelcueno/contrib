import { FC } from 'react';

import { isPast } from 'date-fns';
import { toDate } from 'date-fns-tz';

import { pluralize } from 'src/helpers/pluralize';
import { toFullHumanReadableDatetime, toHumanReadableDuration } from 'src/helpers/timeFormatters';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

type Props = {
  auction: Auction;
  isDonePage?: boolean;
};

const DateDetails: FC<Props> = ({ auction, isDonePage }) => {
  if (isPast(toDate(auction.endDate))) {
    return <span className={styles.ended}>ended</span>;
  }

  if (isDonePage) {
    return <>starts on {toFullHumanReadableDatetime(auction.startDate)}</>;
  }

  return (
    <>
      {pluralize(auction.totalBids ?? 0, 'bid')} • {toHumanReadableDuration(auction.endDate)}
    </>
  );
};

export default DateDetails;
