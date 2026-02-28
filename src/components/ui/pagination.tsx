import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  totalItems,
  itemsPerPage,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const canGoPrev = hasPrevPage !== undefined ? hasPrevPage : currentPage > 1;
  const canGoNext = hasNextPage !== undefined ? hasNextPage : currentPage < totalPages;

  // Calculate range of items being shown
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems && itemsPerPage 
    ? Math.min(currentPage * itemsPerPage, totalItems) 
    : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
      {/* Items info */}
      {totalItems !== undefined && startItem && endItem && (
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {startItem} to {endItem} of {totalItems} items
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className="h-9"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {/* First page */}
          {currentPage > 2 && (
            <>
              <Button
                variant={currentPage === 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(1)}
                className="h-9 w-9 p-0"
              >
                1
              </Button>
              {currentPage > 3 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
            </>
          )}

          {/* Previous page */}
          {currentPage > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              className="h-9 w-9 p-0"
            >
              {currentPage - 1}
            </Button>
          )}

          {/* Current page */}
          <Button
            variant="default"
            size="sm"
            className="h-9 w-9 p-0"
            disabled
          >
            {currentPage}
          </Button>

          {/* Next page */}
          {currentPage < totalPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              className="h-9 w-9 p-0"
            >
              {currentPage + 1}
            </Button>
          )}

          {/* Last page */}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
              <Button
                variant={currentPage === totalPages ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="h-9 w-9 p-0"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="h-9"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};
