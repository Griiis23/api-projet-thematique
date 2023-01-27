# API et WebServer du projet thématique (Point de Contrôle Vidéo)

## Installation

Il faut d'abord récupérer le projet
```
git clone https://github.com/Adrien-Courtois/api-projet-thematique.git
```

Déplacer vous dans le dossier du projet
```
cd api-projet-thematique
```

Installer les dépendances node JS de l'API
```
npm install
```

Lier cette application avec l'IA, pour cela il faut modifier le fichier ```.env```

```
nano .env
```

Et modifier le fichier selon votre configuration
```
# Port du côté backend
SERVER_PORT=

# Port du côté front
WEB_PORT=

# Url de la base de données (au format "mysql://USER:PASSWORD@IP:PORT/NOM-BDD")
DATABASE_URL=
```

Générer la base de données avec Prisma
```
npx prisma migrate deploy
```

Maintenant, vous pouvez lancer le backend et le frontend en même temps grâce à cette commande
```
npm run dev
```