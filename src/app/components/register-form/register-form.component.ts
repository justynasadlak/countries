import { Component, OnInit } from '@angular/core';
import { Country } from '../../models/country';
import { CountryDataService } from '../../services/country-data.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { DataToSend } from '../../models/data-to-send';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  countries: Country[];
  registerForm: FormGroup;
  population$: Observable<number>;

  constructor(
    private formBuilder: FormBuilder,
    private countryDataService: CountryDataService) {
  }

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
      country: ['', this.containsInCountriesListValidator()]
    });

    this.population$ = this.getCountryPopulation();
  }

  private getCountryPopulation(): Observable<number> {
    return this.registerForm.controls.country.valueChanges.pipe(
      map(country => country.population)
    );
  }

  private containsInCountriesListValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      console.log(control.value.name)
      // if(this.countries) {
        console.log(this.countries && control.value ? { valid : !!this.countries.find(c => c.name === control.value.name) } : null);
      // }

      return this.countries && control.value ? { valid : !!this.countries.find(c => c.name === control.value.name) } : null;
    }
  }
}
