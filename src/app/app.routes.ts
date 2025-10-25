import { Routes } from '@angular/router';
import { AddQuestionComponent } from './add-question/add-question.component';
import { DisplayComponent } from './display/display.component';

export const routes: Routes = [
  { path: '', component: DisplayComponent },
  { path: 'add', component: AddQuestionComponent },];
