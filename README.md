# API et WebServer du projet thématique (Point de Contrôle Vidéo)

## Installation

Il faut d'abord récupérer le projet
```
git clone https://github.com/Adrien-Courtois/api-projet-thematique.git
```

Ensuite, installer les dépendances node JS de l'API
```
npm install
```

La prochaine étape consiste à lier cette application avec l'IA, pour cela il faut modifier le fichier ```.env```
```
# Port du côté backend
SERVER_PORT=

# Port du côté front
WEB_PORT=

# Url de la base de données (au format "mysql://USER:PASSWORD@IP:PORT/NOM-BDD")
DATABASE_URL=
```
Enfin la dernière étape de la configuration est de générer la base de données
```
npx init
```

Maintenant, vous pouvez lancer le backend et le frontend en même temps grâce à cette commande
```
npm run dev
```