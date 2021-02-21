import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Dialog {
  title: string;
  content: string;
}

@Component({
  templateUrl: 'dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dialog
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
