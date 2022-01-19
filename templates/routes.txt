import Route from '@ioc:Adonis/Core/Route'

Route.get('/admin', async ({ view }) => {
  return view.render('admin/index')
})
