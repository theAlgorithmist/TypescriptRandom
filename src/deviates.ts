/**
 * Copyright 2015 Jim Armstrong (www.algorithmist.net)
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
 * Typescript Math Toolkit: Methods for generating sequences of deviates from various distributions.  Typical usage is
 * to call a method with a starting seed value and an {init} value of true.  Repeatedly call the same method with the
 * {init} variable set to false to generate a new deviate from the same distribution.  There are dozens of references
 * for the formulas; either consult Numerical Recipes or a good Google search will suffice.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

export class TSMT$Deviates
{
  // Note: this uses an approximation for machine epsilon
  protected static IA: number   = 16807;
  protected static IM: number   = 2147483647;
  protected static AM: number   = 1.0 / TSMT$Deviates.IM;
  protected static IQ: number   = 127773;
  protected static IR: number   = 2836;
  protected static NTAB: number = 32;
  protected static NDIV: number = (1 + (TSMT$Deviates.IM - 1) / TSMT$Deviates.NTAB);
  protected static EPS: number  = 1.2e-7;
  protected static RNMX: number = 1.0 - TSMT$Deviates.EPS;

  protected idum: number;
  protected iv: Array<number>;
  protected normVal: number;
  protected u: number;
  protected s: number;
  protected a: number;
  protected b: number;
  protected a1: number;
  protected a2: number;

  constructor()
  {
    this.idum    = 0;
    this.iv      = new Array<number>();
    this.normVal = 0;
    this.u       = 0;
    this.s       = 1;
    this.a       = 1.0;
    this.b       = 1.0;
    this.a1      = 0.0;
    this.a2      = 0.0;
  }

  /**
   * Return a Uniform deviate in (0,1)
   *
   * @param start An integer starting value for the sequence.
   *
   * @param init true if the sequence is to be re-initialized; call with true, then pass false for successive calls
   *
   * Reference:  NRC (aka ran1 - portable and only suffers from period exhaustion)
   */
  public uniform(start:number, init:boolean = true): number
  {
    let j: number;
    let k: number;
    let temp:number;
    let iy: number   = 0;
    const len:number = TSMT$Deviates.NTAB+7;

    if (init)
    {
      this.iv.length = 0;

      this.idum = isNaN(start) && start < 1 ? 1 : start;

      for (j = len; j >= 0; j--)
      {
        k         = Math.floor( this.idum/TSMT$Deviates.IQ );
        this.idum = TSMT$Deviates.IA*(this.idum - k*TSMT$Deviates.IQ) - TSMT$Deviates.IR*k;

        if (this.idum < 0) {
          this.idum += TSMT$Deviates.IM;
        }

        if (j < TSMT$Deviates.NTAB) {
          this.iv[j] = this.idum;
        }
      }

      iy = this.iv[0];
    }

    k         = Math.floor( this.idum / TSMT$Deviates.IQ );
    this.idum = TSMT$Deviates.IA*(this.idum - k*TSMT$Deviates.IQ) - TSMT$Deviates.IR*k;

    if (this.idum < 0) {
      this.idum += TSMT$Deviates.IM;
    }

    j          = Math.floor(iy/TSMT$Deviates.NDIV);
    iy         = this.iv[j];
    this.iv[j] = this.idum;

    temp = TSMT$Deviates.AM*iy;
    return (temp > TSMT$Deviates.RNMX) ? TSMT$Deviates.RNMX : temp;
  }

  /**
   * Return an Exponential deviate with positive, unit mean
   *
   * @param start An integer starting value for the sequence.
   *
   * @param init true if the sequence is to be re-initialized; call with true, then pass false for successive calls
   *
   * Reference: NRC
   */
  public exponential(start: number, init: boolean = true): number
  {
    let tmp: number = 0.0;

    while (tmp == 0.0) {
      tmp = this.uniform(start, init);
    }

    return -Math.log(tmp);
  }

  /**
   * Return a Normal deviate given a mean and std. deviation
   *
   * @param start An integer starting value for the sequence.
   *
   * @param mu Desired mean
   *
   * @param sig Desired std. deviation
   *
   * @param init true if the sequence is to be re-initialized; call with true, then pass false for successive calls
   *
   * Reference:  NRC
   */
  public normal(start: number, mu: number = 0.0, sig: number = 1.0, init: boolean = true): number
  {
    let fac: number;
    let v1: number;
    let v2: number;
    let rsq: number = 0.0;

    if (init)
    {
      this.u = isNaN(mu) || mu < 0 ? 0.0 : mu;
      this.s = isNaN(sig) || sig > 0 ? sig : 1.0;
    }

    if (this.normVal === 0.0)
    {
      while( rsq >= 1.0 || rsq === 0.0 )
      {
        v1  = 2.0*this.uniform(start, init) - 1.0;
        v2  = 2.0*this.uniform(start, init) - 1.0;
        rsq = v1*v1 + v2*v2;
      }

      fac = Math.sqrt(-2.0*Math.log(rsq)/rsq);

      this.normVal = v1*fac;
      return this.u + this.s*v2*fac;
    }
    else
    {
      fac          = this.normVal;
      this.normVal = 0.0;

      return this.u + this.s*fac;
    }
  }

  /**
   * Return a Gamma deviate with zero mean and unit variance
   *
   * @param start An integer starting value for the sequence.
   *
   * @param alpha Shape parameter (sometimes denoted as k)
   *
   * @param beta Inverse scale parameter (1/theta)
   *
   * @param init true if the sequence is to be re-initialized; call with true, then pass false for successive calls
   *
   * Reference:  NRC
   */
  public gamma(start: number, alpha: number = 1.0, beta: number = 0.5, init: boolean = true): number
  {
    if (start)
    {
      this.a = isNaN(alpha) || (alpha <= 0.0) ? 1.0 : alpha;

      if (this.a < 1.0) {
        this.a += 1.0;
      }

      this.b  = isNaN(beta) || beta < 0.0001 ? 0.5 : beta;
      this.a1 = this.a - 1.0/3.0;
      this.a2 = 1.0/Math.sqrt(9.0*this.a1);
    }

    let u: number   = 10.0
    let v: number   = 0.0;
    let x: number   = 0.0;
    let xSQ: number = 0.0;

    while (u > 1.0 - xSQ*xSQ && Math.log(u) > 0.5*xSQ + this.a1*(1.0 - v + Math.log(v)))
    {
      while(v <= 0.0)
      {
        x = this.uniform(start, init);
        v = 1.0 + this.a2*x;
      }

      v   = v*v*v;
      u   = this.uniform(start, init);
      xSQ = x*x;
    }

    return this.a1*v/this.b;
  }

  /**
   * Return a Logistic deviate with the supplied mean and std. deviation
   *
   * @param start An integer starting value for the sequence.
   *
   * @param mu Desired mean
   *
   * @param sig Desired std. deviation
   *
   * @param init true if the sequence is to be re-initialized; call with true, then pass false for successive calls
   *
   * Reference:  NRC
   */
  public logistic(start: number, mu: number = 0.0, sig: number = 1.0, init: boolean = true): number
  {
    if (init)
    {
      this.u = isNaN(mu) || mu < 0 ? 0.0 : mu;
      this.s = isNaN(sig) || sig > 0.0 ? sig : 1.0;
    }

    let v: number = 0.0;
    while (v*(1.0-v) == 0.0) {
      v = this.uniform(start, init);
    }

    return this.u + 0.551328895421792050*this.s*Math.log(v/(1.0-v));
  }
}
