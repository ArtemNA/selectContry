import { Component, OnDestroy } from '@angular/core';
import { ApiService, Country } from '../../service/api.service';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-country-selector',
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss']
})
export class CountrySelectorComponent implements OnDestroy {

  destroy$ = new Subject<void>();

  formControl: FormControl = new FormControl(null);
  isCheckedOnly: FormControl = new FormControl(false);
  list!: Country[];
  filteredList!: Country[];
  checked: boolean = false;
  searchStr: string = '';
  constructor(private api: ApiService) {
    this.api.getListOfCountries().pipe(take(1)).subscribe(r => {
      this.list = r;
      this.filteredList = r;
    });
    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(newValue => {
      this.searchStr = newValue;
      this.filteredList = this.filterValues(newValue, this.checked);
    })
    this.isCheckedOnly.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(newValue => {
      this.checked = newValue;
      this.filteredList = this.filterValues(this.searchStr, newValue);
    })
  }

  filterValues(search: string, checked: boolean) {
    return this.list
      .filter((value: any) =>
      checked ? value.checked === checked : true)
      .filter((value: any) =>
      value.name.toLowerCase().indexOf(search.toLowerCase()) === 0);
  }

  clearFilters() {
    this.searchStr = '';
    this.checked = false;
    this.formControl.setValue('');
    this.isCheckedOnly.setValue(false);
    this.filteredList = this.list.map((el: any) => ({...el, checked: false}));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete()
  }
}
