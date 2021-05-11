# HasteCLI

HasteCLI est un client Hastebin permettant de crée et de voir des haste via des ligne de commande.

## Prérequis

* Un appareil sous Windows, MacOS, Linux ou ChromeOS (Avec Crostini)
* [nodejs et npm](https://nodejs.org) d'installé


## Installation

Assure-toi d'avoir [Node.js et npm](https://nodejs.org) d'installer sur ton appareil puis suis ces étapes dans l'ordre (tu auras peut-être besoin de redémarrer ton terminal / ton appareil après l'installation pour l'utiliser) :

* Télécharger tous les fichiers nécessaires (create.js, feedback.js, view.json, package.json, etc)
* Ouvrir un terminal et aller dans le dossier où se trouve les fichiers téléchargé lors de la dernière étape.
* Faire quelques commandes...
```
$ npm i
.......
$ npm link
```


## Utilisation

**Crée un haste :**
```
$ haste-create --help

  Crée et voir des haste directement depuis votre terminal.

  Utilisation
    $ haste-create

  Options
    --text -t <texte>         Texte (Si non fournis, accède a votre presse papier)
    --nocopy -nc              Ne pas copier le lien hastebin dans le presse papier
    --silent -s               Ne donne que le lien, rien d'autre
    --version -v              Indique la version actuellement utilisé
```

**Voir un haste :**
```
$ haste-view --help

  Crée et voir des haste directement depuis votre terminal.

  Utilisation
    $ haste-view

  Options
    --link -l <lien>          Lien (Si non fournis, accède a votre presse papier)
    --copy -c                 Copie le texte du haste dans le presse papier
    --save -s                 Enregistre le fichier sur votre appareil
    --version -v              Indique la version actuellement utilisé
```

**Reporter un problème directement via termiinal :**
```
$ haste-feedback

  Titre de votre demande (1/3) : ...
  Description de votre demande (2/3) : ...
  Comment vous contacter (3/3) : ...
```


## [v1](https://github.com/johan-perso/haste.terminal) --> v2

* Réécriture complète du code (comme [Rickdetect](https://github.com/johan-perso/rickdetect))
* Création d'un CLI avec plusieurs commandes (haste-create, haste-view, haste-feedback)
* Possibilité de voir des haste en plus d'en crée
* Enlève les espace et saut de ligne quand on regarde un haste à partir d'une URL
* Rajout d'un fichier feedback pour signaler un problème ou donner son avis directement via commande
* Copie le lien automatiquement quand on crée un haste
* Ajout d'option (create: --text, --nocopy, --silent, --version --help | view: --link, --copy, --save, --version, --help)
* Pouvoir crée des haste à partir de fichier local (au lieu de mettre un texte, indiquer simplement l'adresse du fichier)
* Vérification de taille pour éviter un trop gros texte dans le terminal
* Regarde à l'avance (avant de crée le haste) si Hastebin est accessible
* Beaucoup d'autre chose...

## Utilisé pour la création

* [Meow](https://www.npmjs.com/package/meow) (CLI)
* [Node fetch](https://www.npmjs.com/package/node-fetch) (Vérifier si Hastebin est accessible, Utiliser l'API de Feedback)
* [Clipboardy](https://www.npmjs.com/package/clipboardy) (Gérer le presse-papier)
* [Chalk](https://www.npmjs.com/package/chalk) (Mettre des couleurs dans le terminal)
* [Terminal kit](https://www.npmjs.com/package/terminal-kit) (Demande de texte et couleur dans feedback.js)
* [Hastebin.js](https://www.npmjs.com/package/hastebin.js) (Crée et voir des haste)

* [Hastebin edit](https://hasteb.herokuapp.com)
* API de Feedback privé (la mienne, aucun lien)
* Du temps...


## Licence

ISC © [Johan](https://johan-perso.glitch.me)