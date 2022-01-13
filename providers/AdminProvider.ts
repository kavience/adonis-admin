/*
 * adonis-admin
 *
 * (c) Kavience <kavience@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationContract } from "@ioc:Adonis/Core/Application";

/**
 * Provider to register lucid filter with the IoC container
 */
export default class AdminProvider {
  public static needsApplication = true;
  constructor(protected app: ApplicationContract) {}

  public register(): void {}

  public boot(): void {}
}
