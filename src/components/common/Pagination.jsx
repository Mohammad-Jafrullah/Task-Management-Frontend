export default function Pagination({ totalItems, currentPage, itemsPerPage = 10, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const maxPagesToShow = 10;
    const currentGroup = Math.floor((currentPage - 1) / maxPagesToShow);
    const startPage = currentGroup * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex flex-wrap items-center justify-end gap-2 mt-6">
            {startPage > 1 && (
                <button
                    className="w-10 h-10 flex justify-center items-center text-white rounded-md bg-[#005568] hover:opacity-80 cursor-pointer"
                    onClick={() => onPageChange(startPage - 1)}
                >
                    <i className="fa-regular fa-chevrons-left"></i>
                </button>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 flex justify-center items-center rounded-md cursor-pointer ${page === currentPage
                        ? "bg-[#005568] text-white"
                        : "bg-gray-200 hover:bg-gray-100"
                        }`}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <button
                    className="w-10 h-10 flex justify-center items-center text-white rounded-md bg-[#005568] hover:opacity-80 cursor-pointer"
                    onClick={() => onPageChange(endPage + 1)}
                >
                    <i className="fa-regular fa-chevrons-right text-sm"></i>
                </button>
            )}
        </div>
    );
};