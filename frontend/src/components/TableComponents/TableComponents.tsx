import React from 'react';
import cn from 'classnames';
import styles from './tablecomponents.module.css';

type CellProps = {
  data: React.ReactNode;
  tag?: string;
  smallTag?: boolean;
}

/**
 * Cell component for tables. [data] are the contents of the cell. [tag] is the
 * location tag that will be displayed next to [data]. [smallTag] is true if
 * the tag should be a circle, otherwise false, and the tag text will be displayed.
 */
export const Cell = ({ data, tag, smallTag }: CellProps) => {
  if (tag) {
    const tagText = `${tag.slice(0, 1).toUpperCase()}${tag.slice(1)}`;
    return (
      <div className={styles.cell}>
        {smallTag && <span className={cn(styles[tag], styles.smallTag)} />}
        {data}
        {!smallTag && <span className={cn(styles[tag], styles.tag)}>{tagText}</span>}
      </div>
    );
  }
  return (
    <div className={styles.cell}>
      {data}
    </div>
  );
};

type Row = Array<string | CellProps>;

type RowProps = {
  data: Row;
  colSizes: number[];
  header?: boolean;
  groupStart?: number;
  onClick?: () => void;
}

/**
 * Row component for tables. [data] are the cell data within this row. [colSizes]
 * are the relative sizes of each column. [header] is true if this row displays
 * the table headers. [groupStart] is the cell index where the row styles should
 * begin (see rides table for example). [onClick] is a callback that is called
 * when the row is clicked.
 */
export const Row = ({ data, colSizes, header, groupStart, onClick }: RowProps) => {
  const formatColSizes = (sizes: number[]) => (
    sizes.reduce((acc, curr) => `${acc} ${curr}fr`, '').trim()
  );

  const createCells = (row: Row) => row.map((cell) => {
    if (typeof cell === 'string') {
      return <Cell data={cell} />;
    }
    const { data: cData, tag, smallTag } = cell;
    return <Cell data={cData} tag={tag} smallTag={smallTag} />;
  });

  if (!header && groupStart) {
    const nonGroup = data.slice(0, groupStart);
    const nonGroupCols = colSizes.slice(0, groupStart);
    const group = data.slice(groupStart);
    const groupCols = colSizes.slice(groupStart);
    return (
      <div
        className={styles.rowGroup}
        style={{
          gridTemplateColumns: formatColSizes(colSizes),
          cursor: onClick ? 'pointer' : undefined,
        }}
        onClick={onClick}
      >
        <div
          className={styles.nongroup}
          style={{
            gridTemplateColumns: formatColSizes(nonGroupCols),
            gridColumn: `1 / ${groupStart + 1}`,
          }}
        >
          {createCells(nonGroup)}
        </div>
        <div
          className={styles.group}
          style={{
            gridTemplateColumns: formatColSizes(groupCols),
            gridColumn: `${groupStart + 1} / -1`,
          }}
        >
          {createCells(group)}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn({ [styles.row]: !header }, { [styles.header]: header })}
      style={{
        gridTemplateColumns: formatColSizes(colSizes),
        cursor: onClick ? 'pointer' : undefined,
      }}
      onClick={onClick}
    >
      {createCells(data)}
    </div>
  );
};

type TableProps = {
  children: React.ReactNode;
}

export const Table = ({ children }: TableProps) => (
  <div className={styles.table}>
    {children}
  </div>
);