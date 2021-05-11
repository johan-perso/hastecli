#!/usr/bin/env node
'use strict';

// Dépendences
const meow = require('meow'); // https://www.npmjs.com/package/meow
const clipboardy = require('clipboardy'); // https://www.npmjs.com/package/clipboardy
const chalk = require('chalk'); // https://www.npmjs.com/package/chalk
const hastebin = require('hastebin.js'); // https://www.npmjs.com/package/hastebin.js
const haste = new hastebin({url: 'https://hasteb.herokuapp.com'}); // Hastebin.js
const fs = require("fs"); // https://nodejs.org/api/fs.html
const fetch = require('node-fetch'); // https://www.npmjs.com/package/node-fetch

// Utilisation de meow pour le CLI
const cli = meow(`
	Utilisation
	  $ haste-create

	Options
	  --text -t <texte>         Texte (Si non fournis, accède a votre presse papier)
	  --nocopy -nc              Ne pas copier le lien hastebin dans le presse papier
	  --silent -s               Ne donne que le lien, rien d'autre
	  --version -v              Indique la version actuellement utilisé
`, {
	flags: {
		text: {
			type: 'string',
			alias: 't'
		},
		nocopy: {
			type: 'boolean',
			alias: 'nc'
		},
		silent: {
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

// Obtenir le texte
if(cli.flags.text) var text = cli.flags.text
if(!cli.flags.text) var text = clipboardy.readSync()

// Vérifier si le texte est un fichier local
if (fs.existsSync(text)) {
	fs.readFile(text, 'utf8', function(err, data) {
		if(err) publishHaste(text)
		if(!err && cli.flags.text) publishHaste(data)
		if(!err && !cli.flags.text) publishHaste(data)
	  });
} else {
	if(cli.flags.text) publishHaste(text.replace(/\\n/g, "\n"))
	if(!cli.flags.text) publishHaste(text)
}

// Publier le haste
async function publishHaste(text){
	// Quelques petite vérification
	if(!text.replace(/ /g, "").replace(/\r?\n|\r/g, "")) return console.log(chalk.red("Le texte est vide, essayer ") + chalk.cyan("haste-create --text \"Un haste très intéressent !\"") + chalk.red("."))
	if(text.length > 250000) return console.log(chalk.red("Votre texte dépasse la limite des 250 000 caractère autorisé, essayer d'aller sur ") + chalk.cyan(haste.url) + chalk.red(" et de crée le haste depuis le site."))

	// Crée le hastebin
	haste.post(text, "yaml").then(link => {
		// Donner le lien
		if(!cli.flags.silent) console.log("Votre haste a bien été crée avec succès !")
		if(!cli.flags.silent) console.log("=========================================")
		console.log(link.replace(".yaml",""))

		// Copier dans le presse papier
		if(!cli.flags.nocopy) clipboardy.writeSync(link.replace(".yaml",""))
	});

}