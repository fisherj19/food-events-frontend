import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from '../services/auth.service';
import { Message, MessageService } from '../services/message.service';

@Component({
  templateUrl: './register.component.html',
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  email: string;
  regForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: string,
    private readonly authService: AuthService,
    private readonly msgService: MessageService,
    private readonly formBuilder: FormBuilder
  ) { }

  get emailFld() { return this.regForm.get('email'); }
  get displayName() { return this.regForm.get('displayName'); }
  get password() { return this.regForm.get('password'); }

  ngOnInit() {
    this.email = this.data;
    this.regForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email, Validators.maxLength(75)]],
      displayName: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.authService.createRegular(this.regForm.value).then(
      (rtn: Message) => {
        const title = rtn.success ? 'Success!' : 'Error Saving New Registration';
        this.msgService.publish({ ...rtn, title });
        this.dialogRef.close();
      }
    );
  }
}
