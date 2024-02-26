# Système de suivi des stocks
Un système pour gérer des informations sur les stocks, les fournisseurs et les commandes.

Déclinaison de scripts pour faire ressortir l'état des stocks d'un produit, si une commande est en attente car pas de stock, délais de livraison d'un fournisseur pour un produit, date de livraison d'une commande par rapport au dernier produit à livrer

## Installation
1. Cloner le dépôt
2. Installer les dépendances pnpm
```bash
npm install -g pnpm 
```
3. Installer les dépendances
```bash
pnpm install
```
4. Créer un fichier .env à la racine du projet
```bash
touch .env
```
5. Ajouter les variables d'environnement
```env
PORT=3000
DB_HOST=localhost
DB_NAME=TP1
```
6. Créer la base de données
```bash
pnpm run seed
```
