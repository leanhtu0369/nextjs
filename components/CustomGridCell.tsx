import {
  GridCellProps,
  GRID_COL_INDEX_ATTRIBUTE
} from '@progress/kendo-react-grid';
import { PropsWithChildren } from 'react';

const CustomGridCell = (
  props: PropsWithChildren<GridCellProps>,
  gridCellContent: JSX.Element
) => {
  return (
    <td
      colSpan={props.colSpan}
      className={props.className}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected={props.isSelected}
      style={props.style}
      {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
    >
      {gridCellContent}
    </td>
  );
};

export default CustomGridCell;
