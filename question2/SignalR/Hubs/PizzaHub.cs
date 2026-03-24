using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    public class PizzaHub : Hub
    {
        private readonly PizzaManager _pizzaManager;

        public PizzaHub(PizzaManager pizzaManager) {
            _pizzaManager = pizzaManager;
        }

        public override async Task OnConnectedAsync()
        {
            _pizzaManager.AddUser();
            //Mise à jour du nb d'users
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _pizzaManager.RemoveUser();
            //Mise à jour du nb d'users
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
            await base.OnConnectedAsync();
        }

        public async Task SelectChoice(PizzaChoice choice)
        {
            //On récupère le nom du groupe associé à cette pizza 
            string groupName = _pizzaManager.GetGroupName(choice);
            //On ajoute l’utilisateur au groupe
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            //On récupère le prix de la pizza choisie
            int pizzaPrice = _pizzaManager.PIZZA_PRICES[(int)choice];
            //On envoie le prix seulement au client
            await Clients.Caller.SendAsync("UpdatePizzaPrice", pizzaPrice);

            //On récupère : le nombre de pizzas achetées l’argent total du groupe
            int nbPizzas = _pizzaManager.NbPizzas[(int)choice];
            int money = _pizzaManager.Money[(int)choice];

            //On envoie ces données à tout le groupe
            await Clients.Group(groupName).SendAsync("UpdateNbPizzasAndMoney", nbPizzas, money);

        }

        public async Task UnselectChoice(PizzaChoice choice)
        {
            string groupName = _pizzaManager.GetGroupName(choice);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task AddMoney(PizzaChoice choice)
        {
            //On ajoute de l’argent à la pizza
            _pizzaManager.IncreaseMoney(choice);

            //On récupère le nom du groupe associé à la pizza
            string groupName = _pizzaManager.GetGroupName(choice);

            //On récupère le montant total d’argent pour cette pizza
            int money = _pizzaManager.Money[(int)choice];

            //On envoie la nouvelle valeur d’argent à tous les utilisateurs du groupe
            await Clients.Group(groupName).SendAsync("UpdateMoney", money);

        }

        public async Task BuyPizza(PizzaChoice choice)
        {
            //On effectue l’achat
            _pizzaManager.BuyPizza(choice);

            //On récupère le nom du groupe associé à la pizza
            string groupName = _pizzaManager.GetGroupName(choice);

            //On récupère nombre de pizzas achetées
            int nbPizzas = _pizzaManager.NbPizzas[(int)choice];

            //On récupère l’argent restant
            int money = _pizzaManager.Money[(int)choice];

            //On envoie les nouvelles valeurs à tout le groupe
            await Clients.Group(groupName).SendAsync("UpdateNbPizzasAndMoney", nbPizzas, money);
        }
    }
}
