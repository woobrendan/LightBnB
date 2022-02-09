INSERT INTO users (name, email, password)
VALUES ('Barney Stinson', 'legendary@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ted Moseby', 'renEHsance@fair.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Marshal Erikson', 'judge@fudge.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'House of Healing', 'A house to heal, and do yoga', 'parco.gif', 'parco_funny_pics', 130, 2, 3, 4, 'Canada', 'Vancouver Street', 'Vancouver', 'British Columbia', 'V1A 2N3'),
(2, 'Fortress of Solitude', 'A place to deliver important news', 'large_jorel_head', 'baconator', 90, 0, 2, 2, 'Canada', 'Solitude Place', 'New York', 'Albert', 'A7B 8C9'),
(3, 'Rogers Centre', 'Home of the Blue Jays', 'Jays logo', 'Blue Jays banner', 250, 100, 20, 10, 'Canada', 'Blue Jays Way', 'Toronto', 'Ontario', 'M5V 1J1');

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2010-09-16', '2019-09-26'),
(2, 2, '2015-10-01', '2015-10-30'),
(3, 3, '2008-01-14', '2008-02-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 4, 5, 'I was healed!'),
(1, 2, 5, 2, 'No superman around'),
(3, 3, 6, 3, 'A concrete jungle');