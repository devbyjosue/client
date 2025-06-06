import { Component, EventEmitter, Input, Output,  signal } from '@angular/core';
import {FormGroup ,FormControl, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table-form',
  imports: [ReactiveFormsModule],
  templateUrl: './table-form.html',
  styleUrl: './table-form.css'
})
export class TableForm {

  formSignal = signal(false);
  @Input() formDataForEdition = signal(false);
  @Input() isFormEdition = signal(false);

  @Output() closeForm = new EventEmitter<boolean>();
  @Output() submitForm = new EventEmitter<any>();
  entryForm = new FormGroup({
    table : new FormControl(''),
    value1: new FormControl(''),
    value2: new FormControl(''),
    value3: new FormControl('')
  })

  constructor(private route: ActivatedRoute) {}

  toggleForm(){
    this.formSignal.set(!this.formSignal());
    
    if (this.formSignal()){
      this.closeForm.emit(true);
    }
  }
  onSubmitForm(){
     this.route.paramMap.subscribe(params => {
      const section = params.get('section');
      const subSection = params.get('subSection');
      
      this.entryForm.patchValue({table: subSection});
      
    });
    // console.log(this.entryForm.value);
    this.submitForm.emit(this.entryForm.value);
  }

  isEdition(){
    console.log("OLA",this.formDataForEdition);
    // if(this.formDataForEdition.value === null){
    //   return true;
    // }
    return this.formDataForEdition;
  }

  

}
