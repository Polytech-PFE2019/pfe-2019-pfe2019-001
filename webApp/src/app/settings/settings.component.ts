import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/SocketService';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { SocketService } from '../services/SocketService';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  errorCred = false

  submit(name, mail) {
    this.socket.emitName("name",name);
    this.socket.emitMail("mail",mail);

    document.getElementById("validation").style.display = 'inline';

  }

  constructor(private socket : SocketService) { }

  ngOnInit() {

    this.socket.errorCred.subscribe((data) => {
      this.errorCred = data;
    })

  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);

}