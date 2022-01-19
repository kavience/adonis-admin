/*
 * adonis-admin
 *
 * (c) Kavience <kavience@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import fse from 'fs-extra'
import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class AdminUnInstall extends BaseCommand {
  public static commandName = 'admin:uninstall'
  public static description = 'Uninstall adonis-admin'

  /**
   * Remove files and directories.
   *
   * @return void
   */
  protected async removeFilesAndDirectories() {
    fse.removeSync(this.application.config.get('admin.directory'))
  }

  /**
   * Execute command
   */
  public async run(): Promise<void> {
    const sureUninstall = await this.prompt.confirm('Are you sure to uninstall adonis-admin?')
    if (!sureUninstall) {
      return
    }

    await this.removeFilesAndDirectories()

    this.logger.success('Uninstall adonis-admin success')

    await this.generator.run()
  }
}
