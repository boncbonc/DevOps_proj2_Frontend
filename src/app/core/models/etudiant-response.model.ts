import { EtudiantRequest } from './etudiant-request.model';

/**
 * DTO côté front correspondant à EtudiantResponseDTO côté back.
 */
export interface EtudiantResponse extends EtudiantRequest {
  id: number;
}
