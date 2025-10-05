/**
 * Generates a page number array for pagination controls.
 *
 * - Always includes first and last page.
 * - Keeps the current page approximately centered.
 * - Supports optional manual shift to bias the window.
 * - Auto-adjusts if `visibleButtons < 5` and warns in console.
 *
 * @param currentPage Current page number (1-based, e.g. 1 for first page, 2 for second)
 * @param totalPages Total number of pages
 * @param visibleButtons Desired total number of buttons (including first & last). Minimum: 5
 * @param shift Manual centering offset (positive = more buttons left, negative = more buttons right)
 * @note If currentPage > totalPages, the range will shift to show the last available pages.
 * @returns Array of 1-based page numbers for display, e.g. [1, 5, 6, 7, 50]
 * @throws {Error} If parameters are invalid
 *
 * @example
 * // Page 1 of 125
 * useSimplePagination(1, 125, 7)
 * // → [1, 2, 3, 4, 5, 6, 125]
 *
 * @example
 * // Page 61 of 125
 * useSimplePagination(61, 125, 7)
 * // → [1, 59, 60, 61, 62, 63, 125]
 *
 * @example
 * // With shift
 * useSimplePagination(6, 20, 7, 1)
 * // → [1, 3, 4, 5, 6, 7, 20]
 */

const validateInputs = (
  currentPage: number,
  totalPages: number,
  visibleButtons: number,
  shift: number
): void => {
  if (!Number.isInteger(currentPage) || currentPage < 1)
    throw new Error("currentPage must be a positive integer (1, 2, 3, ...)");

  if (!Number.isInteger(totalPages) || totalPages < 0)
    throw new Error("totalPages must be a non-negative integer");

  if (!Number.isInteger(visibleButtons) || visibleButtons < 1)
    throw new Error("visibleButtons must be a positive integer");

  if (!Number.isFinite(shift)) throw new Error("shift must be a finite number");
};

const renderPages = (length: number, start: number, last: number): number[] => {
  const paginationList = new Array(length + 2);

  paginationList[0] = 1;
  for (let i = 0; i < length; i++) paginationList[i + 1] = start + i;
  paginationList[paginationList.length - 1] = last;

  return paginationList;
};

export const useSimplePagination = (
  currentPage: number,
  totalPages: number,
  visibleButtons: number,
  shift: number = 0
): number[] => {
  validateInputs(currentPage, totalPages, visibleButtons, shift);

  const MIN_BTN = 5;
  const fixedButtons = 2;
  const isMinimalCase = totalPages <= 1 || visibleButtons <= 1;
  const warnInfo = `Pagination: visibleButtons=${visibleButtons} is too small. Auto-adjusted to 5 for proper UX. Please use at least ${MIN_BTN} buttons.`;

  let adjustedVisibleButtons = visibleButtons;

  if (isMinimalCase) return totalPages >= 1 ? [currentPage] : [];

  if (visibleButtons < MIN_BTN) {
    console.warn(warnInfo);
    adjustedVisibleButtons = MIN_BTN;
  }

  const excludedStatic = Math.min(adjustedVisibleButtons, totalPages) - fixedButtons;
  const length = Math.max(0, excludedStatic);

  const halfWindow = Math.floor(length / 2) + shift;

  const getIdealStart = Math.max(currentPage - halfWindow, fixedButtons);
  const startPosition = Math.min(getIdealStart, totalPages - length);
  const paginationList = renderPages(length, startPosition, totalPages);

  return paginationList;
};
