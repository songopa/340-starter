INSERT INTO public.account(account_firstname, account_lastname, account_email, account_password)
VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

SELECT * FROM public.account;

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

DELETE FROM public.account
WHERE account_id = 1;

-- Update inventory description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Join classification with vehicle make and model
SELECT inv_make, inv_model, classification_name 
FROM public.classification cls
INNER JOIN public.inventory inv
    ON cls.classification_id = inv.classification_id
WHERE cls.classification_name = 'Sport';

--update image urls
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images/','images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, 'images/','images/vehicles/');
