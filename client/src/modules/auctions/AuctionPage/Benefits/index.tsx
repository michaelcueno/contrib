import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Charity } from 'src/types/Charity';

import Row from '../common/Row';
import styles from './styles.module.scss';

const Benefits: FC<Charity> = ({ name }) => {
  return (
    <Row title="This auction benefits">
      <div className="d-table">
        <Image roundedCircle className={clsx(styles.image, 'd-table-cell')} src="https://picsum.photos/200" />
        <div className={'text-subhead text-all-cups d-table-cell align-middle pl-4 text-nowrap'}>
          {name || 'seattle children’s hospital'}
        </div>
      </div>
      <br />
      <Link className={clsx(styles.link, 'text-label text-all-cups text-nowrap')} to="/auctions">
        other auctions benefiting this charity &gt;&gt;
      </Link>
    </Row>
  );
};

export default Benefits;