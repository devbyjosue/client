import { Component, EventEmitter, Input, Output, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './table-form.html',
  styleUrl: './table-form.css'
})
export class TableForm implements OnInit, OnChanges {

  currentSubSection = signal('');
  formSignal = signal(false);

  @Input() formDataForEdition: any = null;
  @Input() isFormEdition = signal(false);

  @Output() closeForm = new EventEmitter<boolean>();
  @Output() submitForm = new EventEmitter<any>();

  
  entryForm = new FormGroup({
    table: new FormControl(''),
    value1: new FormControl(''),
    value2: new FormControl(''),
    value3: new FormControl('')
  });

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const subSection = params.get('subSection');
      if (subSection) {
        this.entryForm.patchValue({ table: subSection });
        this.currentSubSection.set(subSection);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formDataForEdition'] && this.formDataForEdition) {
      this.entryForm.patchValue({
        table: this.formDataForEdition.table, 
        value1: this.formDataForEdition.value1,
        value2: this.formDataForEdition.value2,
        value3: this.formDataForEdition.value3,
      });
    }
      if (changes['isFormEdition']) {
    }
  }

  toggleForm() {
    this.formSignal.set(!this.formSignal());
    if (this.formSignal()) {
      this.closeForm.emit(true);
    }
  }

 

  onSubmitDxForm() { 
    console.log('Submitting HTML Form:', this.entryForm.value);
    this.submitForm.emit(this.entryForm.value);
    this.toggleForm();
  }

  isEdition() {
    return this.isFormEdition();
  }
}