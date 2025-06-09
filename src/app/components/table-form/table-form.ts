import { Component, EventEmitter, Input, Output, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DxFormModule } from 'devextreme-angular';

@Component({
  selector: 'app-table-form',
  standalone: true, // Assuming standalone for DxFormModule import
  imports: [ReactiveFormsModule, DxFormModule], // DxFormModule added
  templateUrl: './table-form.html',
  styleUrl: './table-form.css'
})
export class TableForm implements OnInit, OnChanges {

  currentSubSection = signal('');
  formSignal = signal(false);

  @Input() formDataForEdition: any = null; // Changed to any for flexibility, initialize to null
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
        value1: this.formDataForEdition.value1,
        value2: this.formDataForEdition.value2,
        value3: this.formDataForEdition.value3,
      });
    }
     if (changes['isFormEdition']) {
      // console.log('isFormEdition changed:', this.isFormEdition());
    }
  }

  toggleForm() {
    this.formSignal.set(!this.formSignal());
    if (this.formSignal()) {
      this.closeForm.emit(true);
    }
  }

  updateFormValue(e: any) {
    // This function will be called when a field in dx-form changes.
    // Update the corresponding FormControl in entryForm.
    if (e.dataField && this.entryForm.get(e.dataField)) {
      this.entryForm.get(e.dataField)?.setValue(e.value, { emitEvent: false });
    }
  }

  onSubmitDxForm() {
    // console.log('Submitting DxForm:', this.entryForm.value);
    this.submitForm.emit(this.entryForm.value);
    this.toggleForm(); // Optionally close form on submit
  }

  isEdition() {
    return this.isFormEdition();
  }
}
