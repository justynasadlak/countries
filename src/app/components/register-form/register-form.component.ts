import { Component, OnInit } from '@angular/core';
import { Country } from '../../models/country';
import { CountryDataService } from '../../services/country-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  countries: Country[];
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private countryDataService: CountryDataService) { }

  ngOnInit(): void {
    this.initCountries();
    this.registerForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      country: ['']
    });
  }

  onSubmit(): void {
    console.log(this.registerForm.value);
  }

  private initCountries(): void {
    this.countryDataService.getAllCountries().subscribe(res => this.countries = res);
  }
}
