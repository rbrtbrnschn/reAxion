import styled from "styled-components";

type Row = string[];
export type TableData = [Row, Row[]];

interface Props<K> extends React.HTMLAttributes<HTMLDivElement> {
  data: K[];
  resolver: (e: K[]) => TableData;
}
export function Table<K>({ data, resolver, className }: Props<K>) {
  const myData = resolver(data);
  const [headerRow, bodyRows] = myData;

  return (
    <Container
      className={
        "relative overflow-x-auto shadow-md sm:rounded-lg " + className
      }
    >
      <StyledTable className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headerRow.map((entry, i) => (
              <th
                scope="col"
                className="px-6 py-3"
                key={"header-row#" + (i + 1)}
              >
                {entry as string}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, i) => {
            const classNamesOdd =
              "bg-white border-b dark:bg-gray-900 dark:border-gray-700";
            const classNamesEven =
              "border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700";
            console.debug(row);
            return (
              <tr
                className={(i + 1) % 2 === 0 ? classNamesEven : classNamesOdd}
                key={"row#" + (i + 1)}
              >
                {row.map((entry, j, arr) => {
                  return j === 0 ? (
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      key={"row#" + (i + 1) + "-element#" + (j + 1)}
                    >
                      {entry}
                    </th>
                  ) : (
                    <td
                      className="px-6 py-4"
                      key={"row#" + (i + 1) + "-element#" + (j + 1)}
                    >
                      {entry}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </Container>
  );
}
const Container = styled.div`
  & {
    max-height: 0px;
    transition: max-height 0.5s ease-out;
  }
  &.IS__OPEN {
    max-height: 500px;
  }
`;
const StyledTable = styled.table``;
