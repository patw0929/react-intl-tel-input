import AllCountries from '../src/components/AllCountries';
import utils from '../src/components/utils';
import jsdom from 'jsdom';
import { assert } from 'chai';

describe('utils', () => {
  it('arraysEqual', () => {
    let a = [1, 2, 3];
    let b = a;
    assert(utils.arraysEqual(a, b) === true);

    a = [1, 2, 3];
    b = null;
    assert(utils.arraysEqual(a, b) === false);

    a = [1, 2, 3];
    b = [2, 1 ,4 ,5];
    assert(utils.arraysEqual(a, b) === false);

    a = ['1', '2', '3'];
    b = ['3', '1', '2'];
    assert(utils.arraysEqual(a, b) === false);
  });

  it('shallowEquals', () => {
    let a = [1, 2, 3];
    let b = a;
    assert(utils.shallowEquals(a, b) === true);

    a = {
      x: ['1', '2', '3'],
      y: 'abc',
    };
    b = {
      x: ['1', '2', '3'],
      y: 'abc',
    };
    assert(utils.shallowEquals(a, b) === true);

    a = {
      x: ['1', '2', '3'],
      y: ['1', '3', '4'],
    };
    b = {
      x: ['1', '2', '3'],
      y: ['4', '2'],
    };
    assert(utils.shallowEquals(a, b) === false);

    a = {
      a: 1,
      b: 2,
    };
    b = Object.create(a);
    b.c = 3;
    assert(utils.shallowEquals(a, b) === false);
  });

  it('trim', () => {
    assert(utils.trim(undefined) === '');

    const str = ' Hello World   ';
    assert(utils.trim(str) === 'Hello World');
  });

  it('isNumeric', () => {
    const num = 1.2;

    assert(utils.isNumeric(num) === true);
  });

  it('retrieveLiIndex', () => {
    const DEFAULT_HTML = `<html><body>
      <ul id="list">
        <li class="a">a</li>
        <li class="b">b</li>
      </ul>
    </body></html>`;
    const doc = jsdom.jsdom(DEFAULT_HTML);
    const bListItem = doc.querySelector('.b');
    assert(utils.retrieveLiIndex(bListItem) === 1);

    const otherListItem = doc.querySelector('.z');
    assert(utils.retrieveLiIndex(otherListItem) === -1);
  });

  it('getNumeric', () => {
    const str = 'Hello 1000 World';

    assert(utils.getNumeric(str) === '1000');
  });

  it('startsWith', () => {
    const str = 'Hello World';

    assert(utils.startsWith(str, 'H') === true);
  });

  it('isWindow', () => {
    assert(utils.isWindow(global.window) === true);
  });

  it('getWindow', () => {
    assert(utils.getWindow(global.window) === global.window);
  });

  it('getCountryData', () => {
    const result = {
      name: 'Taiwan (台灣)',
      iso2: 'tw',
      dialCode: '886',
      priority: 0,
      areaCodes: null,
    };
    assert.deepEqual(utils.getCountryData(AllCountries.getCountries(), 'tw'), result);

    assert(utils.getCountryData(AllCountries.getCountries(), 'zz', true, true) === null);
    assert.deepEqual(utils.getCountryData(AllCountries.getCountries(),
      'zz', false, false, (country) => `${country}!!`), {});
  });

  it('hasClass', () => {
    const DEFAULT_HTML = `<html><body>
      <div class="abc cde">test</div>
    </body></html>`;
    const doc = jsdom.jsdom(DEFAULT_HTML);
    const element = doc.querySelector('.abc');

    assert(utils.hasClass(element, 'cde') === true);
  });

  it('addClass', () => {
    const DEFAULT_HTML = `<html><body>
      <div class="abc cde">test</div>
    </body></html>`;
    const doc = jsdom.jsdom(DEFAULT_HTML);
    const element = doc.querySelector('.abc');
    utils.addClass(element, 'efg');

    assert(element.classList.contains('efg') === true);
  });

  it('removeClass', () => {
    const DEFAULT_HTML = `<html><body>
      <div class="abc cde">test</div>
    </body></html>`;
    const doc = jsdom.jsdom(DEFAULT_HTML);
    const element = doc.querySelector('.abc');
    utils.removeClass(element, 'abc');

    assert(element.classList.contains('abc') === false);
  });
});
