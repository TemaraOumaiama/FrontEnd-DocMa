import { Departement } from 'src/app/departement/departement'; // Assurez-vous d'ajuster le chemin d'importation en fonction de votre structure de fichiers
import { User } from 'src/app/user/user'; // Assurez-vous d'ajuster le chemin d'importation en fonction de votre structure de fichiers
import { Categorie } from 'src/app/categorie/categorie'; // Assurez-vous d'ajuster le chemin d'importation en fonction de votre structure de fichiers



export interface Document{
    id: number;
    nom: string;
    metadonnes: string;
    createdBy: User;
    modifiedBy: User;
    categorie: Categorie;
    departement: Departement;
    dateCreation: Date;
    dateModification: Date;
    content: Blob;
    file?: File;
}

   