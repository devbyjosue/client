import { Component, EventEmitter, Input, Output, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// import { DxFormModule } from 'devextreme-angular'; // Removed: No longer using DevExtreme forms

@Component({
  selector: 'app-table-form',
  standalone: true,
  imports: [ReactiveFormsModule], // DxFormModule removed, ReactiveFormsModule is crucial
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
      // Ensure that if table data is part of formDataForEdition, it's also patched
      this.entryForm.patchValue({
        table: this.formDataForEdition.table, // Assuming 'table' might also come from formDataForEdition
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

  // Removed: updateFormValue is no longer needed as Reactive Forms handle binding directly
  // updateFormValue(e: any) {
  //   if (e.dataField && this.entryForm.get(e.dataField)) {
  //     this.entryForm.get(e.dataField)?.setValue(e.value, { emitEvent: false });
  //   }
  // }

  onSubmitDxForm() { // Renamed from onSubmitDxForm to reflect new context, but kept for consistency
    console.log('Submitting HTML Form:', this.entryForm.value);
    // console.log('Submitting DxForm:', this.entryForm.value);
    this.submitForm.emit(this.entryForm.value);
    this.toggleForm(); // Optionally close form on submit
  }

  isEdition() {
    return this.isFormEdition();
  }
}