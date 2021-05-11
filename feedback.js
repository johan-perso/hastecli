#!/usr/bin/env node
'use strict';

// Dépendences
const fetch = require('node-fetch'); // https://www.npmjs.com/package/node-fetch
var term = require('terminal-kit').terminal; // https://www.npmjs.com/package/terminal-kit

// Vérifier si l'API est fonctionnel..
fetch('https://johan-feedback-api.herokuapp.com/feedback', { method: 'GET', follow: 20, size: 500000000})
    .then(res => res.text())
    .catch(err => {
		if(err.message.startsWith("invalid json response body")) console.log(chalk.red("L'API n'a pas pu être trouvé.. : ") + chalk("Erreur d'API / de réseaux"))
		if(!err.message.startsWith("invalid json response body")) console.log(chalk.red("L'API n'a pas pu être trouvé.. : ") + chalk(err.message))
		process.exit()
	})

// Fonction - Demander le titre de la demande
async function askTitle(){
    term("Titre de votre demande (1/3) : ") && term.cyan()
    term.inputField(
        function(error, input){
            if(error) term.red("\nUne erreur inconnu s'est produite.. : ") && term(error) && process.exit()
            if(input.length < 2) term.red("\nCe que vous avez écrit est vide / trop court.. : ") && term("Indiquez le titre de cette demande de contact") && process.exit()
            if(!error) askDescription(input)
        }
    );
}

// Fonction - Demander la description de la demande
async function askDescription(title){
    term("\nDescription de votre demande (2/3) : ") && term.cyan()
    term.inputField(
        function(error, input){
            if(error) term.red("\nUne erreur inconnu s'est produite.. : ") && term(error) && process.exit()
            if(input.length < 5 || input.length > 850) term.red("\nCe que vous avez écrit est vide / trop court / trop long.. : ") && term("Indiquez la description de cette demande de contact. ") && term.gray("PS : Si le texte est trop long pour toi, tu peux donner un lien Hastebin au lieu de la description.") && process.exit()
            if(!error) askContactMethod(title, input)
        }
    );
}

// Fonction - Demander la méthode de contact
async function askContactMethod(title, description){
    term("\nComment vous contacter (3/3) : ") && term.cyan()
    term.inputField(
        function(error, input){
            if(error) term.red("\nUne erreur inconnu s'est produite.. : ") && term(error) && process.exit()
            if(input.length < 2) term.red("\nCe que vous avez écrit est vide / trop court.. : ") && term("Indiquez un moyen de contact comme votre Twitter, Discord ou adresse mail") && process.exit()
            if(!error) sendFeedback(title, description, input)
        }
    );
}

// Fonction - Envoyer une requête a l'API
async function sendFeedback(title, description, contactMethod){
    fetch('https://johan-feedback-api.herokuapp.com/feedback', {
        method: 'POST',
        follow: 20,
        size: 500000000,
        body: `
        {
            "title": "${title}",
            "description": "${description}\\n**Méthode de contact :** ${contactMethod}",
            "project": "HasteCLI"
        }`,
        headers: {"Content-Type": "application/json"},
        })      
        .then(res => res.json())
        .then(json => {
            if(json.error === true || json.error === undefined) term.red("\nUne erreur s'est produite.. : ") && term(json.message) && process.exit()
            if(json.error === false) term.blue("\n\nC'est reçu !") && process.exit()
        })
        .catch(err => term.red("\nUne erreur s'est produite.. : ") && term(err))
}

// Demander le titre (qui va demander la description, puis la méthode de contact, etc)
askTitle()

// Raccourcis clavier
term.grabInput(true);
term.on('key', function(name, matches, data){
  if (name === 'CTRL_Z' || name === 'CTRL_C' || name === 'CTRL_D'){
    process.exit()
  }
})