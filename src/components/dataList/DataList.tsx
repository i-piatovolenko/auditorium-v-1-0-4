import React, {useEffect, useState} from 'react';
import styles from './dataList.module.css';
import Loader from "../loader/Loader";

interface PropTypes {
  header: string[];
  data: Array<any>;
  gridTemplateColumns?: string;
  handleItemClick?: (id: number) => void;
  isSearching?: boolean;
}

const DataList: React.FC<PropTypes> = ({header, data, gridTemplateColumns,
  handleItemClick, isSearching = false}) => {

  const [columnIndex, setColumnIndex] = useState(0);
  const [sortedData, setSortedData] = useState(data);
  const [columns, setColumns] = useState('repeat(3, 1fr)');

  useEffect(() => {
    setSortedData(data);
    if (gridTemplateColumns) {
      setColumns(gridTemplateColumns);
    } else {
      setColumns(`20px 3fr 200px`);
    }
  }, [data, gridTemplateColumns]);

  useEffect(() => {
    setSortedData(data?.slice().sort((a, b) => {
      const aValue = a.props.children[columnIndex].props.children;
      const bValue = b.props.children[columnIndex].props.children;
      if (typeof aValue === 'string') return aValue.localeCompare(bValue);
      return aValue - bValue;
    }));
  }, [columnIndex, data]);

  const handleClick = (index: number) => {
    setColumnIndex(index);
  };

  return (
    !data?.length && !isSearching ? <Loader/> : <div className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.headerRow} style={{gridTemplateColumns: columns}}>
          {header?.map((item, index) => <span
            onClick={() => handleClick(index)}>{item}</span>)}
        </li>
        {isSearching && !data.length
          ? <li className={styles.emptyResult}>Нічого не знайдено</li>
          : sortedData?.map(item => <li
          onClick={() => handleItemClick && handleItemClick(item.props.children[0].props.children)}
          className={styles.row} style={{gridTemplateColumns: columns}}>{item}</li>)}
      </ul>
    </div>
  );
}

export default DataList;