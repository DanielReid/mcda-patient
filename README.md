# Stakeholder preferences elicitation

Internal project to elicit benefit-risk trade-offs from stakeholders in a questionnaire.

# To develop

The steps below should get you started, provided you have installed nodejs and bower.

````
git clone <this repo>
git submodule update --init --recursive
cd resources/
bower install
compass compile # optional
cd ..

export SURVEY_DB_NAME=<dbname>
export SURVEY_DB_USER=<dbuser>
export SURVEY_DB_PASSWORD=<dbpass>
export SURVEY_DB_HOST=<dbhost>
node index
````

The admin password is 'test' by default.
