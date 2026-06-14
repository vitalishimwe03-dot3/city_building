INSERT OR IGNORE INTO categories (name, description, slug) VALUES
('Architecture','Architectural design and documentation software training','architecture'),
('Structural Engineering','Structural analysis and design software training','structural-engineering'),
('Geotechnical Engineering','Soil analysis and geotechnical software training','geotechnical-engineering'),
('Visualization & Rendering','3D visualization and rendering software training','visualization-rendering'),
('Civil Engineering','Road design and GIS mapping software training','civil-engineering'),
('Water Engineering','Water distribution and hydraulic modeling software training','water-engineering'),
('Training Services','Professional training and internship programs','training-services'),
('Career Development','Career pathways for building professionals','career-development');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description,sub_category) VALUES
((SELECT id FROM categories WHERE slug='architecture'),'Revit','revit','revit-logo.svg','Building Information Modeling (BIM) and architectural design','Architectural Design'),
((SELECT id FROM categories WHERE slug='architecture'),'ArchiCAD','archicad','archicad-logo.svg','Building design and documentation','Architectural Design'),
((SELECT id FROM categories WHERE slug='architecture'),'SketchUp','sketchup','sketchup-logo.svg','3D modeling and conceptual design','Architectural Design'),
((SELECT id FROM categories WHERE slug='architecture'),'AutoCAD','autocad','autocad-logo.svg','Technical drafting and drawing','Architectural Design');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description,sub_category) VALUES
((SELECT id FROM categories WHERE slug='structural-engineering'),'ProtaStructure','prostructure','prostructure-logo.png','Structural design and analysis','Structural Analysis'),
((SELECT id FROM categories WHERE slug='structural-engineering'),'CSI ETABS','etabs','csi-logo.svg','Analysis and design of buildings','Structural Analysis'),
((SELECT id FROM categories WHERE slug='structural-engineering'),'Prokon','prokon','prokon-logo.png','Structural calculations and design','Structural Analysis'),
((SELECT id FROM categories WHERE slug='structural-engineering'),'Robot Structural Analysis','robot-structure','robot-structure-logo.svg','Structural modeling and analysis','Structural Analysis'),
((SELECT id FROM categories WHERE slug='structural-engineering'),'CSI Safe','csisafe','csi-logo.svg','Foundation and slab design','Foundation Design'),
((SELECT id FROM categories WHERE slug='structural-engineering'),'CSI Detailer','csidetailer','csi-logo.svg','Reinforcement detailing','Detailing'),
((SELECT id FROM categories WHERE slug='structural-engineering'),'CSI Bridge','csibridge','csi-logo.svg','Bridge analysis and design','Bridge Design');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description,sub_category) VALUES
((SELECT id FROM categories WHERE slug='geotechnical-engineering'),'Plaxis 2D','plaxis-2d','plaxis-logo.png','Soil and foundation analysis','Soil Analysis'),

  ((SELECT id FROM categories WHERE slug='geotechnical-engineering'),'Plaxis 3D','plaxis-3d','plaxis-logo.png','Soil and foundation analysis','Soil Analysis');
INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description,sub_category) VALUES
((SELECT id FROM categories WHERE slug='visualization-rendering'),'Lumion','lumion','lumion-logo.svg','Realistic rendering and animations','Architectural Visualization'),
((SELECT id FROM categories WHERE slug='visualization-rendering'),'Twinmotion','twinmotion','twinmotion-logo.svg','Real-time visualization','Architectural Visualization'),
((SELECT id FROM categories WHERE slug='visualization-rendering'),'Enscape','enscape','enscape-logo.svg','Interactive rendering','Architectural Visualization'),
((SELECT id FROM categories WHERE slug='visualization-rendering'),'V-Ray','vray','vray-logo.svg','High-quality rendering','Architectural Visualization');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description,sub_category) VALUES
((SELECT id FROM categories WHERE slug='civil-engineering'),'Civil 3D','civil3d','civil3d-logo.svg','Road and infrastructure design','Road Design'),
((SELECT id FROM categories WHERE slug='civil-engineering'),'ArcGIS','arcgis','arcgis-logo.svg','Geographic Information Systems (GIS)','GIS Mapping');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description,sub_category) VALUES
((SELECT id FROM categories WHERE slug='water-engineering'),'WaterCAD','watercad','watercad-logo.svg','Water network design','Water Distribution'),
((SELECT id FROM categories WHERE slug='water-engineering'),'WaterGEMS','watergem','watergem-logo.svg','Water system modeling and management','Water Distribution');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description,sub_category) VALUES
((SELECT id FROM categories WHERE slug='training-services'),'Short Courses','short-courses','training-icon.svg','Engineering software training','Professional Training'),
((SELECT id FROM categories WHERE slug='training-services'),'Academic Internship','academic-internship','internship-icon.svg','Practical engineering experience','Internship Program');

INSERT OR IGNORE INTO subcourses (category_id,name,slug,image,description,sub_category) VALUES
((SELECT id FROM categories WHERE slug='career-development'),'Architects','architects','architect-icon.svg','Architecture profession','Career Pathways'),
((SELECT id FROM categories WHERE slug='career-development'),'Engineers','engineers','engineer-icon.svg','Engineering profession','Career Pathways'),
((SELECT id FROM categories WHERE slug='career-development'),'Designers','designers','designer-icon.svg','Design profession','Career Pathways'),
((SELECT id FROM categories WHERE slug='career-development'),'Surveyors','surveyors','surveyor-icon.svg','Surveying profession','Career Pathways');

-- Hero slideshow seed data
INSERT OR IGNORE INTO hero_slides (title, description, image_path, link_url, btn_text, animation, display_order, is_active, auto_play, transition_speed) VALUES
('Welcome to City Building Engineering', 'Professional software training for architecture, engineering, and design careers in Kigali, Rwanda.', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1400&q=80', '/about', 'Learn More', 'fade', 1, 1, 1, 6000),
('Master Industry Software', 'Hands-on training in Revit, AutoCAD, ETABS, Lumion, and more. Build your career with us.', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1400&q=80', '/services', 'Explore Courses', 'slide', 2, 1, 1, 6000),
('Join Our Community', 'Career-ready training with recognized certificates. Enroll today and shape your future.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=80', '/contact', 'Contact Us', 'zoom', 3, 1, 1, 6000);

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
