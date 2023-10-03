import { StockEntity } from './Stock.entity';

describe('Stock', () => {
  // Testing the constructor
  describe('constructor', () => {
    it('should create an instance without parameters', () => {
      // Arrange & Act
      const stock = new StockEntity();

      // Assert
      expect(stock).toBeDefined();
      expect(stock.dateListing).toBeUndefined();
      expect(stock.type).toBeUndefined();
      expect(stock.marketIndicator).toBeUndefined();
    });

    it('should create an instance with parameters', () => {
      // Arrange
      const testDate = new Date();
      const testType = 1;
      const testMarketIndicator = 100;

      // Act
      const stock = new StockEntity({
        dateListing: testDate,
        type: testType,
        marketIndicator: testMarketIndicator,
      });

      // Assert
      expect(stock.dateListing).toEqual(testDate);
      expect(stock.type).toEqual(testType);
      expect(stock.marketIndicator).toEqual(testMarketIndicator);
    });

    it('should create an instance from an abstract object without dateListing', () => {
      // Arrange
      const object = {
        type: '1',
        marketIndicator: '100',
      };

      // Act
      const stock = StockEntity.fromAbstract(object);

      // Assert
      expect(stock.dateListing).toBeUndefined();
      expect(stock.type).toEqual(1);
      expect(stock.marketIndicator).toEqual(100);
    });
  });
});
