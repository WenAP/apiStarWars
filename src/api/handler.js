'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('validator');
const PeopleModel = require('../models/People');

mongoose.Promise = Promise;

const mongoString = process.env.BD.DB_HOST_TEST

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Ocurrió un error en los datos enviados',
});

const dbExecute = (db, fn) => db.then(fn).finally(() => db.close());

function dbConnectAndExecute(dbUrl, fn) {
  return dbExecute(mongoose.connect(dbUrl, { useMongoClient: true }), fn);
}

module.exports.people = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Parámetro ID incorrecto'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    PeopleModel
      .find({ _id: event.pathParameters.id })
      .then(people => callback(null, { statusCode: 200, body: JSON.stringify(people) }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};


module.exports.createPeople = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const people = new PeopleModel({
    name: data.name,
    firstname: data.firstname,
    birth: data.birth,
    city: data.city,
    ip: event.requestContext.identity.sourceIp,
  });

  if (people.validateSync()) {
    callback(null, createErrorResponse(400, 'Información de la persona incorrecta'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    people
      .save()
      .then(() => callback(null, {
        statusCode: 200,
        body: JSON.stringify({ id: people.id }),
      }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};

module.exports.deletePeople = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Parámetro ID incorrecto'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    PeopleModel
      .remove({ _id: event.pathParameters.id })
      .then(() => callback(null, { statusCode: 200, body: JSON.stringify('Persona eliminada correctamente') }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};

module.exports.updatePeople = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const id = event.pathParameters.id;

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Parámetro ID incorrecto'));
    return;
  }

  const people = new PeopleModel({
    _id: id,
    name: data.name,
    firstname: data.firstname,
    birth: data.birth,
    city: data.city,
    ip: event.requestContext.identity.sourceIp,
  });

  if (people.validateSync()) {
    callback(null, createErrorResponse(400, 'Parámetro ID incorrecto'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    PeopleModel.findByIdAndUpdate(id, people)
      .then(() => callback(null, { statusCode: 200, body: JSON.stringify('Persona actualizada correctamente') }))
      .catch(err => callback(err, createErrorResponse(err.statusCode, err.message)))
  ));
};
