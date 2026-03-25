import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AppComponent {
  title = 'reactive.form';

  // FormGroup = représente tout le formulaire
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {

    // Création du formulaire avec FormBuilder
    this.formGroup = this.formBuilder.group(
      {
        // Champ nom → obligatoire
        nom: ['', [Validators.required]],

        // Numéro de rue → obligatoire + entre 1000 et 9999
        roadnumber: ['', [
          Validators.required,
          Validators.min(1000),
          Validators.max(9999)
        ]],

        // Rue → pas de validation (optionnel)
        rue: [''],

        // Code postal → validation personnalisée (format canadien)
        postalcode: ['', [this.postalCodeValidator()]],

        // Commentaire → minimum 10 mots si rempli
        commentaire: ['', [this.minWordsValidator(10)]]
      },
      {
        // Validation globale du formulaire
        // Vérifie que le commentaire ne contient pas le nom
        validators: [this.nomDansCommentaireValidator()]
      }
    );
  }

  // 🔹 VALIDATEUR CODE POSTAL
  // Vérifie si le code postal respecte le format A1A 1A1
  postalCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const valeur = control.value;

      // Si vide → valide (champ facultatif)
      if (!valeur || !valeur.trim()) {
        return null;
      }

      // Regex pour code postal canadien
      const estValide = /^[A-Z][0-9][A-Z][ ]?[0-9][A-Z][0-9]$/i.test(valeur);

      return estValide ? null : { postalcodeInvalide: true };
    };
  }

  // 🔹 VALIDATEUR NOMBRE DE MOTS
  // Vérifie qu'il y a au moins X mots dans le commentaire
  minWordsValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const valeur = control.value;

      // Si vide → valide (champ facultatif)
      if (!valeur || !valeur.trim()) {
        return null;
      }

      // Compte les mots avec split(" ")
      const nombreMots = valeur.trim().split(' ').length;

      // Si moins que le minimum → erreur
      return nombreMots >= min ? null : { minWords: true };
    };
  }

  // 🔹 VALIDATEUR GLOBAL
  // Vérifie que le commentaire ne contient pas le nom
  nomDansCommentaireValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const nom = control.get('nom');
      const commentaire = control.get('commentaire');

      // Si un des champs est vide → pas d'erreur
      if (!nom?.value || !commentaire?.value) {
        return null;
      }

      // Vérifie si le commentaire contient le nom
      const estValide = !commentaire.value
        .toLowerCase()
        .includes(nom.value.toLowerCase());

      return estValide ? null : { nomDansCommentaire: true };
    };
  }

  // 🔹 Fonction appelée lors de la soumission
  envoyer(): void {

    // Vérifie si le formulaire est valide
    if (this.formGroup.valid) {

      // Affiche les données dans la console
      console.log(this.formGroup.value);
    }
  }
}