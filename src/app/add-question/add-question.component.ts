import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent {
  questionForm;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      answerText: ['', Validators.required],
      points: this.fb.array([this.fb.control('')])
    });
  }

  get points(): FormArray {
    const pointsArray = this.questionForm.get('points');
    if (!pointsArray) {
      throw new Error('Points FormArray not found');
    }
    return pointsArray as FormArray;
  }

  addPoint(): void {
    this.points.push(this.fb.control(''));
  }

  removePoint(index: number): void {
    if (index >= 0 && index < this.points.length) {
      this.points.removeAt(index);
    }
    // Ensure there's always at least one point field
    if (this.points.length === 0) {
      this.addPoint();
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const question = {
        question: formValue.question || '',
        answer: {
          text: formValue.answerText || '',
          points: (formValue.points || [])
            .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
        }
      };

      this.questionService.addQuestion(question);
      this.router.navigate(['/']);
    }
  }
}