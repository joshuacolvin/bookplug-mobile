import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'books',
    loadChildren: () =>
      import('./book-list/book-list.module').then(m => m.BookListPageModule),
  },
  {
    path: 'books/:id',
    loadChildren: () =>
      import('./book-detail/book-detail.module').then(
        m => m.BookDetailPageModule,
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then(m => m.RegisterPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then(m => m.SearchPageModule),
  },
  {
    path: 'book-preview',
    loadChildren: () =>
      import('./book-preview/book-preview.module').then(
        m => m.BookPreviewPageModule,
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then(m => m.SettingsPageModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'books',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
