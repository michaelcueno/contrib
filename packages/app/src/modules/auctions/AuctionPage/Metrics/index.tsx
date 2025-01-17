import { FC, useEffect, useState } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import ClicksAnalytics from 'src/components/custom/ClicksAnalytics';
import Loading from 'src/components/custom/Loading';
import { Metrics as MetricsType } from 'src/types/Metric';

import styles from './styles.module.scss';
import Row from '../common/Row';

interface Props {
  metrics: MetricsType | null;
  requestMetrics: () => void;
}

const Metrics: FC<Props> = ({ metrics, requestMetrics }) => {
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    if (!metrics && showMetrics) requestMetrics();
  }, [metrics, showMetrics, requestMetrics]);

  return (
    <Row title="This auction metrics">
      <Button
        className={clsx(styles.button, 'p-0 text-label text-all-cups')}
        onClick={() => {
          setShowMetrics((prev) => !prev);
        }}
      >
        {showMetrics ? 'Hide metrics' : 'Show metrics'} &gt;&gt;
      </Button>
      {showMetrics && (!metrics ? <Loading /> : <ClicksAnalytics isAuctionPage={true} metrics={metrics} />)}
    </Row>
  );
};

export default Metrics;
