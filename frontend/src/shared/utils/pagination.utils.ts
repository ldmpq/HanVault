export const generatePagination = (currentPage: number, totalPages: number) => {
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, '...');
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2);
    } else {
      pages.push(1, '...', currentPage);
    }
  }
  return pages;
};