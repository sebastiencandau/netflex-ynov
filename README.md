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

## 🧪 Tests

Pour le moment, seuls des tests concernant l'index sont disponibles.

## 🔄 Workflow et déploiement

Netflex suit un workflow avec CircleCI et est déployé sur Vercel à l'adresse https://netflex-ynov.vercel.app/.

Voici un aperçu des principales étapes :

- **Installation des dépendances** : Cette étape installe les dépendances du projet et exécute les tests unitaires pour s'assurer du bon fonctionnement de l'application.

- **Analyse du code** : Une analyse statique du code est effectuée pour garantir sa qualité et sa cohérence.

- **Nettoyage et empaquetage de l'application** : L'application est nettoyée et préparée pour le déploiement en générant des artefacts prêts à être déployés.

- **Déploiement et notification** : L'application est déployée sur l'environnement cible (développement ou production) et une notification est envoyée une fois le déploiement terminé.

- **Tests de vérification** : Des tests de vérification sont exécutés après le déploiement pour garantir que l'application fonctionne correctement dans l'environnement cible.

- **Tests fonctionnels** : Des tests fonctionnels sont exécutés pour vérifier le comportement de l'application selon des scénarios d'utilisation réels.

- **Tests de charge** : Des tests de charge sont exécutés pour évaluer les performances et la stabilité de l'application sous différentes charges de trafic.

- **Surveillance et suivi** : L'application est surveillée en production pour détecter les problèmes et optimiser les performances.

## 🤝 Contributeur

- [Candau Sébastien](https://github.com/sebastiencandau) - Développeur

Projet réalisé dans le cadre du module "Développer pour le cloud" M1 - Ynov
