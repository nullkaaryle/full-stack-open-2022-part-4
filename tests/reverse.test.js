const reverse = require('../utils/list_helper').reverse


describe('reverse tests:', () => {

  test('reverse of a', () => {
    const result = reverse('a')

    expect(result).toBe('a')
  })

  test('reverse of react', () => {
    const result = reverse('react')

    expect(result).toBe('tcaer')
  })

  test('reverse of saippuakauppias', () => {
    const result = reverse('saippuakauppias')

    expect(result).toBe('saippuakauppias')
  })

})
