import { Departement } from 'src/app/departement/departement';
import { User } from 'src/app/user/user';
import { Categorie } from 'src/app/categorie/categorie';

export interface Contrat {
  id: number;
  nom: string;
  metadonnes: string;
  createdBy: User;
  modifiedBy: User;
  categorie: Categorie;
  departement: Departement;
  dateCreation: Date;
  dateModification: Date;
  dateDebut: Date;
  dateEchance: Date;
  partieContractante: string;
  fournisseur: string;
  delaiPreavis: number;
  statu: string;
  content: Blob;
  file?: File | undefined;
}
