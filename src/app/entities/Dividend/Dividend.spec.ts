import { YahooDividendEntity } from './Dividend.entity';

describe('YahooDividend', () => {
  // Testing the constructor
  describe('constructor', () => {
    it('should create an instance without parameters', () => {
      // Arrange & Act
      const dividend = new YahooDividendEntity();

      // Assert
      expect(dividend).toBeDefined();
      expect(dividend.date).toBeUndefined();
      expect(dividend.dividend).toBeUndefined();
    });

    it('should create an instance with parameters', () => {
      // Arrange
      const testDate = new Date();
      const testDividend = 5;

      // Act
      const dividend = new YahooDividendEntity({
        date: testDate,
        dividend: testDividend,
      });

      // Assert
      expect(dividend.date).toEqual(testDate);
      expect(dividend.dividend).toEqual(testDividend);
    });
  });

  // Testing the fromAbstract method
  describe('fromAbstract', () => {
    it('should create an instance from an abstract object with date', () => {
      // Arrange
      const object = {
        date: '01/02/2023',
        dividend: 10,
      };

      // Act
      const dividend = YahooDividendEntity.fromAbstract(object);

      // Assert
      expect(dividend.date).toEqual(new Date('2023-02-01'));
      expect(dividend.dividend).toEqual(10);
    });

    it('should create an instance from an abstract object without date', () => {
      // Arrange
      const object = {
        dividend: 10,
      };

      // Act
      const dividend = YahooDividendEntity.fromAbstract(object);

      // Assert
      expect(dividend.date).toBeUndefined();
      expect(dividend.dividend).toEqual(10);
    });
  });
});
