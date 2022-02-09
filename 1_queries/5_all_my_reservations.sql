SELECT properties.*, reservations.*, AVG(rating) as average_rating
FROM reservations
  JOIN properties ON properties.id = property_id
  JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1 
AND now()::date > reservations.end_date
GROUP BY properties.id, reservations.id
ORDER BY start_date
LIMIT 10;