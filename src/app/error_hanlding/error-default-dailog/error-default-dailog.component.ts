import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-error-default-dailog',
  imports: [MatDialogModule, MatButtonModule, MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './error-default-dailog.component.html',
  styleUrl: './error-default-dailog.component.css',
})
export class ErrorDefaultDailogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
