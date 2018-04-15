import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Customer } from './customer';

@Component({
	selector: 'my-signup',
	templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent  {
	// ---------- Properties
		customerForm: FormGroup;
		customer: Customer= new Customer();

	// ---------- Constructor
		constructor(private _fb: FormBuilder) {}

	// ---------- Lifecycle Hooks
		ngOnInit(): void {
			this.customerForm = this._fb.group({
				firstName: ''
				, lastName: ''	//{ value: 'n/a', disabled: true }
				, email: ''
				, sendCatalog: true
			});
			// this.customerForm = new FormGroup({
			// 	firstName: new FormControl()
			// 	, lastName: new FormControl()
			// 	, email: new FormControl()
			// 	, sendCatalog: new FormControl(true)
			// });
		}
	// ---------- Methods

		populateTestData(): void {
			this.customerForm.patchValue({
				firstName: 'Jack'
				, lastName: 'Harkness'
				// , email: 'jack@torchwood.com'
				, sendCatalog: false
			});
		}

		save() {
			console.log(this.customerForm);
			console.log('Saved: ' + JSON.stringify(this.customerForm.value));
		}
 }
