import { StockCode } from "./StockCode";

describe("StockCode", () => {
  // Testing the constructor
  describe("constructor", () => {
    it("should create an instance with given code and isin", () => {
      // Arrange
      const testData = {
        code: "AAPL",
        isin: "US0378331005",
      };

      // Act
      const stockCode = new StockCode(testData);

      // Assert
      expect(stockCode).toEqual(testData);
    });
  });

  // Testing the fromAbstract method
  describe("fromAbstract", () => {
    it("should create a StockCode instance from an abstract object", () => {
      // Arrange
      const object = {
        code: "MSFT",
        isin: "US5949181045",
        otherField: "extraData", // This should be ignored
      };
      const expectedOutput = {
        code: "MSFT",
        isin: "US5949181045",
      };

      // Act
      const stockCode = StockCode.fromAbstract(object);

      // Assert
      expect(stockCode).toEqual(expectedOutput);
    });

    it("should not create a StockCode instance if required fields are missing", () => {
      // Arrange
      const object = {
        otherField: "extraData", // Missing `code` and `isin`
      };

      // Act & Assert
      expect(() => StockCode.fromAbstract(object)).toThrow(
        "Required fields `code` and `isin` are missing"
      );
    });

    it("should not create a StockCode instance if only `code` is provided", () => {
      // Arrange
      const object = {
        code: "MSFT", // Missing `isin`
      };

      // Act & Assert
      expect(() => StockCode.fromAbstract(object)).toThrow(
        "Required fields `code` and `isin` are missing"
      );
    });

    it("should not create a StockCode instance if only `isin` is provided", () => {
      // Arrange
      const object = {
        isin: "US5949181045", // Missing `code`
      };

      // Act & Assert
      expect(() => StockCode.fromAbstract(object)).toThrow(
        "Required fields `code` and `isin` are missing"
      );
    });
  });
});
