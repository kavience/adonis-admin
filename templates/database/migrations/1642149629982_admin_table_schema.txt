import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Config from '@ioc:Adonis/Core/Config'

export default class CreateAdminTables extends BaseSchema {
  public async up() {
    this.schema.createTable(Config.get('admin.database.users_table'), (table) => {
      table.increments('id')
      table.string('username', 190).unique()
      table.string('password', 60)
      table.string('name')
      table.string('avatar').nullable()
      table.string('remember_token', 100).nullable()
      table.timestamps()
    })

    this.schema.createTable(Config.get('admin.database.roles_table'), (table) => {
      table.increments('id')
      table.string('name', 50).unique()
      table.string('slug', 50).unique()
      table.timestamps()
    })

    this.schema.createTable(Config.get('admin.database.permissions_table'), (table) => {
      table.increments('id')
      table.string('name', 50).unique()
      table.string('slug', 50).unique()
      table.string('http_method').nullable()
      table.text('http_path').nullable()
      table.timestamps()
    })

    this.schema.createTable(Config.get('admin.database.menu_table'), (table) => {
      table.increments('id')
      table.integer('parent_id').defaultTo(0)
      table.integer('order').defaultTo(0)
      table.string('title', 50)
      table.string('icon', 50)
      table.string('uri').nullable()
      table.string('permission').nullable()

      table.timestamps()
    })

    this.schema.createTable(Config.get('admin.database.role_users_table'), (table) => {
      table.integer('role_id')
      table.integer('user_id')
      table.index(['role_id', 'user_id'])
      table.timestamps()
    })

    this.schema.createTable(Config.get('admin.database.role_permissions_table'), (table) => {
      table.integer('role_id')
      table.integer('permission_id')
      table.index(['role_id', 'permission_id'])
      table.timestamps()
    })

    this.schema.createTable(Config.get('admin.database.user_permissions_table'), (table) => {
      table.integer('user_id')
      table.integer('permission_id')
      table.index(['user_id', 'permission_id'])
      table.timestamps()
    })

    this.schema.createTable(Config.get('admin.database.role_menu_table'), (table) => {
      table.integer('role_id')
      table.integer('menu_id')
      table.index(['role_id', 'menu_id'])
      table.timestamps()
    })

    this.schema.createTable(Config.get('admin.database.operation_log_table'), (table) => {
      table.increments('id')
      table.integer('user_id')
      table.string('path')
      table.string('method', 10)
      table.string('ip')
      table.text('input')
      table.index('user_id')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropSchemaIfExists(Config.get('admin.database.users_table'))
    this.schema.dropSchemaIfExists(Config.get('admin.database.roles_table'))
    this.schema.dropSchemaIfExists(Config.get('admin.database.permissions_table'))
    this.schema.dropSchemaIfExists(Config.get('admin.database.menu_table'))
    this.schema.dropSchemaIfExists(Config.get('admin.database.user_permissions_table'))
    this.schema.dropSchemaIfExists(Config.get('admin.database.role_users_table'))
    this.schema.dropSchemaIfExists(Config.get('admin.database.role_permissions_table'))
    this.schema.dropSchemaIfExists(Config.get('admin.database.role_menu_table'))
    this.schema.dropSchemaIfExists(Config.get('admin.database.operation_log_table'))
  }
}
