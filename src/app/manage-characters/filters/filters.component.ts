import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Input() films: string[] = [];
  @Input() speciesList: string[] = [];
  @Input() vehicles: string[] = [];
  @Input() starships: string[] = [];
  @Input() birthyear: string[] = [];
  
  @Output() filtersChanged = new EventEmitter<any>();

  selectedFilm = '';
  selectedSpecies = '';
  selectedVehicle = '';
  selectedStarship = '';
  selectedBirthyear = '';

  applyFilters() {
    this.filtersChanged.emit({
      film: this.selectedFilm,
      species: this.selectedSpecies,
      vehicle: this.selectedVehicle,
      starship: this.selectedStarship,
      birthyear: this.selectedBirthyear
    });
  }

  clearFilters() {
    this.selectedFilm = '';
    this.selectedSpecies = '';
    this.selectedVehicle = '';
    this.selectedStarship = '';
    this.selectedBirthyear = '';

    this.applyFilters();
  }
}