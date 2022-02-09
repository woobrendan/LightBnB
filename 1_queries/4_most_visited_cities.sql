SELECT properties.city as city, COUNT(reservations.id) as total_reservations
FROM properties
JOIN reservations ON properties.id = property_id 
GROUP BY city
ORDER BY total_reservations DESC;