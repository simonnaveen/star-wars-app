import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterListComponent } from './manage-characters/character-list/character-list.component';
import { CharacterDetailsComponent } from './manage-characters/character-details/character-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/characters', pathMatch: 'full' }, // default route
  { path: 'characters', component: CharacterListComponent },
  { path: 'characters/:id', component: CharacterDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
