import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { EtudiantService } from './etudiant.service';
import { EtudiantRequest } from '../models/etudiant-request.model';
import { EtudiantResponse } from '../models/etudiant-response.model';

describe('EtudiantService', () => {
  let service: EtudiantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EtudiantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Vérifie : list() doit faire un GET sur /api/etudiants

  it('list() doit faire un GET sur /api/etudiants', () => {
    const mockResponse: EtudiantResponse[] = [
      { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
    ];

    service.list().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // Vérifie : getById() doit faire un GET sur /api/etudiants/:id

  it('getById() doit faire un GET sur /api/etudiants/:id', () => {
    const mock: EtudiantResponse = {
      id: 42,
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
    };

    service.getById(42).subscribe((data) => {
      expect(data).toEqual(mock);
    });

    const req = httpMock.expectOne('/api/etudiants/42');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  // Vérifie : create() doit faire un POST sur /api/etudiants

  it('create() doit faire un POST sur /api/etudiants', () => {
    const payload: EtudiantRequest = {
      firstName: 'Alan',
      lastName: 'Turing',
      email: 'alan@example.com',
    };
    const created: EtudiantResponse = { id: 5, ...payload };

    service.create(payload).subscribe((data) => {
      expect(data).toEqual(created);
    });

    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(created);
  });

  // Vérifie : update() doit faire un PUT sur /api/etudiants/:id

  it('update() doit faire un PUT sur /api/etudiants/:id', () => {
    const payload: EtudiantRequest = {
      firstName: 'Alan',
      lastName: 'Turing',
      email: 'alan.new@example.com',
    };
    const updated: EtudiantResponse = { id: 5, ...payload };

    service.update(5, payload).subscribe((data) => {
      expect(data).toEqual(updated);
    });

    const req = httpMock.expectOne('/api/etudiants/5');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(updated);
  });

  // Vérifie : delete() doit faire un DELETE sur /api/etudiants/:id

  it('delete() doit faire un DELETE sur /api/etudiants/:id', () => {
    service.delete(7).subscribe((data) => {
      expect(data).toBeUndefined();
    });

    const req = httpMock.expectOne('/api/etudiants/7');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
