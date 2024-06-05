import { Button } from '@/components/button';
import { Select } from '@headlessui/react';
import { useEffect, useState } from 'react';

export const Pagination = ({
  page,
  totalItems,
  resultsPerPage,
  setPage,
  setResultsPerPage
}: {
  page: number;
  setPage: (page: number) => void;
  resultsPerPage: number;
  setResultsPerPage: (resultsPerPage: number) => void;
  totalItems: number;
}) => {
  const hasNextPage = page * resultsPerPage < totalItems;
  const hasPreviousPage = page > 1;

  const pageCount = Math.ceil(totalItems / resultsPerPage);

  const previousPage = () => {
    if (hasPreviousPage) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const clampPage = (page: number) => {
    if (page < 1) return 1;
    if (page > pageCount) return pageCount;
    return page;
  };

  const flushPage = () => {
    const page = Number(pageInput);
    const clamped = clampPage(page);
    setPage(clamped);
    setPageInput(String(clamped));
  };

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const [pageInput, setPageInput] = useState(String(page));

  return (
    <div className="flex items-center justify-between p-4 text-m text-slate-500">
      <p>{totalItems} entries</p>

      <div className="flex space-x-32">
        <Button onClick={previousPage} disabled={!hasPreviousPage} size="medium" variant="ghost">
          Previous
        </Button>

        <span className="space-x-2">
          <span>Page</span>
          <input
            className="w-[50px] rounded-sm border border-slate-300 py-1 text-center text-black"
            value={pageInput}
            type="number"
            min={1}
            max={pageCount}
            onChange={(e) => {
              setPageInput(e.target.value);
            }}
            onBlur={flushPage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                flushPage();
              }
            }}
          />
          <span>of {pageCount}</span>
        </span>

        <Button onClick={nextPage} disabled={!hasNextPage} size="medium" variant="ghost">
          Next
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <span>Show</span>
        <Select
          value={String(resultsPerPage)}
          onChange={(e) => {
            setResultsPerPage(Number(e.target.value));
            setPage(1);
          }}
          className="rounded border border-slate-300 px-2 py-1.5 text-black"
        >
          {[5, 10, 15, 20, 25, 50, 75, 100].map((resultsPerPage) => (
            <option key={resultsPerPage} value={String(resultsPerPage)}>
              {resultsPerPage}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};
