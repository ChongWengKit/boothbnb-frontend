import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    hasNextPage,
    hasPreviousPage
}) => {
    if (totalPages <= 1) {
        return null;
    }

    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];
        pages.push(1);

        if (totalPages <= 7) {
            for (let i = 2; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                endPage = 4;
                startPage = 2;
            }

            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
                endPage = totalPages - 1;
            }

            if (startPage > 2) pages.push('ellipsis-start');
            for (let i = startPage; i <= endPage; i++) pages.push(i);
            if (endPage < totalPages - 1) pages.push('ellipsis-end');
        }

        if (totalPages > 1) pages.push(totalPages);

        return pages.map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                    <div key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center rounded-md bg-card text-foreground">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </div>
                );
            }
            return (
                <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onPageChange(page as number)}
                >
                    {page}
                </Button>
            );
        });
    };

    return (
        <div className="flex items-center justify-center md:mt-8 gap-2">
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            {renderPageNumbers()}

            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
};

export default Pagination;