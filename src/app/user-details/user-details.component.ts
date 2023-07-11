import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { Document } from 'src/app/document/document';
import { DocumentService } from 'src/app/document/document.service';

import { User } from '../user/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit  {
  documents: Document[] = []; // Déclarer la variable pour stocker les documents de l'utilisateur

  constructor(private userService: UserService,private route: ActivatedRoute, private DocumentService: DocumentService) { }
  userId: number | undefined;
  selectedUser: User | undefined;
  selectedUserDocuments: Document[] | undefined;


user: User | undefined;

ngOnInit(): void {
  this.route.params.subscribe(params => {
    const userId = +params['userId'];
    if (!isNaN(userId)) {
      this.userId = userId;
      this.userService.getUser(this.userId).subscribe(
        (user: User) => {
          this.selectedUser = user;
          this.showUserDocuments(this.selectedUser);
        },
        (error: any) => {
          console.error('Error retrieving user:', error);
        }
      );
    } else {
      console.error('Invalid user ID:', params['userId']);
    }
  });
}


showUserDocuments(user: User): void {
  this.userService.getDocumentsCreatedByUser(user.userId).subscribe(
    (documents: Document[]) => {
      this.selectedUserDocuments = documents;
      this.openUserDocumentsModal(); // Call the method to open the user documents modal
    },
    (error: any) => {
      console.error('Error retrieving user documents:', error);
    }
  );
}
showModal: boolean = false; // Flag to control the visibility of the modal

openUserDocumentsModal(): void {
  this.showModal = true; // Set the flag to true to show the modal
}

closeUserDocumentsModal(): void {
  this.showModal = false; // Set the flag to false to hide the modal
}





viewDocument(documentId: number) {
  this.DocumentService.viewDocument(documentId).subscribe(
    (response: any) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDispositionHeader);
      const filename = matches && matches.length > 1 ? matches[1] : 'document.pdf';

      const blob = new Blob([response.body], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    (error: any) => {
      console.error('Error while viewing the document:', error);
    }
  );
}



public DownloadDocument(documentId: number) {
  this.DocumentService.viewDocument(documentId).subscribe(
    (response: any) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDispositionHeader);
      const filename = matches && matches.length > 1 ? matches[1] : 'document.pdf';

      const blob = new Blob([response.body], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    (error: any) => {
      console.error('Error while viewing the document:', error);
    }
  );
}







}
