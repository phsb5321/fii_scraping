import { B3History } from '@/modules/b3-history/model/scrapper';
describe('B3History', () => {
  const b3History = new B3History();
  const listOfLinks: string[] = [];

  describe('getFiiHistory', () => {
    it('should return a list of strings', async () => {
      const response = await b3History.getFiiHistoryList('VGIA11');
      // Expect response to be defined
      expect(response).toBeDefined();
      // Expect all elements to be a string
      response.forEach((element) => {
        expect(typeof element).toBe('string');
      });

      // Save the list of links
      listOfLinks.push(...response);
    });
  });

  // Test suite for B3History.extractDataFromHistoryPage method
  describe('B3History.extractDataFromHistoryPage', () => {
    // Test case 1
    it('should return data when input is valid', async () => {
      // Arrange
      const link = listOfLinks[0];

      // Act
      const response = await b3History.extractDataFromHistoryPage(link);

      // Assert
      expect(response).toBeDefined();
      expect(response).not.toEqual([]);
    });

    // Test case 2
    it('should return an array of objects', async () => {
      // Arrange
      const link = listOfLinks[0];

      // Act
      const response = await b3History.extractDataFromHistoryPage(link);

      // Assert
      response.forEach((element) => {
        expect(typeof element).toBe('object');
      });
    });

    // Test case 3
    it('should return an array of objects with the correct keys', async () => {
      // Arrange
      const link = listOfLinks[0];
      const keys = [
        'dia',
        'especif',
        'n_negocios',
        'part',
        'quantidade',
        'volume',
        'aber',
        'min',
        'max',
        'med',
        'fech',
      ];

      // Act
      const response = await b3History.extractDataFromHistoryPage(link);

      // Assert
      response.forEach((element) => {
        expect(Object.keys(element)).toEqual(keys);
      });
    });

    // Test case 4
    it('should return valid date objects', async () => {
      // Arrange
      const link = listOfLinks[0];
      const [month, year] = link.split('=').pop().split('-');

      // Act
      const response = await b3History.extractDataFromHistoryPage(link);

      // Assert
      response.forEach((element) => {
        const date = new Date(+year, +month - 1, +element['dia']);
        const formatedDate = new Intl.DateTimeFormat('pt-BR').format(date);
        expect(formatedDate).toBe(`${element['dia']}/${month}/${year}`);
      });
    });

    // Test case 5
    it('should handle the case when the page is empty', async () => {
      // Arrange
      const link = 'https://bvmf.bmfbovespa.com.br/SIG/nao_existe';

      // Act and assert
      await expect(
        b3History.extractDataFromHistoryPage(link),
      ).rejects.toThrow();
    });
  });

  // Test suite for B3History.getFiiHistory method
  describe('B3History.getFiiHistory', () => {
    // Test case 1
    it('should return an array of objects', async () => {
      // Arrange
      const fiiName = 'VGIA11';

      // Act
      const { data, errors } = await b3History.getFiiHistory(fiiName);

      // Assert
      expect(data).toBeDefined();
      expect(data).not.toEqual([]);
      data.forEach((element) => {
        expect(typeof element).toBe('object');
      });
    });

    // Test case 2
    it('should return an array of objects with the correct keys', async () => {
      // Arrange
      const fiiName = 'VGIA11';
      const keys = [
        'dia',
        'especif',
        'n_negocios',
        'part',
        'quantidade',
        'volume',
        'aber',
        'min',
        'max',
        'med',
        'fech',
      ];

      // Act
      const { data, errors } = await b3History.getFiiHistory(fiiName);

      // Assert
      data.forEach((element) => {
        expect(Object.keys(element)).toEqual(keys);
      });
    });
  });

});
