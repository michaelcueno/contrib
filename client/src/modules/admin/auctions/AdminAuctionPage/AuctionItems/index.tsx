import { FC } from 'react';

import Dinero from 'dinero.js';
import { Table, Button, Row } from 'react-bootstrap';

import { AuctionItem } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  items: AuctionItem[];
  showEditButton: boolean;
  handleEditClick: () => void;
}

export const AuctionItems: FC<Props> = ({ items, showEditButton, handleEditClick }) => {
  return (
    <>
      <Row className={styles.tableContainer}>
        <Table className="d-table d-sm-block">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Contributor</th>
              <th>Fair Market Value</th>
            </tr>
          </thead>
          <tbody className="font-weight-normal table-bordered pb-3 text-break">
            {items.map(({ id, name, contributor, fairMarketValue }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{contributor}</td>
                <td>{Dinero(fairMarketValue).toFormat('$0,0')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      {showEditButton && (
        <Button className={styles.editButton} onClick={handleEditClick}>
          Edit
        </Button>
      )}
    </>
  );
};

export default AuctionItems;
