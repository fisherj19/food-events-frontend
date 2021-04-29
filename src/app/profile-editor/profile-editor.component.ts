import { Component, OnInit,  ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { MatDialogRef} from '@angular/material/dialog';
import { UserDetails } from '../account/account.service';



import { AuthService } from '../services/auth.service';
import { Message, MessageService } from '../services/message.service';



@Component({
  selector: 'profile-editor.component',
  templateUrl: './profile-editor.component.html',
  styles: [` mat-form-field { width: 100%;}`,
  `./profile-editor.component.css`],
  changeDetection: ChangeDetectionStrategy.OnPush
})



export class ProfileEditorComponent implements OnInit {
  email: string;
  editProfileForm: FormGroup;
  

  constructor(
    public dialogRef: MatDialogRef<ProfileEditorComponent>,
    //@Inject(MAT_DIALOG_DATA) private readonly data: string,
    private readonly authService: AuthService,
    private readonly msgService: MessageService,
    private readonly formBuilder: FormBuilder
  ) { }

  //checkbox variables
  checked = false;
  align = 'start';

  userInfo: UserDetails;

  get first_name() {return this.editProfileForm.get('first_name');}
  get last_name()  {return this.editProfileForm.get('last_name');}
  get bannerID()  {return this.editProfileForm.get('bannerID');}
  get displayName() {return this.editProfileForm.get('displayName');}
  get phoneNumber() {return this.editProfileForm.get('phoneNumber');}

  ngOnInit() {
    this.userInfo = this.authService.profile;
    this.editProfileForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.maxLength(15)]],
      last_name: ['', [Validators.required, Validators.maxLength(15)]],
      bannerID: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(9)]],
      displayName: ['', [Validators.required, Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(10)]],
      
  });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.authService.createRegular(this.editProfileForm.value).then(
      (rtn: Message) => {
        const title = rtn.success ? 'Success!' : 'Error Saving New Profile Information';
        this.msgService.publish({ ...rtn, title });
        this.dialogRef.close();
      }
    );
  }
  
  

  onUpdate(): void{
    this.authService.update(this.editProfileForm.value, "", this.userInfo).then(
    (rtn: Message) => {
      const title = rtn.success ? 'Success!' : 'Error Updating Profile';
      this.msgService.publish({ ...rtn, title });
      this.dialogRef.close();
}
);
}
}




