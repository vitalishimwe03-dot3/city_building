INSERT OR IGNORE INTO categories (name, description, slug) VALUES
('Architectural Software','Architectural software courses','architectural'),
('Structural Software','Structural analysis & design software','structural'),
('Geotechnical Software','Geotechnical analysis tools','geotechnical'),
('Rendering Software','Visualization and rendering tools','rendering'),
('Water & Road Design Software','Water and road design tools','water-road');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description) VALUES
((SELECT id FROM categories WHERE slug='architectural'),'Revit','revit','https://1000logos.net/wp-content/uploads/2020/08/Revit-Logo.png','Autodesk Revit course'),
((SELECT id FROM categories WHERE slug='architectural'),'ArchiCAD','archicad','https://static.food4rhino.com/cdn/farfuture/xyrPqO3quW2MDpWtN1q77PWdS56JQF_RFkkPgqfqj0o/mtime:1680615355/sites/default/files/public/users-files/graphisoft/app/archicadlogo.jpg','ArchiCAD BIM modelling course'),
((SELECT id FROM categories WHERE slug='architectural'),'SketchUp','sketchup','https://download-warehouse.sketchup.com/warehouse/v1.0/content/public/2871299f-70f9-42c5-9e94-92c9d58eb15f','SketchUp fundamentals'),
((SELECT id FROM categories WHERE slug='architectural'),'AutoCAD','autocad','https://saasyto.com/wp-content/uploads/2024/08/Autodesk-AutoCAD-subscription-1.jpg','AutoCAD drafting course');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description) VALUES
((SELECT id FROM categories WHERE slug='structural'),'Prostructure','prostructure','https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg?auto=compress&cs=tinysrgb&w=1200','Prostructure structural modelling'),
((SELECT id FROM categories WHERE slug='structural'),'CSI Etabs','etabs','https://images.pexels.com/photos/11157438/pexels-photo-11157438.jpeg?auto=compress&cs=tinysrgb&w=1200','Etabs analysis'),
((SELECT id FROM categories WHERE slug='structural'),'Prokon','prokon','https://images.pexels.com/photos/3862377/pexels-photo-3862377.jpeg?auto=compress&cs=tinysrgb&w=1200','Prokon structural tools'),
((SELECT id FROM categories WHERE slug='structural'),'Robot Structure','robot-structure','https://images.pexels.com/photos/7564864/pexels-photo-7564864.jpeg?auto=compress&cs=tinysrgb&w=1200','Autodesk Robot Structural Analysis'),
((SELECT id FROM categories WHERE slug='structural'),'CSI Safe','csisafe','https://images.pexels.com/photos/7859760/pexels-photo-7859760.jpeg?auto=compress&cs=tinysrgb&w=1200','CSI Safe design'),
((SELECT id FROM categories WHERE slug='structural'),'CSI Detailer','csidetailer','https://images.pexels.com/photos/1113839/pexels-photo-1113839.jpeg?auto=compress&cs=tinysrgb&w=1200','CSI Detailer workflows'),
((SELECT id FROM categories WHERE slug='structural'),'CSI Bridge','csibridge','https://images.pexels.com/photos/28370582/pexels-photo-28370582.jpeg?auto=compress&cs=tinysrgb&w=1200','CSI Bridge for bridges');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description) VALUES
((SELECT id FROM categories WHERE slug='geotechnical'),'Plaxis 2D','plaxis-2d','https://images.pexels.com/photos/18812422/pexels-photo-18812422.jpeg?auto=compress&cs=tinysrgb&w=1200','Plaxis 2D geotech modelling'),
((SELECT id FROM categories WHERE slug='geotechnical'),'Plaxis 3D','plaxis-3d','https://images.pexels.com/photos/14466335/pexels-photo-14466335.jpeg?auto=compress&cs=tinysrgb&w=1200','Plaxis 3D geotechnical analysis');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description) VALUES
((SELECT id FROM categories WHERE slug='rendering'),'Lumion','lumion','https://images.pexels.com/photos/13203180/pexels-photo-13203180.jpeg?auto=compress&cs=tinysrgb&w=1200','Lumion rendering workflows'),
((SELECT id FROM categories WHERE slug='rendering'),'Twin Motion','twinmotion','https://images.pexels.com/photos/16037755/pexels-photo-16037755.jpeg?auto=compress&cs=tinysrgb&w=1200','Twinmotion visualization'),
((SELECT id FROM categories WHERE slug='rendering'),'Enscape','enscape','https://images.pexels.com/photos/10813067/pexels-photo-10813067.jpeg?auto=compress&cs=tinysrgb&w=1200','Enscape realtime rendering'),
((SELECT id FROM categories WHERE slug='rendering'),'V-Ray','vray','https://images.pexels.com/photos/5265286/pexels-photo-5265286.jpeg?auto=compress&cs=tinysrgb&w=1200','V-Ray photoreal rendering');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description) VALUES
((SELECT id FROM categories WHERE slug='water-road'),'ArcGIS','arcgis','https://images.pexels.com/photos/8472920/pexels-photo-8472920.jpeg?auto=compress&cs=tinysrgb&w=1200','ArcGIS for infrastructure'),
((SELECT id FROM categories WHERE slug='water-road'),'Civil 3D','civil3d','https://images.pexels.com/photos/34338597/pexels-photo-34338597.jpeg?auto=compress&cs=tinysrgb&w=1200','Civil 3D road design'),
((SELECT id FROM categories WHERE slug='water-road'),'WaterCAD','watercad','https://images.pexels.com/photos/31326225/pexels-photo-31326225.jpeg?auto=compress&cs=tinysrgb&w=1200','WaterCAD distribution modelling'),
((SELECT id FROM categories WHERE slug='water-road'),'WaterGEM','watergem','https://images.pexels.com/photos/31326225/pexels-photo-31326225.jpeg?auto=compress&cs=tinysrgb&w=1200','WaterGEM hydraulic modelling');

-- Course modules for progress tracking
INSERT OR IGNORE INTO course_modules (subcourse_id, title, description, order_index) VALUES
((SELECT id FROM subcourses WHERE slug='revit'), 'Interface & Basics', 'Learn the Revit interface, navigation, and basic tools', 1),
((SELECT id FROM subcourses WHERE slug='revit'), 'Walls & Floors', 'Create and modify walls, floors, and ceilings', 2),
((SELECT id FROM subcourses WHERE slug='revit'), 'Roofs & Structures', 'Design roofs, structural elements, and framing', 3),
((SELECT id FROM subcourses WHERE slug='revit'), 'Documentation & Sheets', 'Create sheets, views, and construction documents', 4),
((SELECT id FROM subcourses WHERE slug='etabs'), 'Model Setup & Grids', 'Set up structural grids, materials, and sections', 1),
((SELECT id FROM subcourses WHERE slug='etabs'), 'Loads & Combinations', 'Define loads, load patterns, and combinations', 2),
((SELECT id FROM subcourses WHERE slug='etabs'), 'Analysis & Results', 'Run analysis and interpret results', 3),
((SELECT id FROM subcourses WHERE slug='etabs'), 'Design & Detailing', 'Design concrete and steel elements', 4),
((SELECT id FROM subcourses WHERE slug='autocad'), 'Interface & Drawing Tools', 'Learn AutoCAD interface and basic drawing commands', 1),
((SELECT id FROM subcourses WHERE slug='autocad'), 'Editing & Precision', 'Modify objects and use precision tools', 2),
((SELECT id FROM subcourses WHERE slug='autocad'), 'Annotations & Layers', 'Add text, dimensions, and organize with layers', 3),
((SELECT id FROM subcourses WHERE slug='autocad'), 'Plotting & Output', 'Create layouts, plot, and export drawings', 4),
((SELECT id FROM subcourses WHERE slug='lumion'), 'Scene Setup & Import', 'Import models and set up scenes', 1),
((SELECT id FROM subcourses WHERE slug='lumion'), 'Materials & Lighting', 'Apply materials and configure lighting', 2),
((SELECT id FROM subcourses WHERE slug='lumion'), 'Animation & Effects', 'Create animations and add post-processing effects', 3),
((SELECT id FROM subcourses WHERE slug='lumion'), 'Rendering & Export', 'Render images and videos, export final output', 4);
