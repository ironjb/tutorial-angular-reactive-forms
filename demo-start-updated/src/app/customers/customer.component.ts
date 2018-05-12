import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';	// throttleTime, distinctUntilChanged may also be helpful in other situations

import { Customer } from './customer';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } {
	let emailControl = c.get('email');
	let confirmControl = c.get('confirmEmail');
	if (emailControl.pristine || confirmControl.pristine) {
		return null;
	}
	if (emailControl.value === confirmControl.value) {
		return null;
	}
	return { 'match': true };
}

function ratingRange(min: number, max: number): ValidatorFn {
	return (c: AbstractControl): { [key: string]: boolean } | null => {
		if (c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
			return { 'range': true };
		}
		return null;
	}
}

@Component({
	selector: 'my-signup',
	templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent  {
	// ---------- Properties
		customerForm: FormGroup;
		customer: Customer= new Customer();
		emailMessage: string;

		private validationMessages = {
			required: 'Please enter your email address.'
			, pattern: 'Please enter a valid email address.'
		};

		get addresses(): FormArray { return <FormArray>this.customerForm.get('addresses'); }

	// ---------- Constructor
		constructor(private _fb: FormBuilder) {}

	// ---------- Lifecycle Hooks
		ngOnInit(): void {
			this.customerForm = this._fb.group({
				firstName: ['', [Validators.required, Validators.minLength(3)]]
				, lastName: ['', [Validators.required, Validators.maxLength(50)]]	//{ value: 'n/a', disabled: true }
				, emailGroup: this._fb.group({
					email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]]
					, confirmEmail: ['', Validators.required]
				}, { validator: emailMatcher })
				, phone: ''
				, notification: 'email'
				, rating: ['', ratingRange(1,5)]
				, sendCatalog: true
				, addresses: this._fb.array([this.buildAddress()])
			});

			this.customerForm.get('notification').valueChanges.subscribe(value => {
				this.setNotification(value);
			});

			const emailControl = this.customerForm.get('emailGroup.email');
			emailControl.valueChanges.debounceTime(1000).subscribe(value => {
				this.setMessage(emailControl);
			});
		}

	// ---------- Methods
		buildAddress(): FormGroup {
			return this._fb.group({
				addressType: 'home'
				, street1: ''
				, street2: ''
				, city: ''
				, state: ''
				, zip: ''
			});
		}

		addAddress(): void {
			this.addresses.push(this.buildAddress());
		}

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

		setMessage(c: AbstractControl): void {
			this.emailMessage = '';
			if ((c.touched || c.dirty) && c.errors) {
				this.emailMessage = Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
			}
		}

		setNotification(notifyVia: string): void {
			const phoneControl = this.customerForm.get('phone');
			if (notifyVia === 'text') {
				phoneControl.setValidators(Validators.required);
			} else {
				phoneControl.clearValidators();
			}
			phoneControl.updateValueAndValidity();
		}
 }
