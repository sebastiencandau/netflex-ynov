# 🎬 Netflex

Netflex est une application catalogue de films où vous pouvez liker vos films préférés ! Les films les plus likés apparaissent en première page pour que vous puissiez les découvrir rapidement.

## 🚀 Lancement rapide

Pour lancer l'application localement, suivez ces étapes simples :

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/sebastiencandau/netflex-ynov.git
   ```

2. Installez les dépendances :
   ```bash
   cd netflex-ynov
   npm install -f
   ```

3. Remplissez le fichier `.env.local` en vous inspirant du fichier `.env.local.example`.

4. Lancez l'application :
   ```bash
   npm run dev
   ```

5. Accédez à l'application dans votre navigateur à l'adresse `http://localhost:3000`.

## 🛠️ Technologies utilisées

- [Next.js](https://nextjs.org) - Framework React
- [Material-UI](https://mui.com) - Kit d'interface utilisateur React
- [Node.js](https://nodejs.org) - Environnement d'exécution JavaScript côté serveur
- [MongoDB](https://www.mongodb.com) - Base de données NoSQL
- [Swagger](https://swagger.io) - Outil de documentation et de conception d'API

## ℹ️ Utilisation de The Movie Database (TMDb)

Netflex utilise l'API de The Movie Database (TMDb) pour obtenir des informations sur les films, y compris les titres, les descriptions, les affiches, etc. Pour utiliser cette fonctionnalité, vous devez obtenir une clé API auprès de TMDb et la configurer dans le fichier `.env.local` sous la clé `THEMOVIEDB_API_KEY` ainsi que le token associé `API_TOKEN`

## 📝 Fonctionnalités à venir

- Tests unitaires et tests d'intégration
- Documentation Swagger complète de toutes les routes

## 🤝 Contributeur

- [Candau Sébastien](https://github.com/sebastiencandau) - Développeur

Projet réalisé dans le cadre du module "Développer pour le cloud" M1 - Ynov
