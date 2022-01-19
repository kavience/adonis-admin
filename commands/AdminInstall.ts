/*
 * adonis-admin
 *
 * (c) Kavience <kavience@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import npath from 'path'
import fse from 'fs-extra'
import { BaseCommand } from '@adonisjs/core/build/standalone'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { KernelContract } from '@adonisjs/ace/build/src/Contracts'
import { files } from '@adonisjs/sink'

export default class AdminInstall extends BaseCommand {
  public static commandName = 'admin:install'
  public static description = 'Install adonis-admin'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  private directory = ''
  private config: ConfigContract

  constructor(application: ApplicationContract, kernel: KernelContract) {
    super(application, kernel)
    this.config = application.container.use('Adonis/Core/Config')
    this.directory = this.config.get('admin.directory')
  }

  public makeDir(path = '') {
    const dirPath = npath.join(this.directory, path)
    fse.mkdirSync(dirPath, { mode: 0o755 })
  }

  public async createHomeController() {
    const stub = npath.join(__dirname, '..', 'templates', 'controllers', 'HomeController.txt')

    await this.generator
      .addFile('HomeController')
      .stub(stub)
      .destinationDir(`${this.directory}/Controllers`)
      .useMustache()
      .appRoot(this.application.cliCwd || this.application.appRoot)

    this.logger.success('HomeController file was created')
  }

  public async createAuthController() {
    const stub = npath.join(__dirname, '..', 'templates', 'controllers', 'AuthController.txt')

    await this.generator
      .addFile('AuthController')
      .stub(stub)
      .destinationDir(`${this.directory}/Controllers`)
      .useMustache()
      .appRoot(this.application.cliCwd || this.application.appRoot)

    this.logger.success('AuthController file was created')
  }

  public async createExampleController() {
    const stub = npath.join(__dirname, '..', 'templates', 'controllers', 'ExampleController.txt')

    await this.generator
      .addFile('ExampleController')
      .stub(stub)
      .destinationDir(`${this.directory}/Controllers`)
      .useMustache()
      .appRoot(this.application.cliCwd || this.application.appRoot)

    this.logger.success('ExampleController file was created')
  }

  /**
   * Copy view template files
   */
  public async createViewTemplate() {
    const viewPath = npath.join(__dirname, '..', 'templates', 'view')
    await fse.copy(viewPath, this.application.viewsPath('admin'))
  }

  public async createBootstrapFile() {
    const stub = npath.join(__dirname, '..', 'templates', 'bootstrap.txt')

    await this.generator
      .addFile('bootstrap')
      .stub(stub)
      .destinationDir(this.directory)
      .useMustache()
      .appRoot(this.application.cliCwd || this.application.appRoot)

    this.logger.success('Bootstrap file was created')
  }

  /**
   * Create routes file and write into core routes
   */
  public async createRoutesFile() {
    const stub = npath.join(__dirname, '..', 'templates', 'routes.txt')

    await this.generator
      .addFile('routes')
      .stub(stub)
      .destinationDir(this.directory)
      .useMustache()
      .appRoot(this.application.cliCwd || this.application.appRoot)

    this.logger.success('Routes file was created')
  }

  /**
   * Init adonis config
   */
  public async initAdonisConfig() {
    const adonisRcFile = new files.AdonisRcFile(this.application.appRoot)
    adonisRcFile.setPreload(`./${this.directory}/routes`)
    adonisRcFile.commit()
    this.logger.success('Add routes file to preloads')
  }

  /**
   * Init database migration
   * @returns void
   */
  public async runMigration() {
    try {
      await this.kernel.exec('migration:run', [])
      this.logger.success('migration:run was successed')
    } catch (error) {
      this.logger.error(
        'It seems like you did not configure @adonisjs/lucid, see https://docs.adonisjs.com/guides/database/introduction'
      )
    }
  }

  /**
   * Init admon directory
   * @returns void
   */
  public async initAdminDirectory() {
    if (fse.existsSync(this.directory)) {
      this.logger.error(
        `${this.directory} directory already exists,It seems like you have install adonis admin, can't install repeat`
      )

      throw new Error('Repeat install adonis admin')
    }

    this.makeDir()
    this.logger.success('Admin directory was created')

    this.makeDir('Controllers')

    this.createHomeController()
    this.createAuthController()
    this.createExampleController()

    this.createViewTemplate()
    this.createBootstrapFile()
    this.createRoutesFile()
  }

  /**
   * Execute command
   * @returns void
   */
  public async run() {
    await this.initAdminDirectory()
    await this.initAdonisConfig()
    await this.runMigration()

    await this.generator.run()
  }
}
