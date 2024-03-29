import { YahooStockHistoryEntity } from './YahooHistory.entity';

describe('YahooStockHistory', () => {
  describe('constructor', () => {
    it('should create an instance with provided data', () => {
      // Arrange
      const testData: Partial<YahooStockHistoryEntity> = {
        date: new Date('2023-09-08'),
        open: 150,
        high: 155,
        low: 145,
        close: 154,
        adjClose: 154,
        volume: 100000,
        stockCode: 'YHOO',
      };

      // Act
      const stockHistory = new YahooStockHistoryEntity(testData);

      // Assert
      expect(stockHistory).toEqual(testData);
    });
  });

  describe('fromAbstract', () => {
    it('should parse abstract data and create an instance', () => {
      // Arrange
      const abstractData = {
        date: '2023-09-08',
        open: '150',
        high: '155',
        low: '145',
        close: '154',
        adjClose: '154',
        volume: '100000',
        stockCode: 'YHOO',
      };

      const expectedData: YahooStockHistoryEntity = {
        date: new Date('2023-09-08'),
        open: 150,
        high: 155,
        low: 145,
        close: 154,
        adjClose: 154,
        volume: 100000,
        stockCode: 'YHOO',
      };

      // Act
      const stockHistory = YahooStockHistoryEntity.fromAbstract(abstractData);

      // Assert
      expect(stockHistory.date.getTime()).toEqual(expectedData.date.getTime());
      expect(stockHistory).toEqual(
        expect.objectContaining({
          ...expectedData,
          date: expect.any(Date), // Expecting any Date object
        }),
      );
    });
  });
});
