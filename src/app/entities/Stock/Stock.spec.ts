import { Stock } from "./Stock.entity";

describe("Stock", () => {
  // Testing the constructor
  describe("constructor", () => {
    it("should create an instance without parameters", () => {
      // Arrange & Act
      const stock = new Stock();

      // Assert
      expect(stock).toBeDefined();
      expect(stock.dateListing).toBeUndefined();
      expect(stock.type).toBeUndefined();
      expect(stock.marketIndicator).toBeUndefined();
    });

    it("should create an instance with parameters", () => {
      // Arrange
      const testDate = new Date();
      const testType = 1;
      const testMarketIndicator = 100;

      // Act
      const stock = new Stock({
        dateListing: testDate,
        type: testType,
        marketIndicator: testMarketIndicator,
      });

      // Assert
      expect(stock.dateListing).toEqual(testDate);
      expect(stock.type).toEqual(testType);
      expect(stock.marketIndicator).toEqual(testMarketIndicator);
    });
  });

  // Testing the fromAbstract method
  describe("fromAbstract", () => {
    it("should create an instance from an abstract object with dateListing", () => {
      // Arrange
      const object = {
        dateListing: "01/02/2023",
        type: "1",
        marketIndicator: "100",
      };

      // Act
      const stock = Stock.fromAbstract(object);

      // Assert
      const expectedDate = new Date(Date.UTC(2023, 1, 1)); // February is 1 in JavaScript dates as months are 0-indexed
      const receivedDate = new Date(stock.dateListing || undefined);
      expect(receivedDate.toISOString()).toEqual(expectedDate.toISOString());
      expect(stock.type).toEqual(1);
      expect(stock.marketIndicator).toEqual(100);
    });

    it("should create an instance from an abstract object without dateListing", () => {
      // Arrange
      const object = {
        type: "1",
        marketIndicator: "100",
      };

      // Act
      const stock = Stock.fromAbstract(object);

      // Assert
      expect(stock.dateListing).toBeUndefined();
      expect(stock.type).toEqual(1);
      expect(stock.marketIndicator).toEqual(100);
    });
  });
});
