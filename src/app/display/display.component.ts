import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  styleUrl: './display.component.scss'
})
export class DisplayComponent implements OnInit {
  items: Array<{ question: string; answer: { text: string; points: string[] } }> = [];
  currentIndex = 0;
  dataLoaded = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load QA data from assets/data.json
    this.http.get<any>('assets/data.json').subscribe({
      next: (res) => {
        if (Array.isArray(res?.items)) {
          this.items = res.items;
        } else if (res?.question) {
          // backward-compatible: single-item structure
          this.items = [
            {
              question: res.question,
              answer: res.answer || { text: '', points: [] },
            },
          ];
        }

        // ensure answer points arrays exist
        this.items = this.items.map((it: any) => ({
          question: it.question || '',
          answer: {
            text: it?.answer?.text || '',
            points: Array.isArray(it?.answer?.points) ? it.answer.points : [],
          },
        }));

        this.currentIndex = 0;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.error('Failed to load QA data:', err);
        this.dataLoaded = true; // avoid indefinite loading UI
      },
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

}
