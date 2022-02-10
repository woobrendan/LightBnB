const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then(res => res.rows[0])
    .catch(err => {
      console.log(err.message);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then(res => res.rows[0])
    .catch(err => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;`;
  const values = [user.name, user.email, user.password];
  return pool
    .query(queryString, values)
    .then(res => res.rows)
    .catch(err => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT thumbnail_photo_url, title, number_of_bedrooms, number_of_bathrooms, parking_spaces, end_date, start_date, cost_per_night, AVG(rating)::NUMERIC AS average_rating
  FROM reservations 
    JOIN properties ON property_id = properties.id
    JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id 
  ORDER BY start_date
  LIMIT $2`;
  const values = [guest_id, limit];
  return pool
    .query(queryString, values)
    .then(res => res.rows)
    .catch(err => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, AVG(rating) as average_rating 
  FROM properties 
  JOIN property_reviews ON properties.id = property_id
  `;

  //define potential variable options
  const maxPriceSearchVal = options.maximum_price_per_night * 100;
  const minPriceSearchVal = options.minimum_price_per_night * 100;
  const ownerIdVar = options.owner_id;
  const minRating = options.minimum_rating;

  //if city name was passed into search params
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }
  //owner id is passed
  if (ownerIdVar && queryParams.length === 0) {
    queryParams.push(`%${ownerIdVar}%`);
    queryString += `WHERE owner_id = $${queryParams.length}`;
  } else if (ownerIdVar) {
    queryParams.push(`%${ownerIdVar}%`);
    queryString += ` AND owner_id = $${queryParams.length}`;
  }
  //max price options
  if (maxPriceSearchVal && queryParams.length === 0) {
    queryParams.push(`${maxPriceSearchVal}`);
    queryString += `WHERE cost_per_night < $${queryParams.length}`;
  } else if (maxPriceSearchVal) {
    queryParams.push(`${maxPriceSearchVal}`);
    queryString += ` AND cost_per_night < $${queryParams.length}`;
  }
  // min price option
  if (minPriceSearchVal && queryParams.length === 0) {
    queryParams.push(`${minPriceSearchVal}`);
    queryString += `WHERE cost_per_night > $${queryParams.length}`;
  } else if (minPriceSearchVal) {
    queryParams.push(`${minPriceSearchVal}`);
    queryString += ` AND cost_per_night > $${queryParams.length}`;
  }
  // min rating option
  if (minRating) {
    queryParams.push(`${minRating}`);
    queryString += `GROUP BY properties.id
    HAVING AVG(rating) >= $${queryParams.length}`;
  }

  // append limit to search
  queryParams.push(limit);
  if (!minRating) {
    queryString += `
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
      `;
  } else {
    queryString += `
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
      `;
  }
  //check if things are right
  console.log(queryString, queryParams);


  return pool
    .query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.log(err.message);
    });
};


exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];
  const queryString = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`;
  return pool
    .query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.log(err.message);
    });
};
exports.addProperty = addProperty;
