-- Starter buyer categories. Replace emails with real contacts before publishing.
insert into public.buyers (company_name, contact_name, email, buyer_type, tags, status, notes) values
('Example Prop Hire Buyer', 'Buyer Contact', 'propbuyer@example.com', 'Prop hire / themed event stock', array['PROP-BIG','SCENIC','IMMERSIVE'], 'active', 'Replace with real buyer.'),
('Example AV Resale Buyer', 'Buyer Contact', 'avbuyer@example.com', 'Used AV / lighting / screens', array['AV-LIGHT'], 'active', 'Replace with real buyer.'),
('Example Festival Buyer', 'Buyer Contact', 'festivalbuyer@example.com', 'Festival / outdoor activation', array['PROP-BIG','FESTIVAL'], 'active', 'Replace with real buyer.'),
('Example Circular Fallback Buyer', 'Buyer Contact', 'circularbuyer@example.com', 'Reuse / circular scenery fallback', array['CIRCULAR','SCENIC'], 'active', 'Replace with real buyer.')
on conflict (email) do nothing;
