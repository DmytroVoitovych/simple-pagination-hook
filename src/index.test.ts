import { useSimplePagination } from "./index";

describe("useSimplePagination", () => {
  // Edge cases
  it("zero pages", () => {
    expect(useSimplePagination(1, 0, 7)).toEqual([]);
  });

  it("single page", () => {
    expect(useSimplePagination(1, 1, 7)).toEqual([1]);
  });

  it("visibleButtons = 1", () => {
    expect(useSimplePagination(5, 20, 1)).toEqual([5]);
  });

  // Small lists
  it("total pages less than visible buttons", () => {
    expect(useSimplePagination(1, 5, 7)).toEqual([1, 2, 3, 4, 5]);
  });

  // Navigation through list
  it("beginning of list (page 1)", () => {
    expect(useSimplePagination(1, 125, 7)).toEqual([1, 2, 3, 4, 5, 6, 125]);
  });

  it("beginning but slightly further (page 4)", () => {
    expect(useSimplePagination(4, 125, 7)).toEqual([1, 2, 3, 4, 5, 6, 125]);
  });

  it("somewhere in the list (page 11)", () => {
    expect(useSimplePagination(11, 125, 7)).toEqual([1, 9, 10, 11, 12, 13, 125]);
  });

  it("middle of the list (page 61)", () => {
    expect(useSimplePagination(61, 125, 7)).toEqual([1, 59, 60, 61, 62, 63, 125]);
  });

  it("close to the end (page 121)", () => {
    expect(useSimplePagination(121, 125, 7)).toEqual([
      1, 119, 120, 121, 122, 123, 125,
    ]);
  });

  it("last page (page 125)", () => {
    expect(useSimplePagination(125, 125, 7)).toEqual([
      1, 120, 121, 122, 123, 124, 125,
    ]);
  });

  // Different window sizes
  it("less visible buttons (5) at page 11", () => {
    expect(useSimplePagination(11, 50, 5)).toEqual([1, 10, 11, 12, 50]);
  });

  it("more visible buttons (9) at page 26", () => {
    expect(useSimplePagination(26, 50, 9)).toEqual([
      1, 23, 24, 25, 26, 27, 28, 29, 50,
    ]);
  });

  // Shift/offset
  it("shift +1 (more buttons left)", () => {
    expect(useSimplePagination(6, 20, 7, 1)).toEqual([1, 3, 4, 5, 6, 7, 20]);
  });

  it("shift -1 (more buttons right)", () => {
    expect(useSimplePagination(6, 20, 7, -1)).toEqual([1, 5, 6, 7, 8, 9, 20]);
  });

  it("large positive shift", () => {
    expect(useSimplePagination(11, 50, 7, 5)).toEqual([1, 4, 5, 6, 7, 8, 50]);
  });

  it("negative shift at start", () => {
    expect(useSimplePagination(3, 50, 7, -2)).toEqual([1, 3, 4, 5, 6, 7, 50]);
  });

  // Auto-adjust
  it("should warn and auto-adjust when visibleButtons < 5", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation();

    const result = useSimplePagination(6, 20, 3);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("visibleButtons=3 is too small")
    );
    expect(result).toEqual([1, 5, 6, 7, 20]);

    warnSpy.mockRestore();
  });
  it("should show all pages if visibleButtons > totalPages", () => {
    expect(useSimplePagination(3, 5, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it("should show all pages if visibleButtons === totalPages", () => {
    expect(useSimplePagination(2, 7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("should handle visibleButtons just below totalPages", () => {
    expect(useSimplePagination(4, 10, 9)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 10]);
  });

  it("should handle extremely large visibleButtons", () => {
    const pages = useSimplePagination(10, 50, 100);
    expect(pages).toHaveLength(50);
    expect(pages[0]).toBe(1);
    expect(pages.at(-1)).toBe(50);
  });

  describe("useSimplePagination - validation", () => {
    describe("currentPage validation", () => {
      it("throws when currentPage is 0", () => {
        expect(() => useSimplePagination(0, 10, 7)).toThrow(
          "currentPage must be a positive integer (1, 2, 3, ...)"
        );
      });

      it("throws when currentPage is negative", () => {
        expect(() => useSimplePagination(-5, 10, 7)).toThrow(
          "currentPage must be a positive integer (1, 2, 3, ...)"
        );
      });

      it("throws when currentPage is a float", () => {
        expect(() => useSimplePagination(1.5, 10, 7)).toThrow(
          "currentPage must be a positive integer (1, 2, 3, ...)"
        );
      });

      it("throws when currentPage is NaN", () => {
        expect(() => useSimplePagination(NaN, 10, 7)).toThrow(
          "currentPage must be a positive integer (1, 2, 3, ...)"
        );
      });
    });

    describe("totalPages validation", () => {
      it("throws when totalPages is negative", () => {
        expect(() => useSimplePagination(1, -1, 7)).toThrow(
          "totalPages must be a non-negative integer"
        );
      });

      it("throws when totalPages is a float", () => {
        expect(() => useSimplePagination(1, 10.5, 7)).toThrow(
          "totalPages must be a non-negative integer"
        );
      });

      it("throws when totalPages is NaN", () => {
        expect(() => useSimplePagination(1, NaN, 7)).toThrow(
          "totalPages must be a non-negative integer"
        );
      });

      it("allows totalPages to be 0", () => {
        expect(useSimplePagination(1, 0, 7)).toEqual([]);
      });
    });

    describe("visibleButtons validation", () => {
      it("throws when visibleButtons is 0", () => {
        expect(() => useSimplePagination(1, 10, 0)).toThrow(
          "visibleButtons must be a positive integer"
        );
      });

      it("throws when visibleButtons is negative", () => {
        expect(() => useSimplePagination(1, 10, -3)).toThrow(
          "visibleButtons must be a positive integer"
        );
      });

      it("throws when visibleButtons is a float", () => {
        expect(() => useSimplePagination(1, 10, 7.5)).toThrow(
          "visibleButtons must be a positive integer"
        );
      });

      it("throws when visibleButtons is NaN", () => {
        expect(() => useSimplePagination(1, 10, NaN)).toThrow(
          "visibleButtons must be a positive integer"
        );
      });
    });

    describe("shift validation", () => {
      it("throws when shift is NaN", () => {
        expect(() => useSimplePagination(1, 10, 7, NaN)).toThrow(
          "shift must be a finite number"
        );
      });

      it("throws when shift is Infinity", () => {
        expect(() => useSimplePagination(1, 10, 7, Infinity)).toThrow(
          "shift must be a finite number"
        );
      });

      it("throws when shift is -Infinity", () => {
        expect(() => useSimplePagination(1, 10, 7, -Infinity)).toThrow(
          "shift must be a finite number"
        );
      });

      it("allows shift to be 0", () => {
        expect(useSimplePagination(1, 10, 7, 0)).toBeDefined();
      });

      it("allows shift to be negative integer", () => {
        expect(useSimplePagination(6, 20, 7, -1)).toEqual([1, 5, 6, 7, 8, 9, 20]);
      });

      it("allows shift to be positive integer", () => {
        expect(useSimplePagination(6, 20, 7, 1)).toEqual([1, 3, 4, 5, 6, 7, 20]);
      });
    });
  });
});