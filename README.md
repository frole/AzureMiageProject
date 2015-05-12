# Projet pluridisciplinaire - MIAGE Paris-Descartes - année 2014-2015

Ce projet est proposé et suivi par François Role, maître de conférences à l'université Paris-Descartes - francois.role@parisdescartes.fr
L'équipe projet est constituée de :
* Axelle Boyer
* Emilie Cresson
* Jean-Baptiste Dohet
* Marie Fagbemy

Le projet utilise des accès fournis à l'équipe Machine Learning de Paris-Descartes par Microsoft Research dans le cadre d'un "Azure Research Grant".

Cette page contient un descriptif du projet proposé ainsi que des éléments (indications de format, pseudo-code, etc.) fournis pour sa réalisation.

## Sujet proposé
Ce projet de fin d'étude proposé à des étudiants du Master Miage par apprentissage de Paris-Descartes a pour objectif de démontrer la faisabilité d'un accès aux services AzureML via une interface Web. Les principales fonctionnalités à implémenter sont décrites ci-après.
L'utilisateur devra pouvoir à partir d'un serveur Node.js désigner via l'interface (par exmpel des listes déroulantes) un dataset à traiter (dataset stocké dans un Blob Azure) et un service pour traiter ce dataset. La liste des données disponibles (blobs à traiter)  pourra être retrouvée en utilisant l'API Azure (version Jvavscript). Les URL des services et leur codes d'accès seront fournis aux étudiants au cours du projet. Le premier service mis à disposition des étudiants sera le service "Census Income" qui permet de déterminer le niveau de revenu d'une personne en fonction de différentes caractéristiques. Un accès à un service de co-clustering sera aussi fourni en focntion de l'avancement du projet.



## Classification


### Input/output

Le service prend en entrée un fichier CSV donnant des caratéristiques d'une personne. Il renvoie un fichier avec les mêmes infos mais complétées par l'indication de la classe d'appartenance.

### Structure de la requête POST

* URL = url + "?api-version=2.0"
* headers = { "Content-Type":"application/json", "Authorization":("Bearer " + api_key)}
* body = json correspondant à  {

        "Input": {
            "ConnectionString": connection_string,
            "RelativeLocation": input_blob_path
        },

        "Outputs": {

            "output1": { "ConnectionString": connection_string,
            "RelativeLocation": "/" + storage_container_name + "/output1results.csv" },
        },
        "GlobalParameters": {}
    }
	
On a : 
	
* connection_string = "DefaultEndpointsProtocol=https;AccountName=" + storage_account_name + ";AccountKey=" + storage_account_key
* input_blob_path = "/" + storage_container_name + "/" + input_blob_name

## Pseudo-code

    storage_account_name = "nom du storage account" 
    storage_account_key = "cle du storage account" 
    storage_container_name = "nom du container" 
	input_blob_name = "nom bu blob a classifier"
	api_key = "w...................==" # Replace this with the API key for the web service
    url = "https://ussouthcentral.services.azureml.net/workspaces/....../jobs"
	input_blob_path = "/" + storage_container_name + "/" + input_blob_name
    connection_string = "DefaultEndpointsProtocol=https;AccountName=" + storage_account_name + ";AccountKey=" + storage_account_key
	payload = le body defini plus haut
	// Soumettre le travail et recuperer un numero de job
	soumettre la requête définie plus haut
	lire la réponse et essayer de récupérer le job id (en enlevant les guillemets autour)
	// Demarrer le job
	Envoyer une requête GET ayant la structure :  url + "/" + job_id + "/start?api-version=2.0", "", headers)
	// Attendre la fin de l'execution du job et essayer recuperer la reponse
	url2 = url + "/" + job_id + "?api-version=2.0"
	headers = { "Authorization":("Bearer " + api_key) })
	Tant que Vrai :
	    envoyer une requête sur url2 avec pour header headers
		lire le resultat et examiner le champ "StatusCode" du resultat
		si le statut est "Finished" invoquer une fonction processResults(resultat) et sortir de la boucle 
		si le statut "Failed" ou "Cancelled" sortir de la boucle avec un message
		si le statut est "NotStarted" ou "Running" ne rien faire
		
