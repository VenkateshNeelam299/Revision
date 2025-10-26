import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  items: Array<{ question: string; answer: { text: string; points: string[] } }> = [];
  currentIndex = 0;
  dataLoaded = false;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Listen to route changes and load appropriate course data
    this.route.paramMap.subscribe((params: ParamMap) => {
      const courseId = params.get('id') || 'angular';
      this.questionService.loadCourse(courseId);
    });

    this.questionService.questions$.subscribe(questions => {
      this.items = questions;
      this.currentIndex = 0;
      this.dataLoaded = true;
    });
  }

  get current() {
    return this.items && this.items.length ? this.items[this.currentIndex] : null;
  }

  hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  hasNext(): boolean {
    return this.currentIndex < this.items.length - 1;
  }

  prev(): void {
    if (this.hasPrev()) this.currentIndex--;
  }

  next(): void {
    if (this.hasNext()) this.currentIndex++;
  }

  addNewQuestion(): void {
    this.router.navigate(['/add']);
  }

  exportQuestions(): void {
    this.questionService.exportQuestions();
  }

}
