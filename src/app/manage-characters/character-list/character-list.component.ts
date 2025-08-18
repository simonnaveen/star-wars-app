import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SwapiService } from 'src/app/services/swapi.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  displayedCharacters: any[] = [];
  allCharacters: any[] = []; // keep all data for filtering
  displayedColumns: string[] = ['si', 'name', 'species', 'birth_year'];
  page = 1;
  pageSize = 10;

  // filters
  films: string[] = [];
  speciesList: string[] = [];
  vehicles: string[] = [];
  starships: string[] = [];
  birthyear: string[] = [];

  activeFilters: any = {};

  canGoNext = true;

  constructor(
    private apiService: SwapiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? +params['page'] : 1;
      this.loadCharacters();
    });
  }

  // Load characters
  loadCharacters(): void {
    this.apiService.getCharacters(this.page).subscribe((data: any) => {
      this.allCharacters = data.results;

      // build filters dynamically from already fetched data
      this.buildFilters();

      // show initial data
      this.applyFilters();
    });
  }

  // ✅ Build filters from character objects (not API calls)
  buildFilters(): void {
    const filmsSet = new Set<string>();
    const speciesSet = new Set<string>();
    const vehiclesSet = new Set<string>();
    const starshipsSet = new Set<string>();
    const birthYearSet = new Set<string>();

    this.allCharacters.forEach(c => {
      // films
      c.films.forEach((f: string) => filmsSet.add(this.extractId(f, 'films')));
      // species
      c.species.forEach((s: string) => speciesSet.add(this.extractId(s, 'species')));
      // vehicles
      c.vehicles.forEach((v: string) => vehiclesSet.add(this.extractId(v, 'vehicles')));
      // starships
      c.starships.forEach((s: string) => starshipsSet.add(this.extractId(s, 'starships')));
      // birth year
      if (c.birth_year) birthYearSet.add(c.birth_year);
    });

    this.films = Array.from(filmsSet);
    this.speciesList = Array.from(speciesSet);
    this.vehicles = Array.from(vehiclesSet);
    this.starships = Array.from(starshipsSet);
    this.birthyear = Array.from(birthYearSet).sort(); // ✅ sorted birth years
  }


  // Extract ID (like 1, 2, 14) and prefix with label
  extractId(url: string, type: string): string {
    const id = url.match(/\/(\d+)\/$/)?.[1];
    return id ? `${this.capitalize(type)} ${id}` : `${this.capitalize(type)} ?`;
  }
  goToDetails(character: any) {
    const id = character.url.split('/').filter(Boolean).pop(); 
    this.router.navigate(['/characters', id]);
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // pagination
  nextPage(): void {
    this.page++;
    this.loadCharacters();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadCharacters();
    }
  }


  // just display species or fallback
  getSpeciesName(character: any): string {
    if (!character.species || character.species.length === 0) {
      return 'Unknown';
    }
  
    // Convert each species URL into "Species <id>"
    return character.species
      .map((url: string) => {
        const id = url.match(/\/species\/(\d+)\//)?.[1]; // extract the number
        return id ? `Species ${id}` : 'Unknown';
      })
      .join(', ');
  }
  

  // Handle filter change
  onFiltersChanged(filters: any): void {
    this.activeFilters = filters;
    this.applyFilters();
  }

  siNumber(index: number): number {
    return (this.page - 1) * this.pageSize + (index + 1);
  }

  applyFilters(): void {
    let filtered = [...this.allCharacters];

    if (this.activeFilters.species) {
      filtered = filtered.filter(c =>
        c.species.some((s: string) => this.extractId(s, 'species') === this.activeFilters.species)
      );
    }

    if (this.activeFilters.film) {
      filtered = filtered.filter(c =>
        c.films.some((f: string) => this.extractId(f, 'films') === this.activeFilters.film)
      );
    }

    if (this.activeFilters.vehicle) {
      filtered = filtered.filter(c =>
        c.vehicles.some((v: string) => this.extractId(v, 'vehicles') === this.activeFilters.vehicle)
      );
    }

    if (this.activeFilters.starship) {
      filtered = filtered.filter(c =>
        c.starships.some((s: string) => this.extractId(s, 'starships') === this.activeFilters.starship)
      );
    }

    // ✅ Birth year filter
    if (this.activeFilters.birthyear) {
      filtered = filtered.filter(c => c.birth_year === this.activeFilters.birthyear);
    }

    
    // Pagination
    const start = (this.page - 1) * this.pageSize;
    this.canGoNext = filtered.length > start + this.pageSize;
    this.displayedCharacters = filtered.slice(start, start + this.pageSize);
  }
}


