import jsdom from 'jsdom'
import AllCountries from '../AllCountries'
import utils from '../utils'

describe('utils', () => {
  it('arraysEqual', () => {
    let a = [1, 2, 3]
    let b = a

    expect(utils.arraysEqual(a, b)).toBeTruthy()

    a = [1, 2, 3]
    b = null
    expect(utils.arraysEqual(a, b)).toBeFalsy()

    a = [1, 2, 3]
    b = [2, 1, 4, 5]
    expect(utils.arraysEqual(a, b)).toBeFalsy()

    a = ['1', '2', '3']
    b = ['3', '1', '2']
    expect(utils.arraysEqual(a, b)).toBeFalsy()
  })

  it('shallowEquals', () => {
    let a = [1, 2, 3]
    let b = a

    expect(utils.shallowEquals(a, b)).toBeTruthy()

    a = {
      x: ['1', '2', '3'],
      y: 'abc',
    }
    b = {
      x: ['1', '2', '3'],
      y: 'abc',
    }
    expect(utils.shallowEquals(a, b)).toBeTruthy()

    a = {
      x: ['1', '2', '3'],
      y: ['1', '3', '4'],
    }
    b = {
      x: ['1', '2', '3'],
      y: ['4', '2'],
    }
    expect(utils.shallowEquals(a, b)).toBeFalsy()

    a = {
      a: 1,
      b: 2,
    }
    b = Object.create(a)
    b.c = 3
    expect(utils.shallowEquals(a, b)).toBeFalsy()
  })

  it('trim', () => {
    expect(utils.trim(undefined)).toBe('')

    const str = ' Hello World   '

    expect(utils.trim(str)).toBe('Hello World')
  })

  it('isNumeric', () => {
    const num = 1.2

    expect(utils.isNumeric(num)).toBeTruthy()
  })

  it('retrieveLiIndex', () => {
    const DEFAULT_HTML = `<html><body>
      <ul id="list">
        <li class="a">a</li>
        <li class="b">b</li>
      </ul>
    </body></html>`
    const doc = jsdom.jsdom(DEFAULT_HTML)
    const bListItem = doc.querySelector('.b')

    expect(utils.retrieveLiIndex(bListItem)).toBe(1)

    const otherListItem = doc.querySelector('.z')

    expect(utils.retrieveLiIndex(otherListItem)).toBe(-1)
  })

  it('getNumeric', () => {
    const str = 'Hello 1000 World'

    expect(utils.getNumeric(str)).toBe('1000')
  })

  it('startsWith', () => {
    const str = 'Hello World'

    expect(utils.startsWith(str, 'H')).toBeTruthy()
  })

  it('isWindow', () => {
    expect(utils.isWindow(global.window)).toBeTruthy()
  })

  it('getWindow', () => {
    expect(utils.getWindow(global.window)).toBe(global.window)
  })

  it('getCountryData', () => {
    const result = {
      name: 'Taiwan (台灣)',
      iso2: 'tw',
      dialCode: '886',
      priority: 0,
      areaCodes: null,
    }

    expect(utils.getCountryData(AllCountries.getCountries(), 'tw')).toEqual(
      result
    )
    expect(
      utils.getCountryData(AllCountries.getCountries(), 'zz', true, true)
    ).toBeNull()
    expect(
      utils.getCountryData(
        AllCountries.getCountries(),
        'zz',
        false,
        false,
        country => `${country}!!`
      )
    ).toEqual({})
  })

  it('findIndex', () => {
    let array = []
    let predicate = () => true

    expect(utils.findIndex(array, predicate)).toEqual(-1)

    array = [1, 2, 3]
    predicate = item => item === 2

    expect(utils.findIndex(array, predicate)).toEqual(1)

    array = [1, 2, 3]
    predicate = item => item === 4

    expect(utils.findIndex(array, predicate)).toEqual(-1)
  })

  it('getCursorPositionAfterFormating', () => {
    let previousStringBeforeCursor = '9123'
    let previousString = '912345'
    let nextString = '912345'

    expect(
      utils.getCursorPositionAfterFormating(
        previousStringBeforeCursor,
        previousString,
        nextString
      )
    ).toEqual(4)

    previousStringBeforeCursor = '0912 345'
    previousString = '0912 345 678'
    nextString = '91234678'

    expect(
      utils.getCursorPositionAfterFormating(
        previousStringBeforeCursor,
        previousString,
        nextString
      )
    ).toEqual(5)

    previousStringBeforeCursor = '91234'
    previousString = '91234678'
    nextString = '0912 345 678'

    expect(
      utils.getCursorPositionAfterFormating(
        previousStringBeforeCursor,
        previousString,
        nextString
      )
    ).toEqual(7)

    previousStringBeforeCursor = '(201) 5'
    previousString = '(201) 55-01'
    nextString = '201-5501'

    expect(
      utils.getCursorPositionAfterFormating(
        previousStringBeforeCursor,
        previousString,
        nextString
      )
    ).toEqual(5)
  })
})
