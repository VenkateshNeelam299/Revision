import { Routes } from '@angular/router';
import { AddQuestionComponent } from './add-question/add-question.component';
import { DisplayComponent } from './display/display.component';

export const routes: Routes = [
  { path: '', redirectTo: 'course/angular', pathMatch: 'full' },
  { path: 'course/:id', component: DisplayComponent },
  { path: 'add', component: AddQuestionComponent },
  { path: '**', redirectTo: 'course/angular' }
];
