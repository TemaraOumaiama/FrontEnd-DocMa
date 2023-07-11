import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { NotificationService } from '../authentication/notification.service';
import { NotificationType } from '../enum/notification-type.enum';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CustomHttpRespone } from '../model/custom-http-response';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import { FileUploadStatus } from '../model/file-upload.status';
import { Role } from '../enum/role.enum';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[] = [];
  public user: User  =new User();
  public refreshing: boolean = false;
  public selectedUser: User = new User;
  public fileName!: string;
  public imageUrl: File | null | undefined;
  private subscriptions: Subscription[] = [];
  public editUser = new User();
  public currentUsername: string | undefined;


   
  
  public fileStatus = new FileUploadStatus();

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    const cachedUser = this.authenticationService.getUserFromLocalCache();
    if (cachedUser !== null) {
      this.user = cachedUser;
    }
        this.getUsers(true);
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }


  onPrenomChange(value: string) {
    if (this.user) {
      this.user.prenom = value;
    }
  }


  onNomChange(value: string) {
    if (this.user) {
      this.user.nom = value;
    }
  }
  
  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }

  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }
  onimageUrlChange(name: string | undefined, file: File | undefined) {
    if (name && file) {
      // Gérer le fichier
      console.log(name);
      console.log(file);
    }
  }
  
  
  

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormDate(null, userForm.value, this.imageUrl);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName = '';
          this.imageUrl = null;
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `${response.prenom} ${response.nom} added successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.imageUrl = null;
        }
      )
      );
  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFormDate(this.currentUsername, this.editUser, this.imageUrl);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.fileName = '';
          this.imageUrl = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.prenom} ${response.nom} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.imageUrl = null;
        }
      )
      );
  }

  public onUpdateCurrentUser(user: User): void {
    this.refreshing = true;
    if(this.authenticationService!=null)
    this.currentUsername = this.authenticationService?.getUserFromLocalCache()?.username;
    const formData = this.userService.createUserFormDate(this.currentUsername, user, this.imageUrl);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authenticationService.addUserToLocalCache(response);
          this.getUsers(false);
          this.fileName = '';
          this.imageUrl = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.prenom} ${response.nom} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
          this.imageUrl = null;
        }
      )
      );
  }

  public onUpdateimageUrl(): void {
    if (this.imageUrl) {
      const formData = new FormData();
      if (this.user) {
        formData.append('username', this.user.username);
      }
      formData.append('imageUrl', this.imageUrl);
      
      this.subscriptions.push(
        this.userService.updateimageUrl(formData).subscribe(
          (event: HttpEvent<any>) => {
            this.reportUploadProgress(event);
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
            this.fileStatus.status = 'done';
          }
        )
      );
    } else {
      // Gérer le cas où aucun fichier n'est sélectionné
      // Afficher un message d'erreur ou effectuer d'autres actions appropriées
    }
  }
  

  public onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      // Gérer le fichier sélectionné
      this.imageUrl = file;
      // Autres actions à effectuer avec le fichier sélectionné
    } else {
      // Gérer le cas où aucun fichier n'est sélectionné
    }
  }
  

  onUpdatePassword(form: NgForm) {
    if (form.invalid) {
      // Le formulaire est invalide, effectuez le traitement approprié (affichage d'un message d'erreur, etc.)
      return;
    }
  
    // Récupérez la valeur du nom d'utilisateur et du nouveau mot de passe depuis le formulaire
    const userName = form.value['username'];
    const newPassword = form.value['newPassword'];
  
    // Appelez la méthode updateUserPassword du service
    this.userService.updateUserPassword(userName, newPassword).subscribe(
      response => {
        // Traitement réussi, effectuez les actions nécessaires (affichage d'un message de succès, redirection, etc.)
        form.reset();
        // Par exemple, affichage d'un message de succès
        console.log('Mot de passe mis à jour avec succès.');
      },
      error => {
        // Traitement en cas d'erreur, effectuez les actions nécessaires (affichage d'un message d'erreur, etc.)
        console.error('Une erreur s\'est produite lors de la mise à jour du mot de passe :', error);
      }
    );
  }
  
  



  







  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        if(event.total)
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          if (this.user)
          this.user.imageUrl = `${event.body.imageUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS, `${event.body.prenom}\'s profile image updated successfully`);
          this.fileStatus.status = 'done';
          break;
        } else {
          this.sendNotification(NotificationType.ERROR, `Unable to upload image. Please try again`);
          break;
        }
      default:
        `Finished all processes`;
    }
  }

  public updateimageUrl(): void {
    this.clickButton('profile-image-input');
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.SUCCESS, `You've been successfully logged out`);
  }

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, error.error.message);
          this.refreshing = false;
        },
        () => emailForm.reset()
      )
    );
  }








  public onDeleteUder(username: string): void {
    this.subscriptions.push(
      this.userService.deleteUser(username).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    this.clickButton('openUserEdit');
  }

  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    if (this.userService && this.userService.getUsersFromLocalCache() !== null) {
      for (const user of this.userService.getUsersFromLocalCache()!) {
        if (
          user.prenom.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.nom.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        ) {
          results.push(user);
        }
      }
      this.users = results;
      if (results.length === 0 || !searchTerm) {
        this.users = this.userService.getUsersFromLocalCache()!;
      }
    }
  }
  

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }

  private getUserRole(): string {
    if (this.authenticationService) {
      return this.authenticationService.getUserFromLocalCache()?.role || '';
    }
    return '';
      }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  private clickButton(buttonId: string): void {
    const buttonElement = document.getElementById(buttonId);
    if (buttonElement !== null) {
      buttonElement.click();
    }
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
