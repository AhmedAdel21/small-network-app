import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-error-default-dailog',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-default-dailog.component.html',
  styleUrl: './error-default-dailog.component.css',
})
export class ErrorDefaultDailogComponent {
  readonly dialogRef = inject(MatDialogRef<ErrorDefaultDailogComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
}
