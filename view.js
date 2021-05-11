#!/usr/bin/env node
'use strict';

// Dépendences
const meow = require('meow'); // https://www.npmjs.com/package/meow
const clipboardy = require('clipboardy'); // https://www.npmjs.com/package/clipboardy
const chalk = require('chalk'); // https://www.npmjs.com/package/chalk
const fs = require('fs'); // https://nodejs.org/api/fs.html
const hastebin = require('hastebin.js'); // https://www.npmjs.com/package/hastebin.js
const haste = new hastebin({url: 'https://hasteb.herokuapp.com'}); // Hastebin.js
const fetch = require('node-fetch'); // https://www.npmjs.com/package/node-fetch

// Utilisation de meow pour le CLI
const cli = meow(`
	Utilisation
	  $ haste-view

	Options
	  --link -l <lien>          Lien (Si non fournis, accède a votre presse papier)
	  --copy -c                 Copie le texte du haste dans le presse papier
	  --save -s                 Enregistre le fichier sur votre appareil
	  --version -v              Indique la version actuellement utilisé
`, {
	flags: {
		link: {
			type: 'string',
			alias: 'l'
		},
		copy: {
			type: 'boolean',
			alias: 'c'
		},
		save: {
			type: 'boolean',
			alias: 's'
		},
    version: {
			type: 'boolean',
			alias: 'v'
		}
	},
	autoVersion: false
});

// Donner la version avec l'option associé
if(cli.flags.version){
	console.log("Votre HasteCLI utilise actuellement la version 2.0.0")
	console.log("\nV1 : " + chalk.cyan("https://github.com/johan-perso/haste.terminal"))
	console.log("V2+ : " + chalk.cyan("https://github.com/johan-perso/hastecli"))
	console.log("\nLien de hastebin : " + chalk.cyan(haste.url))
	return process.exit()
}

// Vérifier si le site d'Hastebin est disponible
fetch(haste.url, { method: 'GET', follow: 20, size: 500000000})
    .then(res => res.text())
    .catch(err => {
		if(err.message.startsWith("invalid json response body")) console.log(chalk.red("Hastebin n'a pas pu être trouvé.. : ") + chalk("Erreur d'API / de réseaux"))
		if(!err.message.startsWith("invalid json response body")) console.log(chalk.red("Hastebin n'a pas pu être trouvé.. : ") + chalk(err.message))
		process.exit()
	})

// Trouve l'argument (presse papier / option CLI)
if(cli.flags.link) var linkA = cli.flags.link
if(!cli.flags.link) var linkA = clipboardy.readSync()

// Enleve les espaces et saut de ligne de l'URL
var linkB = linkA.replace(/ /g, "").replace(/\r?\n|\r/g, "")

// Retire https:// si besoin
var linkC = linkB.replace("https://","").replace("http://","")

// Obtient la clé
var keyA = linkB.replace("https://","").replace("http://","").replace("hasteb.herokuapp.com/","").replace("raw/","")
var [key, language] = keyA.split('.')

// Voir le contenu du haste
haste.get(key).then(text => {
    // Limite de taille
    if(text.length > 80000) return console.log(chalk.red("Le texte dépasse la limite des 80 000 caractère autorisé, essayer d'aller sur ") + chalk.cyan("https://hasteb.herokuapp.com/raw/" + key) + chalk.red(" pour voir le contenu de ce haste."))

    // Afficher dans le terminal
    console.log("\n" + text)

    // Copier dans le presse papier
    if(cli.flags.copy) clipboardy.writeSync(text)

    // Sauvegarder
    if(cli.flags.save){
        // Voir le language
        if(language) var lang = language
        if(!language) var lang = "txt"

        // Nom du fichier
        var date = new Date();
        var fileName = "HasteCLI-File_" + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "." + lang

        // Crée le fichier
        fs.writeFile(__dirname + "\\" + fileName, text, function (err) {
            if (err) console.log(chalk.red("Erreur d'écriture du fichier : " + err));
            console.log(chalk.cyan(__dirname.replace(/\//g, '\\') + "\\" + fileName))
         });
    }
});