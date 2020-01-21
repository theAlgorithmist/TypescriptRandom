/**
 * Copyright 2019 Jim Armstrong (www.algorithmist.net)
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
 * Typescript Math Toolkit - Create bins that allow uniform deviates to return samples so that particular actions
 * are selected on average a prescribed percentage of the time.
 *
 * @author Jim Armstrong
 *
 * @version 1.0
 */
export interface Bin
{
  percentage: number;
  action: string;
}

export class TSMT$Bin
{
  protected _bins: Array<number>;
  protected _actions: Array<string>;

  constructor()
  {
    this._bins    = new Array<number>();
    this._actions = new Array<string>();
  }

  public get numBins(): number
  {
    return this._bins.length;
  }

  public create(bins: Array<Bin>): boolean
  {
    if (bins !== undefined && bins != null && Array.isArray(bins))
    {
      // Clear out the current bins
      this.clear();
    }

    const n: number = bins.length;
    if (n == 0) {
      return false;
    }

    let i: number;
    let sum: number = bins[0].percentage;
    this._bins.push(bins[0].percentage);
    this._actions.push(bins[0].action);  // No error-checking.  You break it, you buy it.

    // First, ensure the sum of the percentages is 100
    for (i = 1; i < n; ++i) {
      sum += bins[i].percentage;
      this._bins.push(bins[i].percentage);
      this._actions.push(bins[i].action);
    }

    if (Math.abs(100 - sum) >= 0.00001)
    {
      this._bins.length    = 0;
      this._actions.length = 0;

      return false;
    }

    // Now, sort the current bins in decreasing order
    this._bins = this._bins.sort( (a: number, b: number) => b - a);

    // Normalize to [0,1]
    sum           = this._bins[0] * 0.01;
    this._bins[0] = sum;

    for (i = 1; i < n-1; ++i)
    {
      sum          += this._bins[i] * 0.01;
      this._bins[i] = sum;
    }

    // Compensate for roundoff
    this._bins[n-1] = 1;

    // Five by five
    return true;
  }

  public nextAction(): string | null
  {
    // Outliers
    const n: number = this._bins.length;
    if (n === 0) {
      return null;
    }

    // Test value in [0,1)
    const test: number = Math.random();

    // Create a running sum to isolate the bin
    if (this._bins[0] >= test) {
      return this._actions[0];
    }

    let i: number;

    for (i = 1; i < n; ++i)
    {
      if (this._bins[i] >= test) {
        return this._actions[i];
      }

    }

    return null;
  }

  public clear(): void
  {
    this._bins.length    = 0;
    this._actions.length = 0;
  }
}
