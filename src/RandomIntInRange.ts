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
 * Typescript Math Toolkit - Computes pseudo-random integers within an input range [a,b], where a and b are integers,
 * and b > a.  This method can be used with the Math RNG or an optional seeded RNG.  There is automatic compensation
 * for bias towards endpoints.
 * 
 * @author Jim Armstrong
 * 
 * @version 1.0
 */
 import { SeededRng } from './SeededRng';

 export class TSMT$RandomIntInRange
 {
   protected _min: number;    // minimum value of range
   protected _max: number;    // maximum value of range
   protected _delta: number;  // interval width
   protected _seed: number;   // seed value for RNG
   protected _rng: SeededRng; // reference to SeededRng

  /**
   * Construct a new RandomIntInRange
   *
   * @param min Minimum value of range
   *
   * @param max Maximum value of range
   * 
   * @param seed Starting or seed value to use if seeded RNG is to be used
   */
   constructor(min: number = 0, max: number = 1, seed: number = 1)
   {
     this.setInterval(min, max);

     this._seed = Math.abs(seed);
     this._seed = Math.max(1, this._seed);

     // JIT instantiation
     this._rng  = null;
   }
    
  /**
   * Set a new interval
   *
   * @param min New minimum-integer
   *
   * @param max New maximum-integer
   */
   public setInterval(min: number, max: number): void
   {
     this._min = isNaN(min) || !isFinite(min) ? this._min : min;
     this._max = isNaN(max) || !isFinite(max) ? this._max : max;
     this._min = Math.round(this._min);
     this._max = Math.round(this._max);

     if (this._max < this._min)
     {
       let tmp: number = this._min;
       this._min       = this._max;
       this._max       = tmp;
     }

     // compensate for endpoint bias
     this._min  -= 0.499;
     this._max  += 0.499;
     this._delta = this._max-this._min;   // delta between max and min
   }

  /**
	 * Generate a pseudo-random integer in a new input range using the system-supplied RNG.
	 * 
	 * @param min Minimum value of range
	 * 
	 * @param max:number Maximum value of range
	 */
   public static generateInRange(min: number, max: number): number
   {
     let theMin: number = min;
     let theMax: number = Math.max(min, max);
      
     // compensate for endpoint bias
     theMax += 0.499;
     theMin -= 0.499;
			   
     return Math.round(theMin + Math.random()*(theMax - theMin));
   }

  /**
	 * Generate a pseudo-random integer in the currently specified range.
	 * 
	 * @param useSeeded true if the seeded RNG is used
	 */
   public generate(useSeeded: boolean=false): number
   {
     if (useSeeded && !this._rng) {
       this._rng = new SeededRng(this._seed);
     }
     
     let u: number = useSeeded ? this._rng.next() : Math.random();
      
     return Math.round(this._min + u*this._delta);
    }
  }
