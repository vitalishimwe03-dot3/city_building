document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('ai-chat-toggle');
  const panel = document.getElementById('ai-chat-panel');
  const closeBtn = document.getElementById('ai-chat-close');
  const messages = document.getElementById('ai-chat-messages');
  const input = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-chat-send');

  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  const courses = [
    { name: 'Revit', category: 'Architecture', catSlug: 'architecture', desc: 'BIM and architectural design' },
    { name: 'ArchiCAD', category: 'Architecture', catSlug: 'architecture', desc: 'Building design and documentation' },
    { name: 'SketchUp', category: 'Architecture', catSlug: 'architecture', desc: '3D modeling and conceptual design' },
    { name: 'AutoCAD', category: 'Architecture', catSlug: 'architecture', desc: 'Technical drafting and drawing' },
    { name: 'ProtaStructure', category: 'Structural Engineering', catSlug: 'structural-engineering', desc: 'Structural design and analysis' },
    { name: 'CSI ETABS', category: 'Structural Engineering', catSlug: 'structural-engineering', desc: 'Analysis and design of buildings' },
    { name: 'Prokon', category: 'Structural Engineering', catSlug: 'structural-engineering', desc: 'Structural calculations and design' },
    { name: 'Robot Structural Analysis', category: 'Structural Engineering', catSlug: 'structural-engineering', desc: 'Structural modeling and analysis' },
    { name: 'CSI Safe', category: 'Structural Engineering', catSlug: 'structural-engineering', desc: 'Foundation and slab design' },
    { name: 'CSI Detailer', category: 'Structural Engineering', catSlug: 'structural-engineering', desc: 'Reinforcement detailing' },
    { name: 'CSI Bridge', category: 'Structural Engineering', catSlug: 'structural-engineering', desc: 'Bridge analysis and design' },
    { name: 'Plaxis 2D', category: 'Geotechnical Engineering', catSlug: 'geotechnical-engineering', desc: 'Soil and foundation analysis' },
    { name: 'Plaxis 3D', category: 'Geotechnical Engineering', catSlug: 'geotechnical-engineering', desc: 'Soil and foundation analysis' },
    { name: 'Lumion', category: 'Visualization & Rendering', catSlug: 'visualization-rendering', desc: 'Realistic rendering and animations' },
    { name: 'Twinmotion', category: 'Visualization & Rendering', catSlug: 'visualization-rendering', desc: 'Real-time visualization' },
    { name: 'Enscape', category: 'Visualization & Rendering', catSlug: 'visualization-rendering', desc: 'Interactive rendering' },
    { name: 'V-Ray', category: 'Visualization & Rendering', catSlug: 'visualization-rendering', desc: 'High-quality rendering' },
    { name: 'Civil 3D', category: 'Civil Engineering', catSlug: 'civil-engineering', desc: 'Road and infrastructure design' },
    { name: 'ArcGIS', category: 'Civil Engineering', catSlug: 'civil-engineering', desc: 'Geographic Information Systems (GIS)' },
    { name: 'WaterCAD', category: 'Water Engineering', catSlug: 'water-engineering', desc: 'Water network design' },
    { name: 'WaterGEMS', category: 'Water Engineering', catSlug: 'water-engineering', desc: 'Water system modeling and management' }
  ];

  var knowledge = {
    greetings: {
      keywords: ['hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'whatsup'],
      response: "Hello! I'm the City Building AI Assistant with comprehensive civil engineering knowledge. I can help with:\n\u2022 Course info & recommendations\n\u2022 Civil engineering concepts & theory\n\u2022 Software & tools guidance\n\u2022 Career advice & industry insights\n\u2022 Pricing, enrollment & schedules\n\nWhat would you like to explore?"
    },
    whoAreYou: {
      keywords: ['who are you', 'what are you', 'who is this', 'your name', 'about you', 'tell me about yourself'],
      response: "I'm the City Building Engineering AI Assistant \u2014 your guide to our training programs and civil engineering knowledge. I can answer questions about structural, geotechnical, transportation, water, environmental, and construction engineering, plus help you choose the right software course for your career."
    },
    company: {
      keywords: ['city building', 'about company', 'about your', 'tell me about city', 'who we are', 'what do you do'],
      response: "City Building Engineering Company Ltd is a Kigali-based engineering training and consulting firm. We offer professional software courses in AutoCAD, Revit, ETABS, Lumion, Civil 3D, and more. Our mission is to bridge the gap between academic knowledge and industry demands by providing hands-on, job-ready training for architects, engineers, and designers across Rwanda and East Africa."
    },

    // === STRUCTURAL ENGINEERING ===
    structuralGeneral: {
      keywords: ['structural engineering', 'structural design', 'structure analysis', 'what is structural'],
      response: "Structural engineering is a discipline of civil engineering that deals with the analysis and design of structures that support or resist loads. It ensures buildings, bridges, towers, and other structures are safe, stable, and serviceable. Key areas include:\n\u2022 Load analysis (dead, live, wind, seismic, snow)\n\u2022 Material behavior (steel, concrete, timber, masonry)\n\u2022 Structural analysis (determinate & indeterminate)\n\u2022 Design codes (Eurocode, ACI, AISC, BS, IS)\n\u2022 Foundation engineering\n\u2022 Earthquake engineering"
    },
    beams: {
      keywords: ['beam', 'beams', 'bending', 'shear', 'moment', 'deflection'],
      response: "Beams are horizontal structural members that carry loads primarily by bending. Key concepts:\n\u2022 Types: simply supported, cantilever, continuous, fixed-end\n\u2022 Analysis: shear force and bending moment diagrams\n\u2022 Design: section modulus, moment of inertia, reinforcement\n\u2022 Deflection limits: typically span/250 for live loads, span/300 total\n\u2022 Common materials: reinforced concrete, steel I-beams, timber\n\u2022 Codes: ACI 318 for concrete, AISC 360 for steel, Eurocode 2 & 3"
    },
    columns: {
      keywords: ['column', 'columns', 'axial load', 'slenderness', 'buckling', 'pile'],
      response: "Columns are vertical compression members that transfer loads from beams and slabs to foundations. Key aspects:\n\u2022 Classification: short vs slender (slenderness ratio > 12 for RC)\n\u2022 Failure modes: material failure (short) vs buckling (slender)\n\u2022 Types: tied columns, spiral columns, composite columns\n\u2022 Design: interaction diagrams for combined axial + bending\n\u2022 Reinforcement: minimum 1% of gross area, maximum 6%\n\u2022 Slenderness ratio = effective length / radius of gyration\n\u2022 For steel columns: AISC recommends KL/r \u2264 200"
    },
    slabs: {
      keywords: ['slab', 'slabs', 'floor slab', 'concrete slab', 'two-way', 'one-way'],
      response: "Slabs are flat horizontal structural elements that form floors and ceilings. Types:\n\u2022 One-way slab: supported on two opposite sides (long/span > 2)\n\u2022 Two-way slab: supported on all four sides (span ratio \u2264 2)\n\u2022 Flat slab: supported directly on columns without beams\n\u2022 Waffle slab: ribbed in both directions for longer spans\n\u2022 Design considerations: thickness (span/26 for two-way), reinforcement detailing, deflection control, punching shear at columns\n\u2022 Software: CSI Safe is specialized for slab design"
    },
    foundations: {
      keywords: ['foundation', 'footing', 'raft', 'pile foundation', 'mat foundation', 'shallow foundation', 'deep foundation'],
      response: "Foundations transfer building loads to the ground. Two main types:\n\u2022 Shallow foundations: spread footings, combined footings, strip footings, mat/raft foundations. Used when bearing capacity is adequate at shallow depth.\n\u2022 Deep foundations: piles (driven or bored), caissons, piers. Used when surface soil is weak.\n\u2022 Key factors: soil bearing capacity, settlement limits, groundwater, frost depth\n\u2022 Design: size based on allowable bearing pressure; reinforcement for moment and shear\n\u2022 Pile types: friction piles (in sand), end-bearing piles (on rock), combination"
    },
    steelStructures: {
      keywords: ['steel structure', 'steel building', 'steel frame', 'structural steel', 'aisc'],
      response: "Steel structures are widely used for industrial buildings, high-rises, and bridges. Advantages: high strength-to-weight ratio, ductility, speed of construction. Key topics:\n\u2022 Sections: I-beams (W, S, HP), channels, angles, hollow sections\n\u2022 Connections: bolted (bearing vs slip-critical) and welded (fillet, groove)\n\u2022 Design codes: AISC 360 (LRFD or ASD), Eurocode 3\n\u2022 Limit states: yielding, buckling, fracture, fatigue\n\u2022 Fire protection: intumescent coatings, spray-on fireproofing"
    },
    concreteTechnology: {
      keywords: ['concrete', 'reinforced concrete', 'rc', 'rcc', 'cement', 'mix design'],
      response: "Concrete is the most widely used construction material worldwide. Key concepts:\n\u2022 Constituents: cement, fine aggregate (sand), coarse aggregate (gravel), water, admixtures\n\u2022 Water-cement ratio: lower w/c = higher strength (typical 0.4 to 0.6)\n\u2022 Grades: C20/25, C25/30, C30/37, C40/50 (cylinder/cube strength in MPa)\n\u2022 Mix design: ACI 211 or DOE method to achieve target strength and workability\n\u2022 Curing: maintain moisture for minimum 7 days for proper hydration\n\u2022 Reinforcement: steel rebar (grades 300, 420, 500 MPa)\n\u2022 Testing: slump test for workability, cube/cylinder test for compressive strength"
    },
    seismic: {
      keywords: ['seismic', 'earthquake', 'quake', 'lateral load', 'ductility', 'base shear'],
      response: "Earthquake engineering ensures structures can withstand seismic events. Core principles:\n\u2022 Base shear: V = Cs \u00d7 W (seismic coefficient \u00d7 building weight)\n\u2022 Response spectrum: plots spectral acceleration vs period\n\u2022 Ductility: ability to undergo large deformations without collapse\n\u2022 Strong column/weak beam: columns must be stronger than beams\n\u2022 Soft story: sudden change in stiffness can cause collapse\n\u2022 Codes: ASCE 7-16, Eurocode 8, UBC-97\n\u2022 Retrofitting: base isolation, dampers, jacketing, FRP wrapping"
    },
    loads: {
      keywords: ['loads on structure', 'dead load', 'live load', 'wind load', 'load combination', 'load calculation'],
      response: "Structural loads are forces that a building must withstand:\n\u2022 Dead load (DL): self-weight of structure, fixed equipment\n\u2022 Live load (LL): movable objects, people, furniture (varies by occupancy)\n\u2022 Wind load: depends on basic wind speed, exposure, topography\n\u2022 Seismic load: earthquake forces based on zone, soil type\n\u2022 Snow load: based on ground snow load, roof slope, exposure\n\u2022 Load combinations: e.g., 1.2DL + 1.6LL (ASCE 7), 1.35DL + 1.5LL (Eurocode)\n\u2022 Typical live loads: residential 2 kN/m\u00b2, office 2.5 kN/m\u00b2, parking 2.5 kN/m\u00b2"
    },

    // === GEOTECHNICAL ENGINEERING ===
    geotechnicalGeneral: {
      keywords: ['geotechnical', 'soil mechanics', 'soil engineering', 'ground', 'subsurface'],
      response: "Geotechnical engineering studies soil and rock behavior to support civil engineering structures. Key areas:\n\u2022 Soil classification (USCS, AASHTO)\n\u2022 Bearing capacity and settlement\n\u2022 Slope stability and retaining walls\n\u2022 Ground improvement techniques\n\u2022 Site investigation and soil testing\n\u2022 Foundation design recommendations"
    },
    soilTypes: {
      keywords: ['soil type', 'soil classification', 'clay', 'sand', 'silt', 'gravel', 'uscs', 'aashto'],
      response: "Soils are classified based on particle size and plasticity:\n\u2022 Gravel: > 4.75 mm\n\u2022 Sand: 0.075 - 4.75 mm\n\u2022 Silt: 0.002 - 0.075 mm\n\u2022 Clay: < 0.002 mm\n\u2022 USCS (Unified Soil Classification System): uses grain size and Atterberg limits. Coarse-grained: GW, GP, GM, GC, SW, SP, SM, SC. Fine-grained: CL, ML, CH, MH, OL, OH, PT.\n\u2022 AASHTO: A-1 through A-7, with Group Index for rating\n\u2022 Engineering properties vary greatly: sands drain well but may settle; clays are compressible and shrink/swell"
    },
    bearingCapacity: {
      keywords: ['bearing capacity', 'allowable bearing', 'soil bearing', 'ultimate bearing'],
      response: "Bearing capacity is the ability of soil to support foundation loads without failure or excessive settlement.\n\u2022 Ultimate bearing capacity (q\u1d62): Terzaghi's equation: q\u1d62 = cNc + \u03b3DNq + 0.5\u03b3BN\u03b3\n\u2022 Allowable bearing capacity: qallow = qu / Factor of Safety (usually 2.5-3)\n\u2022 Plate load test: directly measures bearing capacity in field\n\u2022 SPT (Standard Penetration Test): N-values correlate with bearing capacity\n\u2022 Typical values: dense gravel 400-600 kPa, medium sand 150-250 kPa, soft clay 50-100 kPa"
    },
    retainingWalls: {
      keywords: ['retaining wall', 'retain wall', 'cantilever wall', 'gravity wall', 'backfill', 'lateral earth'],
      response: "Retaining walls hold back soil at different elevations. Types and concepts:\n\u2022 Gravity walls: rely on self-weight (stone, mass concrete)\n\u2022 Cantilever walls: T-shaped RC section, uses soil weight on heel\n\u2022 Counterfort walls: thin wall with counterforts for tall heights\n\u2022 Sheet pile walls: steel piles driven into ground\n\u2022 Lateral earth pressure: active (Ka), passive (Kp), at-rest (Ko)\n\u2022 Rankine vs Coulomb theory for pressure calculation\n\u2022 Stability checks: overturning, sliding, bearing, overall stability\n\u2022 Drainage critical: weep holes and granular backfill prevent hydrostatic pressure"
    },
    slopeStability: {
      keywords: ['slope stability', 'landslide', 'slope failure', 'factor of safety slope', 'stability analysis'],
      response: "Slope stability analysis determines the safety of natural or engineered slopes.\n\u2022 Factor of Safety = resisting forces / driving forces (target: 1.2-1.5)\n\u2022 Methods: Swedish circle, Bishop's simplified, Janbu, Morgenstern-Price\n\u2022 Failure modes: rotational (circular), translational (planar), compound, wedge\n\u2022 Causes of failure: increased water pressure, slope steepening, loading at crest, vegetation removal\n\u2022 Remedial measures: drainage, soil nailing, retaining walls, ground anchors, vegetation, shotcrete"
    },

    // === TRANSPORTATION ENGINEERING ===
    transportationGeneral: {
      keywords: ['transportation', 'highway', 'road design', 'traffic', 'pavement'],
      response: "Transportation engineering plans, designs, and manages transportation systems. Key areas:\n\u2022 Highway geometric design (horizontal & vertical alignment)\n\u2022 Pavement design (flexible & rigid)\n\u2022 Traffic engineering (flow, capacity, signals)\n\u2022 Railway engineering\n\u2022 Airport design\n\u2022 Urban transportation planning"
    },
    pavement: {
      keywords: ['pavement', 'asphalt', 'flexible pavement', 'rigid pavement', 'road construction'],
      response: "Pavements are structural layers supporting traffic loads. Two main types:\n\u2022 Flexible pavement: asphalt surface + base + subbase. Distributes load through layers. Design: AASHTO 1993, AI method.\n\u2022 Rigid pavement: Portland cement concrete slab with joints. Distributes load through slab action. Design: AASHTO, PCA method.\n\u2022 Key parameters: traffic (ESALs), subgrade CBR, material properties, climate\n\u2022 Layers: surface course (40-60mm), binder course (60-100mm), base (150-300mm), subbase (150-300mm)\n\u2022 Common failures: rutting (flexible), fatigue cracking (both), faulting (rigid)"
    },
    geometricDesign: {
      keywords: ['geometric design', 'alignment', 'horizontal curve', 'vertical curve', 'superelevation'],
      response: "Geometric design ensures safe and efficient road operation.\n\u2022 Horizontal alignment: tangents, circular curves, spiral transitions\n\u2022 Superelevation: banking on curves to counter centrifugal force (max 7-10%)\n\u2022 Vertical alignment: grades, crest and sag vertical curves\n\u2022 Sight distance: stopping sight distance (SSD), passing sight distance (PSD)\n\u2022 Design speed determines minimum radius: R = V\u00b2 / (127(e+f))\n\u2022 Cross-section: lane width (3.0-3.65m), shoulder, median, drainage\n\u2022 Standards: AASHTO Green Book, national road authority standards"
    },

    // === WATER RESOURCES ENGINEERING ===
    waterGeneral: {
      keywords: ['water resources', 'hydrology', 'hydraulics', 'water engineering', 'irrigation'],
      response: "Water resources engineering manages the sustainable use of water. Core areas:\n\u2022 Hydrology: rainfall, runoff, flood frequency analysis\n\u2022 Hydraulics: pipe flow, open channel flow, pumps & turbines\n\u2022 Water supply systems: treatment, distribution, storage\n\u2022 Drainage and stormwater management\n\u2022 Dams and reservoirs\n\u2022 Irrigation engineering\n\u2022 Flood control and river engineering"
    },
    hydrology: {
      keywords: ['rainfall', 'precipitation', 'runoff', 'catchment', 'flood', 'hydrograph'],
      response: "Hydrology studies water movement in the hydrologic cycle.\n\u2022 Rainfall intensity-duration-frequency (IDF) curves for design storms\n\u2022 Runoff calculation: Rational method Q = CiA for small catchments\n\u2022 SCS (NRCS) Curve Number method: CN based on land use and soil type\n\u2022 Unit hydrograph: models runoff response to rainfall\n\u2022 Flood frequency analysis: Gumbel, Log-Pearson Type III distributions\n\u2022 Return period: 10-yr (urban drainage) to 100-yr (major structures)\n\u2022 Evapotranspiration: Penman-Monteith equation"
    },
    waterSupply: {
      keywords: ['water supply', 'water treatment', 'distribution system', 'potable water', 'drinking water'],
      response: "Water supply engineering delivers safe drinking water.\n\u2022 Sources: surface water (rivers, reservoirs) and groundwater (aquifers, wells)\n\u2022 Treatment: coagulation, flocculation, sedimentation, filtration, disinfection\n\u2022 Distribution: pipe networks with storage reservoirs, elevated tanks\n\u2022 Design criteria: per capita demand (100-200 L/person/day), peak factors\n\u2022 Pipe materials: HDPE, PVC, ductile iron, steel, concrete\n\u2022 Software: WaterCAD, EPANET for network analysis\n\u2022 Quality standards: WHO guidelines, national drinking water standards"
    },
    drainage: {
      keywords: ['drainage', 'stormwater', 'sewer', 'culvert', 'storm drain'],
      response: "Drainage engineering removes excess water from urban and rural areas.\n\u2022 Stormwater management: detention/retention ponds, green infrastructure\n\u2022 Culvert design: inlet/outlet control, hydraulic capacity (Manning's equation)\n\u2022 Sewer systems: sanitary (wastewater) vs storm (rainwater) - separate or combined\n\u2022 Design: minimum velocity 0.6 m/s to prevent sedimentation, maximum to prevent scour\n\u2022 Manning's equation: V = (1/n) \u00d7 R^(2/3) \u00d7 S^(1/2)\n\u2022 Sustainable drainage (SuDS): permeable pavements, rain gardens, swales"
    },

    // === ENVIRONMENTAL ENGINEERING ===
    environmentalGeneral: {
      keywords: ['environmental', 'wastewater', 'solid waste', 'pollution', 'environment'],
      response: "Environmental engineering protects human health and the environment. Key areas:\n\u2022 Wastewater treatment (domestic and industrial)\n\u2022 Water quality management\n\u2022 Solid waste management\n\u2022 Air pollution control\n\u2022 Environmental impact assessment (EIA)\n\u2022 Remediation of contaminated sites"
    },
    wastewater: {
      keywords: ['wastewater', 'sewage', 'effluent', 'activated sludge', 'treatment plant'],
      response: "Wastewater treatment removes contaminants from domestic and industrial sewage.\n\u2022 Primary treatment: screening, grit removal, sedimentation\n\u2022 Secondary treatment: biological (activated sludge, trickling filter, oxidation ditch)\n\u2022 Tertiary treatment: nutrient removal (N & P), disinfection, filtration\n\u2022 Key parameters: BOD (biochemical oxygen demand), COD, TSS, pH, NH3-N\n\u2022 Activated sludge: microorganisms consume organic matter in aeration tank\n\u2022 Sludge treatment: anaerobic digestion, dewatering, drying beds\n\u2022 Design standards: effluent quality limits per national/international standards"
    },

    // === CONSTRUCTION ENGINEERING & MANAGEMENT ===
    constructionManagement: {
      keywords: ['construction management', 'project management', 'planning', 'scheduling', 'cpm', 'pert'],
      response: "Construction management ensures projects are completed on time, within budget, and to quality standards.\n\u2022 Project phases: initiation, planning, execution, monitoring, closure\n\u2022 Scheduling: CPM (Critical Path Method), PERT (Program Evaluation Review Technique)\n\u2022 Bar charts and Gantt charts\n\u2022 Resource leveling and allocation\n\u2022 Cost estimation: preliminary (per m\u00b2) vs detailed (BOQ)\n\u2022 Quality management: ISO 9001, inspection & testing plans\n\u2022 Safety: HSE plans, risk assessment, PPE, toolbox talks\n\u2022 Software: MS Project, Primavera P6"
    },
    estimation: {
      keywords: ['estimation', 'quantity takeoff', 'boq', 'rate analysis', 'cost estimate'],
      response: "Cost estimation determines the budget for construction projects.\n\u2022 Types: preliminary (order of magnitude \u00b130%), detailed (BOQ \u00b110%)\n\u2022 Quantity takeoff: measuring quantities from drawings (earthwork, concrete, steel, finishes)\n\u2022 Bill of Quantities (BOQ): item description, unit, quantity, rate, amount\n\u2022 Rate analysis: material cost + labor + plant + overhead + profit\n\u2022 Unit rates: per m\u00b3 for concrete, per kg for steel, per m\u00b2 for finishes\n\u2022 Contingency: typically 5-10% of project cost\n\u2022 Software: AutoCAD with quantity takeoff plugins, Candy, WinQS"
    },

    // === SURVEYING ===
    surveyingGeneral: {
      keywords: ['surveying', 'survey', 'leveling', 'theodolite', 'total station', 'gps'],
      response: "Surveying measures positions, distances, and angles on the earth's surface. Branches:\n\u2022 Plane surveying: small areas ignoring curvature\n\u2022 Geodetic surveying: large areas considering curvature\n\u2022 Leveling: determining elevation differences (dumpy level, auto level, digital level)\n\u2022 Traversing: measuring angles and distances to establish control points\n\u2022 Total station: electronic distance measurement + theodolite\n\u2022 GPS/GNSS: satellite-based positioning (centimeter accuracy with RTK)\n\u2022 GIS: Geographic Information Systems for spatial data management\n\u2022 Software: ArcGIS, QGIS, Civil 3D for survey data processing"
    },

    // === CONSTRUCTION MATERIALS ===
    constructionMaterials: {
      keywords: ['construction materials', 'building materials', 'steel', 'timber', 'brick', 'block', 'aggregate'],
      response: "Construction materials form the basis of all structures. Key materials:\n\u2022 Concrete: versatile, high compressive strength, low tensile (needs reinforcement)\n\u2022 Steel: high tensile strength, ductile, recyclable, used for frames, reinforcement\n\u2022 Timber: renewable, lightweight, good for residential and temporary structures\n\u2022 Masonry: bricks, blocks, stone - good in compression, durable\n\u2022 Asphalt: flexible pavement surface, waterproofing\n\u2022 Glass: facades, windows, structural glass\n\u2022 Composites: FRP (fiber-reinforced polymer) for retrofitting and lightweight structures\n\u2022 Testing: compressive strength, tensile strength, elasticity modulus, durability"
    },

    // === BUILDING CODES & STANDARDS ===
    buildingCodes: {
      keywords: ['building code', 'standard', 'regulation', 'compliance', 'eurocode', 'aci', 'bs', 'iso'],
      response: "Building codes ensure minimum standards for safety, health, and sustainability.\n\u2022 International: IBC (International Building Code), Eurocodes\n\u2022 Structural: ACI 318 (concrete), AISC 360 (steel), EC2, EC3\n\u2022 Geotechnical: EC7, ASTM standards\n\u2022 Seismic: ASCE 7, EC8, UBC-97\n\u2022 Fire safety: NFPA, BS 9999\n\u2022 Accessibility: ADA (US), BS 8300 (UK)\n\u2022 Energy: LEED, BREEAM, EDGE certification\n\u2022 Rwanda: Rwanda Building Code, REMA guidelines"
    },

    // === CAREER ADVICE ===
    careerCivil: {
      keywords: ['career in civil', 'civil engineer job', 'become civil engineer', 'civil engineering career'],
      response: "Civil engineering offers diverse career paths:\n\u2022 Structural engineer: design buildings, bridges, towers\n\u2022 Geotechnical engineer: foundations, soil, underground structures\n\u2022 Transportation engineer: roads, highways, traffic systems\n\u2022 Water resources engineer: water supply, dams, drainage\n\u2022 Environmental engineer: water quality, waste management, pollution control\n\u2022 Construction manager: oversee project delivery\n\u2022 Recommended skills: AutoCAD, Revit, ETABS, Civil 3D, project management\n\u2022 Licensure: Professional Engineer (PE), Chartered Engineer (CEng)"
    },

    // === SOFTWARE GUIDANCE ===
    bimGeneral: {
      keywords: ['bim', 'building information modeling', 'digital twin', 'information model'],
      response: "Building Information Modeling (BIM) is a digital representation of a facility's physical and functional characteristics. Benefits:\n\u2022 3D visualization and clash detection\n\u2022 Cost estimation (5D BIM) and scheduling (4D BIM)\n\u2022 Facility management (6D BIM)\n\u2022 Collaboration across disciplines (architecture, structure, MEP)\n\u2022 Software: Revit (most popular), ArchiCAD, Navisworks, Tekla\n\u2022 Standards: IFC (Industry Foundation Classes), BIM Levels 0-3\n\u2022 We offer comprehensive Revit and ArchiCAD training"
    },
    cadGeneral: {
      keywords: ['cad', 'computer aided design', 'drafting', '2d drafting', 'bim vs cad'],
      response: "CAD (Computer-Aided Design) is the use of computer software for creating precision drawings and technical illustrations.\n\u2022 AutoCAD: industry standard for 2D drafting and basic 3D\n\u2022 Advantages: precise, fast modifications, standardized, digital workflow\n\u2022 BIM vs CAD: CAD creates individual drawings; BIM creates a coordinated model that generates drawings automatically\n\u2022 We offer beginner to advanced AutoCAD training in our Architectural track"
    },

    // === SITE INVESTIGATION ===
    siteInvestigation: {
      keywords: ['site investigation', 'soil investigation', 'borehole', 'spt', 'soil test', 'geotechnical investigation'],
      response: "Site investigation determines ground conditions for foundation design. Process:\n\u2022 Desk study: review existing data, geology maps\n\u2022 Site reconnaissance: visual inspection, access planning\n\u2022 Boreholes: drilled to explore subsurface (typical depth: 1.5\u00d7 foundation width to rock)\n\u2022 SPT (Standard Penetration Test): N-values at 1.5m intervals\n\u2022 Soil sampling: disturbed (bulk) and undisturbed (tube samples)\n\u2022 Laboratory tests: index properties (water content, Atterberg limits) and strength tests\n\u2022 Geophysical methods: seismic refraction, electrical resistivity\n\u2022 Reporting: borehole logs, soil profiles, foundation recommendations"
    }
  };

  var followUps = [
    { match: 'beam', suggest: 'Would you like to know about beam reinforcement detailing or shear design?' },
    { match: 'column', suggest: 'Shall I explain column buckling or interaction diagrams?' },
    { match: 'foundation', suggest: 'Would you like to learn about shallow foundations, pile foundations, or raft foundations?' },
    { match: 'concrete', suggest: 'Ask me about concrete mix design, curing, or testing methods.' },
    { match: 'soil', suggest: 'I can tell you more about soil classification, bearing capacity, or compaction.' },
    { match: 'pavement', suggest: 'Would you like flexible or rigid pavement design details?' },
    { match: 'water', suggest: 'Learn about water treatment, distribution systems, or drainage design.' },
    { match: 'seismic', suggest: 'Ask about base shear calculation, ductility, or retrofitting techniques.' },
    { match: 'steel', suggest: 'I can explain steel connections, beam design, or column buckling.' }
  ];

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  }

  function getScore(msg, keywords) {
    var count = 0;
    for (var i = 0; i < keywords.length; i++) {
      if (msg.includes(keywords[i])) count++;
    }
    return count;
  }

  function findBestMatch(msg) {
    var best = null;
    var bestScore = 0;
    var keys = Object.keys(knowledge);
    for (var i = 0; i < keys.length; i++) {
      var item = knowledge[keys[i]];
      if (item.keywords) {
        var score = getScore(msg, item.keywords);
        if (score > bestScore) {
          bestScore = score;
          best = item;
        }
      }
    }
    return best;
  }

  function getResponse(userMsg) {
    var msg = normalize(userMsg);
    if (!msg) return 'Please type a message and I\'ll be happy to help.';

    // Course lookup via server
    var courseMatch = courses.find(function(c) {
      return msg.includes(c.name.toLowerCase()) || (c.name.toLowerCase().includes(msg) && msg.length > 2);
    });
    if (courseMatch) {
      return courseMatch.name + ' is part of our ' + courseMatch.category + ' track. ' + courseMatch.desc + ' is covered in depth. View details at /category/' + courseMatch.catSlug + ' or register via your student account. Would you like pricing or duration info?';
    }

    // Knowledge base match
    var match = findBestMatch(msg);
    if (match && match.response) return match.response;

    // Follow-up suggestions
    for (var f = 0; f < followUps.length; f++) {
      if (msg.includes(followUps[f].match)) {
        return followUps[f].suggest;
      }
    }

    // Fallback with helpful options
    return 'I have extensive civil engineering knowledge! Try asking about:\n\u2022 Structural: beams, columns, slabs, foundations, steel, concrete, seismic design\n\u2022 Geotechnical: soil types, bearing capacity, retaining walls, slope stability\n\u2022 Transportation: roads, pavements, geometric design, traffic\n\u2022 Water: hydrology, water supply, drainage, wastewater\n\u2022 Construction: project management, cost estimation, materials\n\u2022 Software: AutoCAD, Revit, ETABS, Civil 3D, Plaxis, Lumion\n\u2022 Our courses, pricing, enrollment, or career advice\n\u2022 Or WhatsApp us at +250 789 257 758 for personal assistance.';
  }

  function addMessage(text, isUser) {
    var div = document.createElement('div');
    div.className = 'ai-message ' + (isUser ? 'ai-user' : 'ai-bot');
    div.innerHTML = text.replace(/\n/g, '<br>');
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleSend() {
    var text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = '';
    setTimeout(function() {
      addMessage(getResponse(text), false);
    }, 400);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSend();
  });
});
