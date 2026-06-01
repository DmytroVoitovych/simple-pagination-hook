# Changelog

## [1.0.2] - 2026-06-01

### Fixed
- `currentPage > totalPages` when `totalPages <= 1` now correctly clamps
  to the last available page instead of returning a non-existent page number

## [1.0.1] - initial release