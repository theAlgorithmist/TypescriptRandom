/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
 * Angular Dev Toolkit Implementation of Fisher-Yates shuffle for a one-dimensional array
 *
 * @param a: Array<any> Input array
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @returns {Array<any>} The input array is copied and then shuffled; the original array remains unaltered.
 *
 * @version 1.0
 *
 */
import { TSMT$RandomIntInRange } from "./RandomIntInRange";

export function fisherYates(a: Array<any>): Array<any>
{
  if (a === undefined || a == null) {
    return [];
  }

  const n: number = a.length;
  if (n == 0) {
    return [];
  }

  let i: number;
  let j: number;
  let tmp: any;

  let arr: Array<any> = a.slice();

  for (i = 0; i < n; ++i)
  {
    j = TSMT$RandomIntInRange.generateInRange(0, i);

    if (i != j)
    {
      tmp    = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }

  return arr;
}
