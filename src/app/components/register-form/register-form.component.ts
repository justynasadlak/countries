import { Component, OnInit } from '@angular/core';
import { Country } from '../../models/country';
import { CountryDataService } from '../../services/country-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataToSend } from '../../models/data-to-send';

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
    this.initForm();
  }

  onSubmit(): void {
    const dataToSend: DataToSend = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      alpha2Code: this.registerForm.value.country.alpha2Code
    };
    console.log(dataToSend);
  }

  displayCountryName(country: Country): string | Country {
    return country ? country.name : country;
  }

  private initCountries(): void {
    this.countryDataService.getAllCountries().subscribe(res => this.countries = res);
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      country: ['']
    });
  }
}
