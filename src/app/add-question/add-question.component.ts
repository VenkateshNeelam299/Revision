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
  template: `
    <div class="add-question-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Add New Question</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Question</mat-label>
              <textarea matInput formControlName="question" rows="3"></textarea>
              <mat-error *ngIf="questionForm.get('question')?.hasError('required')">
                Question is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Answer Text</mat-label>
              <textarea matInput formControlName="answerText" rows="4"></textarea>
              <mat-error *ngIf="questionForm.get('answerText')?.hasError('required')">
                Answer text is required
              </mat-error>
            </mat-form-field>

            <div formArrayName="points" class="points-container">
              <h3>Key Points</h3>
              <div *ngFor="let point of points.controls; let i=index" class="point-row">
                <mat-form-field appearance="fill" class="point-input">
                  <mat-label>Point {{i + 1}}</mat-label>
                  <input matInput [formControlName]="i">
                </mat-form-field>
                <button type="button" mat-icon-button color="warn" (click)="removePoint(i)">
                  <mat-icon>remove_circle</mat-icon>
                </button>
              </div>
              <button type="button" mat-stroked-button (click)="addPoint()">
                <mat-icon>add</mat-icon>
                Add Point
              </button>
            </div>

            <div class="form-actions">
              <button type="button" mat-stroked-button (click)="goBack()">
                Cancel
              </button>
              <button type="submit" mat-raised-button color="primary" [disabled]="!questionForm.valid">
                Save Question
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .add-question-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .points-container {
      margin: 1rem 0;

      h3 {
        color: #e0e0e0;
        margin-bottom: 1rem;
      }
    }

    .point-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      .point-input {
        flex: 1;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    @media (max-width: 600px) {
      .add-question-container {
        margin: 1rem;
        padding: 0;
      }
    }
  `]
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