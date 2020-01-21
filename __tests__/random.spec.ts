/**
 * Copyright 2020 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Jest tests for the code distribution associated with pseudo-random utility functions
 */

import { TSMT$RandomIntInRange } from "../src/RandomIntInRange";
import { TSMT$Bin              } from "../src/Binning";
import { SeededRng             } from "../src/SeededRng";
import { TSMT$Deviates         } from "../src/deviates";

import "jest";

const SQRT_TWO_PI: number = Math.sqrt(Math.PI + Math.PI);

describe("Random Integer in Range", () => {

  let i: number;
  let x: number;
  let i1: number = 0;
  let i2: number = 3;
  let f0: number = 0;
  let f1: number = 0;

  for (i = 0; i < 10000; ++i)
  {
    x = i1 + Math.round(Math.random()*(i2-i1));

    if (x == 0 || x == 3)
      f0++;
    else
      f1++;
  }

  let ratio1: number = f1/f0;
  console.log( "0 & 3 frequency: ", f0 );
  console.log( "1 & 2 frequency: ", f1 );
  console.log( "ratio: ", ratio1 );

  let generator: TSMT$RandomIntInRange = new TSMT$RandomIntInRange(0, 3);
  f0 = 0;
  f1 = 0;

  for (i = 0; i < 10000; ++i)
  {
    x = generator.generate();

    if (x == 0 || x == 3)
      f0++;
    else
      f1++;
  }

  let ratio2: number = f1/f0;
  console.log( "0 & 3 frequency: ", f0 );
  console.log( "1 & 2 frequency: ", f1 );
  console.log( "ratio: ", ratio2);

  test('generates consistent iterates in interval', () => {
    expect(ratio2 < ratio1).toBe(true);
  });
});

describe("Seeded RNG", () => {
  const seededRNG: SeededRng = new SeededRng(10001);

  test('correctly generates an iterate', () => {
    let iterate: number = seededRNG.asNumber();

    expect(iterate).toBeGreaterThanOrEqual(0);
    expect(iterate).toBeLessThan(1);

    // generate more iterates (they will always be the same for the same seed)
    iterate = seededRNG.asNumber();
    expect(iterate).toBeGreaterThanOrEqual(0);
    expect(iterate).toBeLessThan(1);

    iterate = seededRNG.asNumber();
    expect(iterate).toBeGreaterThanOrEqual(0);
    expect(iterate).toBeLessThan(1);

    iterate = seededRNG.asNumber();
    expect(iterate).toBeGreaterThanOrEqual(0);
    expect(iterate).toBeLessThan(1);
  });
});

describe("Binning Tests", () => {

  const binning: TSMT$Bin = new TSMT$Bin();

  test('correctly constructs a new TSMT$Bin', () => {
    expect(binning.numBins).toBe(0);
  });

  test('nextActions returns null for no bins', () => {
    expect(binning.nextAction()).toBe(null);
  });

  test('accepts a singleton bin', () => {
    binning.create([{percentage: 100, action:'blah'}]);

    expect(binning.numBins).toBe(1);
    expect(binning.nextAction()).toBe('blah');
  });

  test('correctly tests total percentages and auto-clears', () => {
    const result: boolean = binning.create([{percentage: 60, action: 'blah'}, {percentage: 45, action: 'blah2'}]);

    expect(result).toBe(false);
    expect(binning.numBins).toBe(0);
  });

  test('correctly tests total percentages part 2', () => {
    const result: boolean = binning.create([
      {percentage: 60, action: 'action1'},
      {percentage: 30, action: 'action2'},
      {percentage: 10, action: 'action2'}
      ]);

    expect(result).toBe(true);
    expect(binning.numBins).toBe(3);
  });

  test('bin sums are correctly computed', () => {
    const result: boolean = binning.create([
      {percentage: 50, action: 'action1'},
      {percentage: 20, action: 'action2'},
      {percentage: 20, action: 'action3'},
      {percentage: 10, action: 'action4'}
    ]);

    expect(result).toBe(true);
    expect(binning.numBins).toBe(4);

    let i: number;
    let counts: object = {
      action1: 0,
      action2: 0,
      action3: 0,
      action4: 0
    };

    for (i = 0; i < 100; ++i) {
      (counts[binning.nextAction()] as number)++;
    }

    expect(counts['action1']).toBeGreaterThan(counts['action2']);
  });
});

describe("Deviates Tests", () => {
  const deviates: TSMT$Deviates = new TSMT$Deviates();

  test('correctly constructs', () => {
    expect(deviates).toBeTruthy();
  });

  test('uniform distribution example', () => {

    // initial deviate
    let deviate: number = deviates.uniform(10001);

    expect(deviate).toBeGreaterThanOrEqual(0);
    expect(deviate).toBeLessThan(1);

    // all subsequent deviates
    deviate = deviates.uniform(10001, false);
    expect(deviate).toBeGreaterThanOrEqual(0);
    expect(deviate).toBeLessThan(1);
  });

  test('normal distribution example', () => {

    const mu: number  = 0.5;    // mean
    const std: number = 0.2;    // std. deviation

    // initial deviate
    let deviate: number = deviates.normal(90210, mu, std);

    // normal curve is above x axis
    expect(deviate).toBeGreaterThan(0);

    // all subsequent deviates
    deviate = deviates.normal(90210, mu, std, false);
    expect(deviate).toBeGreaterThan(0);
  });
});
