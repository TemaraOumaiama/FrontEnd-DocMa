import { Departement } from 'src/app/departement/departement'; // Assurez-vous d'ajuster le chemin d'importation en fonction de votre structure de fichiers

export class User{
 public userId: number;
 public username :string;
 public email:string;
 public password:string;
 public nom : string;
 public prenom : string;
 public usertype : string;
 public datecreation: Date|null;
 public datelastactivity: Date|null;
 public imageUrl: string|null;
 public phone: string;
 public  active: boolean;
 public notLocked: boolean;
 public role: string;
 public authorities: [];
 public lastLoginDateDisplay: Date|null;





  constructor() {
    this.userId = 0;
    this.prenom = '';
    this.nom = '';
    this.username = '';
    this.email = '';
    this.datelastactivity = null;
    this.lastLoginDateDisplay = null;
    this.datecreation = null;
    this.imageUrl = '';
    this.active = false;
    this.notLocked = false;
    this.role = '';
    this.authorities = [];
    this.phone=''
    this.password='';
    this.usertype=''
  }






}

   