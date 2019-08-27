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
  filteredCountries: Country[];

  constructor(
    private formBuilder: FormBuilder,
    private countryDataService: CountryDataService
  ) {
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
      country: ['', this.isOnCountriesListValidator()]
    });

    this.population$ = this.getCountryPopulation();
    this.setFilteredCountries();
  }

  private getCountryPopulation(): Observable<number> {
    return this.registerForm.controls.country.valueChanges.pipe(
      map(country => country.population)
    );
  }

  private isOnCountriesListValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } => {
      return !(this.countries && this.countries.find(country => country.name === control.value.name)) ? { valid: true } : null;
    };
  }

  private setFilteredCountries(): void {
    this.registerForm.controls.country.valueChanges.subscribe(value => {
      if (!(value instanceof Country)) {
        this.filteredCountries = this.filter(this.countries, value);
      }
    });
  }

  private filter(countries: Country[], value: string): Country[] {
    const filterValue: string = value.toLowerCase();
    return countries.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
