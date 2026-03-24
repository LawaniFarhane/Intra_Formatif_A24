import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatButtonModule]
})
export class AppComponent {
  title = 'Pizza Hub';

  private hubConnection?: signalR.HubConnection;
  isConnected: boolean = false;

  selectedChoice: number = -1;
  nbUsers: number = 0;

  pizzaPrice: number = 0;
  money: number = 0;
  nbPizzas: number = 0;

  constructor(){
    this.connect();
  }

  async connect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5282/hubs/pizza')
      .build();

    //Met à jour le nombre d’utilisateurs connectés.
    this.hubConnection.on('UpdateNbUsers', (nbUsers: number) => {
      this.nbUsers = nbUsers;
    });

    //Met à jour l’argent du groupe.
    this.hubConnection.on('UpdateMoney', (money: number) => {
      this.money = money;
    });

    //Met à jour le nombre de pizzas et l’argent.
    this.hubConnection.on('UpdateNbPizzasAndMoney', (nbPizzas: number, money: number) => {
      this.nbPizzas = nbPizzas;
      this.money = money;
    });

    //Met à jour le prix de la pizza sélectionnée.
    this.hubConnection.on('UpdatePizzaPrice', (pizzaPrice: number) => {
      this.pizzaPrice = pizzaPrice;
    });
    
    // TODO: Mettre isConnected à true seulement une fois que la connection au Hub est faite
    await this.hubConnection.start(); //Connection
    this.isConnected = true; 
  }

  //choisit la nouvelle pizza et appelle la méthode du Hub
  async selectChoice(selectedChoice:number) {
    if (this.selectedChoice != -1) {
      await this.hubConnection?.invoke('UnselectChoice', this.selectedChoice);
    }

    this.selectedChoice = selectedChoice;
    await this.hubConnection?.invoke('SelectChoice', this.selectedChoice);
  }

  //enlève l’utilisateur de l’ancien groupe
  async unselectChoice() {
    if (this.selectedChoice != -1) {
      await this.hubConnection?.invoke('UnselectChoice', this.selectedChoice);
    }

    this.selectedChoice = -1;
    this.pizzaPrice = 0;
    this.money = 0;
    this.nbPizzas = 0;
  }

  //elle appelle AddMoney sur le Hub si il y a une pizza selectionné
  async addMoney() {
    if (this.selectedChoice != -1) {
      await this.hubConnection?.invoke('AddMoney', this.selectedChoice);
    }
  }

  //elle appelle BuyPizza sur le Hub
  async buyPizza() {
    if (this.selectedChoice != -1) {
      await this.hubConnection?.invoke('BuyPizza', this.selectedChoice);
    }
  }
}
