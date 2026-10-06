/**
 * FixFinder Synthetic Case Database & Matching Engine
 * Contains 48 rich, realistic maintenance cases across Buildings A, B, C, D
 * and 6 equipment categories: HVAC, Plumbing, Electrical, Elevator, Refrigeration, Security.
 */

export const INITIAL_CASES = [
  // --- HVAC / AC CASES (1-10) ---
  {
    id: "CASE-101",
    building: "Building A",
    equipment: "HVAC",
    complaint: "AC unit in room 204 is leaking water from casing and making loud rattling noises.",
    cause: "Clogged condensate drain line and loose fan blade mounting",
    fix_steps: [
      "Clear condensate drain tube using pressurized nitrogen flush",
      "Inspect & tighten blower fan motor mounting bolts",
      "Replace air filter unit and verify condensate pump operation"
    ],
    cost: 180,
    time_hours: 1.5,
    urgency: "P2",
    urgency_reason: "Water leakage risks ceiling/drywall damage in occupied office space.",
    is_tech_confirmed: true,
    timestamp: "2026-09-15 10:30"
  },
  {
    id: "CASE-102",
    building: "Building A",
    equipment: "HVAC",
    complaint: "AC not cooling well in 3rd floor open office space, warm air blowing from vents.",
    cause: "Low refrigerant level due to valve pin leak and dirty evaporator coil",
    fix_steps: [
      "Perform nitrogen leak test on suction valve stem",
      "Evacuate system and recharge R-410A refrigerant to specs",
      "Clean evaporator coils with alkaline coil cleaner spray"
    ],
    cost: 320,
    time_hours: 2.5,
    urgency: "P3",
    urgency_reason: "General comfort complaint during business hours without safety hazard.",
    is_tech_confirmed: true,
    timestamp: "2026-09-18 14:15"
  },
  {
    id: "CASE-103",
    building: "Building B",
    equipment: "HVAC",
    complaint: "Central rooftop chiller unit B-2 tripping circuit breaker on startup.",
    cause: "Seized compressor motor windings / dual run capacitor failure",
    fix_steps: [
      "Disconnect power and test motor winding resistance with megohmmeter",
      "Replace defective dual-run capacitor (45/5 uF)",
      "Verify start amp draw stays within rated RLA limits"
    ],
    cost: 450,
    time_hours: 3.0,
    urgency: "P1",
    urgency_reason: "Entire floor ventilation halted; potential server room thermal overload.",
    is_tech_confirmed: true,
    timestamp: "2026-09-20 08:45"
  },
  {
    id: "CASE-104",
    building: "Building A",
    equipment: "HVAC",
    complaint: "Duct grille emitting burning smell and squealing sound when thermostat turns on.",
    cause: "Worn HVAC belt slipping on motor pulley and burnt rubber dust",
    fix_steps: [
      "Inspect belt tension and pulley alignment",
      "Replace worn A-section V-belt",
      "Clean motor housing and check bearing play"
    ],
    cost: 140,
    time_hours: 1.0,
    urgency: "P2",
    urgency_reason: "Burning odor triggers false fire alarms and occupant panic.",
    is_tech_confirmed: true,
    timestamp: "2026-09-22 11:10"
  },
  {
    id: "CASE-105",
    building: "Building C",
    equipment: "HVAC",
    complaint: "Thermostat display flashing error code E4 and room temp stuck at 78F.",
    cause: "Faulty ambient air temperature thermistor sensor",
    fix_steps: [
      "Check thermistor resistance curve against temperature table",
      "Replace 10k ohm NTC temperature sensor wire lead",
      "Recalibrate digital thermostat controller"
    ],
    cost: 95,
    time_hours: 0.75,
    urgency: "P4",
    urgency_reason: "Minor temperature drift, secondary thermostat backed up.",
    is_tech_confirmed: true,
    timestamp: "2026-09-25 09:20"
  },
  {
    id: "CASE-106",
    building: "Building A",
    equipment: "HVAC",
    complaint: "Water dripping from ceiling drop tiles under air handler unit in hallway.",
    cause: "Overflowing secondary condensate drip pan due to algae buildup",
    fix_steps: [
      "Vacuum out secondary drip pan and install pan treatment tablets",
      "Verify float switch safety shut-off mechanism",
      "Replace wet ceiling tiles"
    ],
    cost: 160,
    time_hours: 1.25,
    urgency: "P2",
    urgency_reason: "Active dripping onto foot traffic area creates slip hazard.",
    is_tech_confirmed: true,
    timestamp: "2026-09-27 16:05"
  },
  {
    id: "CASE-107",
    building: "Building D",
    equipment: "HVAC",
    complaint: "VAV box actuator clicking constantly and airflow restricted in conference room.",
    cause: "Stripped gear drive in Honeywell linear damper actuator",
    fix_steps: [
      "Isolate VAV control power",
      "Unbolt damper shaft coupling and swap out actuator motor",
      "Re-stroke damper blade from 0 to 100% position"
    ],
    cost: 210,
    time_hours: 1.75,
    urgency: "P3",
    urgency_reason: "Airflow imbalance in executive conference area.",
    is_tech_confirmed: true,
    timestamp: "2026-09-28 13:40"
  },
  {
    id: "CASE-108",
    building: "Building B",
    equipment: "HVAC",
    complaint: "Heavy vibration felt through floor near mechanical room 102.",
    cause: "Broken spring isolator mount under supply fan assembly",
    fix_steps: [
      "Jack up fan base frame and remove sheared spring mount",
      "Install heavy-duty seismic spring isolator pad",
      "Rebalance fan wheel alignment"
    ],
    cost: 380,
    time_hours: 3.5,
    urgency: "P2",
    urgency_reason: "Vibration fatigue may cause refrigerant line failure if unaddressed.",
    is_tech_confirmed: true,
    timestamp: "2026-09-29 15:50"
  },
  {
    id: "CASE-109",
    building: "Building C",
    equipment: "HVAC",
    complaint: "Air conditioning blowing ice crystals out of vent in room 412.",
    cause: "Frozen evaporator coil from extremely restricted air filter",
    fix_steps: [
      "Turn mode to Fan Only to thaw ice block completely",
      "Replace clogged MERV 11 air filter",
      "Verify blower CFM air velocity meets standard"
    ],
    cost: 110,
    time_hours: 1.5,
    urgency: "P3",
    urgency_reason: "Coil icing reduces cooling efficiency.",
    is_tech_confirmed: true,
    timestamp: "2026-10-01 10:15"
  },
  {
    id: "CASE-110",
    building: "Building A",
    equipment: "HVAC",
    complaint: "AC compressor unit humming loudly but fan wheel is completely stationary.",
    cause: "Blown start capacitor and stuck contactor relay switch",
    fix_steps: [
      "Replace pitted 24V AC contactor switch",
      "Install hard start kit and new start capacitor",
      "Test voltage drops under heavy startup load"
    ],
    cost: 230,
    time_hours: 2.0,
    urgency: "P2",
    urgency_reason: "Compressor over-temp trip imminent.",
    is_tech_confirmed: true,
    timestamp: "2026-10-02 11:30"
  },

  // --- REFRIGERATION CASES (11-18) ---
  {
    id: "CASE-111",
    building: "Building B",
    equipment: "Refrigeration",
    complaint: "Cafeteria fridge compressor making grinding noise and food cabinet temperature rising.",
    cause: "Worn compressor piston bearings and ice buildup on evaporator fan blades",
    fix_steps: [
      "Recover R-134a refrigerant and remove damaged compressor unit",
      "Install replacement sealed rotary compressor & filter drier",
      "Manual defrost evaporator assembly and test defrost heater timer"
    ],
    cost: 580,
    time_hours: 4.0,
    urgency: "P1",
    urgency_reason: "Perishable food spoilage and health compliance violation.",
    is_tech_confirmed: true,
    timestamp: "2026-09-12 07:30"
  },
  {
    id: "CASE-112",
    building: "Building B",
    equipment: "Refrigeration",
    complaint: "Walk-in cooler door gasket loose, frost accumulating on interior ceiling.",
    cause: "Torn magnetic door seal gasket and failed door closure latch spring",
    fix_steps: [
      "Strip damaged perimeter gasket from door channel",
      "Press fit replacement heavy-duty silicone magnetic gasket",
      "Adjust self-closing hinge spring tension"
    ],
    cost: 175,
    time_hours: 1.25,
    urgency: "P3",
    urgency_reason: "Energy waste and frost accumulation inside unit.",
    is_tech_confirmed: true,
    timestamp: "2026-09-14 14:20"
  },
  {
    id: "CASE-113",
    building: "Building B",
    equipment: "Refrigeration",
    complaint: "Ice machine in staff breakroom not dispensing ice cubes, water reservoir overflowing.",
    cause: "Scale build-up in water inlet solenoid valve pin hole",
    fix_steps: [
      "De-scale water circuit using food-grade nickel-safe ice machine cleaner",
      "Replace clogged dual water inlet solenoid valve",
      "Replace inline water filter cartridge"
    ],
    cost: 195,
    time_hours: 1.5,
    urgency: "P3",
    urgency_reason: "Breakroom amenity outage and minor water spill risk.",
    is_tech_confirmed: true,
    timestamp: "2026-09-19 16:45"
  },
  {
    id: "CASE-114",
    building: "Building B",
    equipment: "Refrigeration",
    complaint: "Under-counter beverage chiller pooling puddle of water on floor daily.",
    cause: "Cracked internal drain condensate pan under cooling coil",
    fix_steps: [
      "Remove bottom cover plate and inspect drain pan",
      "Replace cracked plastic drain tray with stainless steel pan",
      "Reroute drain hose to floor drain"
    ],
    cost: 140,
    time_hours: 1.0,
    urgency: "P3",
    urgency_reason: "Floor moisture slip hazard in kitchen prep zone.",
    is_tech_confirmed: true,
    timestamp: "2026-09-21 11:00"
  },
  {
    id: "CASE-115",
    building: "Building C",
    equipment: "Refrigeration",
    complaint: "Lab reagent freezer temperature alarm sounding (-10C instead of -20C target).",
    cause: "Defrost cycle timer relay stuck in active defrost heat loop",
    fix_steps: [
      "Override defrost clock timer manually to disengage heater",
      "Replace electronic defrost control module board",
      "Monitor internal temperature logging sensor over 2 hours"
    ],
    cost: 390,
    time_hours: 2.0,
    urgency: "P1",
    urgency_reason: "High-value lab samples at immediate risk of thermal degradation.",
    is_tech_confirmed: true,
    timestamp: "2026-09-24 06:15"
  },
  {
    id: "CASE-116",
    building: "Building B",
    equipment: "Refrigeration",
    complaint: "Kitchen display fridge glass pane fogging up with heavy condensation outside.",
    cause: "Failed door frame heater wire element",
    fix_steps: [
      "Measure heater element circuit continuity (open circuit detected)",
      "Replace door mullion anti-sweat heater strip",
      "Re-seal frame wiring harness grommets"
    ],
    cost: 165,
    time_hours: 1.5,
    urgency: "P4",
    urgency_reason: "Cosmetic fogging issue, internal temperature remains stable.",
    is_tech_confirmed: true,
    timestamp: "2026-09-26 13:10"
  },
  {
    id: "CASE-117",
    building: "Building B",
    equipment: "Refrigeration",
    complaint: "Display cooler fan motor buzzing loudly and cabinet temperature at 55F.",
    cause: "Evaporator fan blade hit ice formation due to blocked drain line",
    fix_steps: [
      "Melt ice block around fan shroud using heat gun",
      "Clear drain line tube and install drain heater cable",
      "Replace bent 4-blade aluminum fan impeller"
    ],
    cost: 210,
    time_hours: 1.75,
    urgency: "P2",
    urgency_reason: "Temperature elevation will lead to food spoilage within hours.",
    is_tech_confirmed: true,
    timestamp: "2026-09-30 09:40"
  },
  {
    id: "CASE-118",
    building: "Building D",
    equipment: "Refrigeration",
    complaint: "Water chiller fountain unit dispensing lukewarm water with high pressure.",
    cause: "Refrigerant loss from condenser copper coil elbow micro-leak",
    fix_steps: [
      "Brazing repair copper elbow pinhole leak with silver solder",
      "Evacuate system and recharge R-134a to specs",
      "Adjust cold water thermostat setpoint to 45F"
    ],
    cost: 260,
    time_hours: 2.25,
    urgency: "P4",
    urgency_reason: "Minor convenience issue for drinking fountain.",
    is_tech_confirmed: true,
    timestamp: "2026-10-03 14:50"
  },

  // --- PLUMBING CASES (19-28) ---
  {
    id: "CASE-119",
    building: "Building C",
    equipment: "Plumbing",
    complaint: "Main restroom sink pipe leaking water onto floor in Building C.",
    cause: "Corroded P-trap slip joint washer and loose wall tailpiece flange",
    fix_steps: [
      "Disassemble corroded PVC P-trap pipe assembly",
      "Replace rubber slip washers and tailpiece wall connection",
      "Hand-tighten joints, apply plumbers putty and run water leak test"
    ],
    cost: 125,
    time_hours: 1.0,
    urgency: "P2",
    urgency_reason: "Active floor water accumulation risks slip injury and tile damage.",
    is_tech_confirmed: true,
    timestamp: "2026-09-10 11:25"
  },
  {
    id: "CASE-120",
    building: "Building C",
    equipment: "Plumbing",
    complaint: "Commercial flushometer toilet running continuously in 1st floor mens restroom.",
    cause: "Deteriorated rubber diaphragm assembly inside Sloan flush valve",
    fix_steps: [
      "Shut off control stop valve",
      "Unscrew top cover and replace inner diaphragm dual-filter kit",
      "Re-open stop valve and test flush cycle timing (should stop in 4 secs)"
    ],
    cost: 90,
    time_hours: 0.5,
    urgency: "P3",
    urgency_reason: "Continuous water waste, high utility bill impact.",
    is_tech_confirmed: true,
    timestamp: "2026-09-13 15:40"
  },
  {
    id: "CASE-121",
    building: "Building D",
    equipment: "Plumbing",
    complaint: "Hot water heater unit 2 in basement leaking water from pressure relief valve.",
    cause: "Excessive tank pressure caused by failed thermal expansion tank bladder",
    fix_steps: [
      "Test pre-charge air pressure on expansion tank Schrader valve",
      "Replace 5-gallon thermal expansion tank",
      "Replace 150 PSI T&P safety valve and run drain discharge pipe to floor"
    ],
    cost: 340,
    time_hours: 2.5,
    urgency: "P1",
    urgency_reason: "High pressure hot water burst risk in mechanical basement.",
    is_tech_confirmed: true,
    timestamp: "2026-09-16 09:10"
  },
  {
    id: "CASE-122",
    building: "Building A",
    equipment: "Plumbing",
    complaint: "Restroom floor drain backing up foul smelling black water during peak morning hours.",
    cause: "Main drain line grease & paper clog 40 feet down lateral pipe",
    fix_steps: [
      "Feed 3/4 inch power drain auger snake wire through cleanout access",
      "Clear line blockage and hydro-jet lateral line with hot water pipe wash",
      "Sanitize affected floor drain area with disinfectant"
    ],
    cost: 410,
    time_hours: 3.0,
    urgency: "P1",
    urgency_reason: "Biohazard sewage backup, requires immediate facility closure.",
    is_tech_confirmed: true,
    timestamp: "2026-09-17 08:00"
  },
  {
    id: "CASE-123",
    building: "Building C",
    equipment: "Plumbing",
    complaint: "Water pressure extremely low in 4th floor sinks and drinking fountains.",
    cause: "Clogged inline booster pump suction strainer screen",
    fix_steps: [
      "Isolate pump supply isolation valves",
      "Unscrew strainer cap and scrub stainless steel mesh basket filter",
      "Prime pump housing and restore line pressure to 60 PSI"
    ],
    cost: 160,
    time_hours: 1.5,
    urgency: "P3",
    urgency_reason: "Reduced water utility availability across upper floor.",
    is_tech_confirmed: true,
    timestamp: "2026-09-20 14:30"
  },
  {
    id: "CASE-124",
    building: "Building D",
    equipment: "Plumbing",
    complaint: "SINK faucet dripping steadily from spout even when turned hard off.",
    cause: "Worn ceramic cartridge stem valve inside double lever faucet",
    fix_steps: [
      "Remove decorative handle caps and retaining screw",
      "Extract damaged cold/hot ceramic disc cartridges",
      "Install OEM replacement cartridge unit and new O-rings"
    ],
    cost: 85,
    time_hours: 0.75,
    urgency: "P4",
    urgency_reason: "Minor drip loss, contained in sink basin.",
    is_tech_confirmed: true,
    timestamp: "2026-09-23 10:05"
  },
  {
    id: "CASE-125",
    building: "Building A",
    equipment: "Plumbing",
    complaint: "Pipes banging loudly ('water hammer') whenever flush valves operate.",
    cause: "Water hammer arrestor chambers waterlogged and missing pressure charge",
    fix_steps: [
      "Shut main water line and drain plumbing risers to recharge air chambers",
      "Install mechanical piston water hammer arrestors at valve headers",
      "Check pipe support strap tightness"
    ],
    cost: 220,
    time_hours: 2.0,
    urgency: "P3",
    urgency_reason: "Vibration can loosen pipe joints over extended time.",
    is_tech_confirmed: true,
    timestamp: "2026-09-26 15:15"
  },
  {
    id: "CASE-126",
    building: "Building C",
    equipment: "Plumbing",
    complaint: "Water sensor alarm under breakroom sink triggered, wet cabinet base.",
    cause: "Flexible braided steel supply hose pinhole leak at crimp fitting",
    fix_steps: [
      "Turn off under-sink angle stop valve",
      "Replace 3/8 inch compression stainless braided supply line",
      "Dry cabinet floor and reset electronic leak sensor"
    ],
    cost: 115,
    time_hours: 0.75,
    urgency: "P2",
    urgency_reason: "Active leak inside millwork cabinetry causing wood swelling.",
    is_tech_confirmed: true,
    timestamp: "2026-09-28 17:00"
  },
  {
    id: "CASE-127",
    building: "Building B",
    equipment: "Plumbing",
    complaint: "Urinal in 2nd floor restroom draining very slowly and filling to rim.",
    cause: "Uric scale buildup in 2-inch cast iron drain arm",
    fix_steps: [
      "Remove urinal fixture from wall hanger bracket",
      "Snake drain pipe with 3/8 inch cutter head wire",
      "Treat drain line with enzymatic descaling solvent and re-mount fixture with new wall gasket"
    ],
    cost: 240,
    time_hours: 2.0,
    urgency: "P2",
    urgency_reason: "Risk of urinal overflow onto restroom floor.",
    is_tech_confirmed: true,
    timestamp: "2026-10-01 13:25"
  },
  {
    id: "CASE-128",
    building: "Building D",
    equipment: "Plumbing",
    complaint: "Sump pump in elevator pit running continuously with high water alarm LED lit.",
    cause: "Stuck float switch stuck against pit wall / check valve flapper failure",
    fix_steps: [
      "Free mechanical tether float switch from pit side wall obstruction",
      "Replace 1.5-inch inline silent check valve",
      "Test automatic pump start/stop water cycle levels"
    ],
    cost: 290,
    time_hours: 2.0,
    urgency: "P1",
    urgency_reason: "Water accumulation in elevator pit risks flooding elevator electrical controls.",
    is_tech_confirmed: true,
    timestamp: "2026-10-04 08:30"
  },

  // --- ELECTRICAL CASES (29-36) ---
  {
    id: "CASE-129",
    building: "Building A",
    equipment: "Electrical",
    complaint: "Breaker tripping repeatedly in server rack B after installing new UPS power strip.",
    cause: "Circuit overload exceeding 20A breaker limit & unbalanced phase loading",
    fix_steps: [
      "Perform clamp meter amperage test on circuit breaker branch",
      "Redistribute server power cords to secondary 20A dedicated branch circuit",
      "Replace weak thermal circuit breaker switch"
    ],
    cost: 270,
    time_hours: 1.5,
    urgency: "P1",
    urgency_reason: "IT server room power failure risks critical database downtime.",
    is_tech_confirmed: true,
    timestamp: "2026-09-11 13:10"
  },
  {
    id: "CASE-130",
    building: "Building D",
    equipment: "Electrical",
    complaint: "Fluorescent lights flickering rapidly and buzzing loudly in 2nd floor corridor.",
    cause: "Failing electronic lighting ballast and loose neutral wire wire-nut",
    fix_steps: [
      "Disconnect power to lighting circuit",
      "Bypass ballast and retrofit fixture with direct-wire LED T8 tubes",
      "Re-strip and re-nut loose neutral wire bundle"
    ],
    cost: 155,
    time_hours: 1.25,
    urgency: "P3",
    urgency_reason: "Occupant eye strain and noise nuisance in public hallway.",
    is_tech_confirmed: true,
    timestamp: "2026-09-15 14:00"
  },
  {
    id: "CASE-131",
    building: "Building A",
    equipment: "Electrical",
    complaint: "Electrical outlet in kitchen island sparking when plugging in microwave.",
    cause: "Loose screw terminal wiring on GFCI receptacle causing arcing",
    fix_steps: [
      "Turn off panel breaker circuit #14",
      "Replace heat-damaged 20A commercial GFCI outlet receptacle",
      "Torque wire terminals to 14 in-lbs and install tamper-resistant wall plate"
    ],
    cost: 110,
    time_hours: 0.75,
    urgency: "P1",
    urgency_reason: "Active electrical arcing / fire hazard in wall cavity.",
    is_tech_confirmed: true,
    timestamp: "2026-09-18 10:40"
  },
  {
    id: "CASE-132",
    building: "Building C",
    equipment: "Electrical",
    complaint: "Emergency exit sign light unlit on stairwell 3, backup battery unit Beeping.",
    cause: "Expired Ni-Cd emergency backup battery pack",
    fix_steps: [
      "Open sign enclosure housing",
      "Unplug old battery leads and insert new 4.8V 700mAh Ni-Cd battery pack",
      "Press test button for 30 seconds to verify illumination status"
    ],
    cost: 65,
    time_hours: 0.5,
    urgency: "P2",
    urgency_reason: "Life safety code violation during building emergency evacuation.",
    is_tech_confirmed: true,
    timestamp: "2026-09-22 16:30"
  },
  {
    id: "CASE-133",
    building: "Building D",
    equipment: "Electrical",
    complaint: "Main distribution panel room smells like hot plastic / ozone near breaker 22.",
    cause: "High resistance loose aluminum busbar lug connection overheating",
    fix_steps: [
      "Perform infrared thermal imaging survey of panel busbars",
      "De-energize main distribution panel with lockout/tagout protocol",
      "Clean oxidized lug contact surfaces, apply anti-oxidant paste, and torque to specification"
    ],
    cost: 490,
    time_hours: 3.5,
    urgency: "P1",
    urgency_reason: "Catastrophic arc flash & electrical panel fire threat.",
    is_tech_confirmed: true,
    timestamp: "2026-09-25 11:15"
  },
  {
    id: "CASE-134",
    building: "Building B",
    equipment: "Electrical",
    complaint: "Motion sensor light switches turning off while rooms are still occupied.",
    cause: "Incorrect PIR sensor sensitivity potentiometer knob setting and dusty lens cover",
    fix_steps: [
      "Clean optical PIR sensor lens with isopropyl alcohol wipe",
      "Adjust timeout delay jumper setting from 5 mins to 15 mins",
      "Increase PIR sensitivity dial setting"
    ],
    cost: 75,
    time_hours: 0.5,
    urgency: "P4",
    urgency_reason: "Minor convenience issue for office occupants.",
    is_tech_confirmed: true,
    timestamp: "2026-09-27 12:45"
  },
  {
    id: "CASE-135",
    building: "Building C",
    equipment: "Electrical",
    complaint: "Floor box power pop-up outlet stuck down and won't latch upward.",
    cause: "Bent mechanical release latch spring and grit in brass track",
    fix_steps: [
      "Vacuum debris out of floor receptacle housing cavity",
      "Straighten stainless latch spring wire",
      "Apply dry Teflon lubricant to sliding side tracks"
    ],
    cost: 95,
    time_hours: 0.75,
    urgency: "P4",
    urgency_reason: "Inconvenience accessing floor power in conference room.",
    is_tech_confirmed: true,
    timestamp: "2026-09-29 09:10"
  },
  {
    id: "CASE-136",
    building: "Building A",
    equipment: "Electrical",
    complaint: "Outdoor parking lot perimeter light pole #4 dark overnight.",
    cause: "Blown photocell sensor controller unit on light pole head",
    fix_steps: [
      "Deploy bucket lift truck to light pole fixture head",
      "Twist-lock replace 120-277V dusk-to-dawn photocell receptacle",
      "Inspect LED driver output voltage"
    ],
    cost: 210,
    time_hours: 1.5,
    urgency: "P3",
    urgency_reason: "Parking lot security lighting coverage reduced.",
    is_tech_confirmed: true,
    timestamp: "2026-10-02 17:30"
  },

  // --- ELEVATOR CASES (37-42) ---
  {
    id: "CASE-137",
    building: "Building A",
    equipment: "Elevator",
    complaint: "Elevator B doors closing too fast and trapping passengers / bumping arms.",
    cause: "Faulty door safety edge infrared curtain sensor matrix power supply",
    fix_steps: [
      "Clean dust and fingerprints off full-height infrared door edge lenses",
      "Replace door detector controller power supply board",
      "Adjust door nudging speed timer and torque limit settings"
    ],
    cost: 420,
    time_hours: 2.5,
    urgency: "P1",
    urgency_reason: "Passenger physical impact risk and ADA accessibility compliance hazard.",
    is_tech_confirmed: true,
    timestamp: "2026-09-14 09:30"
  },
  {
    id: "CASE-138",
    building: "Building B",
    equipment: "Elevator",
    complaint: "Elevator A stopping 2 inches below floor level when landing at 3rd floor.",
    cause: "Optical floor leveling vane sensor dirty and out of alignment",
    fix_steps: [
      "Inspect car top leveling sensor assembly bracket",
      "Clean optical photo-eye lenses with lint-free swab",
      "Re-align floor leveling magnet vanes for precision stop matching"
    ],
    cost: 310,
    time_hours: 2.0,
    urgency: "P2",
    urgency_reason: "Trip hazard when stepping in/out of elevator car.",
    is_tech_confirmed: true,
    timestamp: "2026-09-17 14:10"
  },
  {
    id: "CASE-139",
    building: "Building C",
    equipment: "Elevator",
    complaint: "Passenger elevator making high pitched grinding noise during acceleration up.",
    cause: "Worn guide shoe gib inserts on counterweight rail track",
    fix_steps: [
      "Lock out elevator car in hoistway pit",
      "Replace worn phenolic guide shoe slider gib pads",
      "Lubricate counterweight guide rails with ISO VG 68 slide oil"
    ],
    cost: 380,
    time_hours: 3.0,
    urgency: "P2",
    urgency_reason: "Mechanical friction can damage elevator rail alignment.",
    is_tech_confirmed: true,
    timestamp: "2026-09-21 10:20"
  },
  {
    id: "CASE-140",
    building: "Building A",
    equipment: "Elevator",
    complaint: "Elevator car interior floor call buttons for 4th floor not illuminating.",
    cause: "Burned out LED push-button micro-switch contact assembly",
    fix_steps: [
      "Remove car operating panel faceplate stainless cover",
      "Unclip defective tactile push-button switch module",
      "Wire replacement illuminated LED button assembly and test floor call"
    ],
    cost: 140,
    time_hours: 1.0,
    urgency: "P4",
    urgency_reason: "Cosmetic indicator failure, button still accepts floor input.",
    is_tech_confirmed: true,
    timestamp: "2026-09-24 15:45"
  },
  {
    id: "CASE-141",
    building: "Building D",
    equipment: "Elevator",
    complaint: "Freight elevator car fan and ceiling lighting dead.",
    cause: "Blown car light fuse on controller board inside machine room",
    fix_steps: [
      "Inspect controller board cabinet 120V auxiliary circuit breaker",
      "Replace blown 5A 250V glass cartridge fuse",
      "Inspect traveling cable conductor for ground short"
    ],
    cost: 160,
    time_hours: 1.25,
    urgency: "P3",
    urgency_reason: "Dark elevator car interior, safety hazard during loading.",
    is_tech_confirmed: true,
    timestamp: "2026-09-28 11:30"
  },
  {
    id: "CASE-142",
    building: "Building B",
    equipment: "Elevator",
    complaint: "Elevator hall call button key switch jammed on 1st floor lobby.",
    cause: "Vandalized / deformed key switch cylinder tumbler spring",
    fix_steps: [
      "Extract broken key fragment with precision pick set",
      "Replace 2-position key cylinder switch barrel",
      "Test fire service phase 1 key switch recall function"
    ],
    cost: 190,
    time_hours: 1.5,
    urgency: "P2",
    urgency_reason: "Fire service elevator override key operation compromised.",
    is_tech_confirmed: true,
    timestamp: "2026-10-01 16:10"
  },

  // --- SECURITY & ACCESS CONTROL CASES (43-48) ---
  {
    id: "CASE-143",
    building: "Building D",
    equipment: "Security",
    complaint: "Main entrance automatic sliding glass doors won't open when approached.",
    cause: "Failed overhead microwave motion detection radar head sensor",
    fix_steps: [
      "Remove header panel cover and check 24V DC power feed",
      "Replace BEA eagle motion sensor radar module",
      "Adjust microwave field pattern zone width and depth dip switches"
    ],
    cost: 290,
    time_hours: 1.5,
    urgency: "P1",
    urgency_reason: "Main building egress blocked, emergency access hazard.",
    is_tech_confirmed: true,
    timestamp: "2026-09-13 08:15"
  },
  {
    id: "CASE-144",
    building: "Building C",
    equipment: "Security",
    complaint: "Keycard badge reader at server room door chimes red and denies all valid cards.",
    cause: "Corroded RS-485 communication line terminal block at access controller",
    fix_steps: [
      "Inspect door access control controller sub-panel",
      "Re-strip corroded shielded twisted pair communications wire",
      "Reboot reader port and verify RFID card read response in software log"
    ],
    cost: 160,
    time_hours: 1.0,
    urgency: "P1",
    urgency_reason: "Critical server room access blocked for systems engineers.",
    is_tech_confirmed: true,
    timestamp: "2026-09-16 11:50"
  },
  {
    id: "CASE-145",
    building: "Building A",
    equipment: "Security",
    complaint: "Magnetic lock on fire exit door 1B humming loudly and door can be pushed open without badge.",
    cause: "Voltage drop on 12V maglock power line due to failing power supply transformer",
    fix_steps: [
      "Measure DC output voltage at maglock terminals (reading 8.2V DC instead of 12V)",
      "Replace Altronix 12V DC 4A power supply board with battery backup switchover",
      "Clean armature plate face with alcohol"
    ],
    cost: 230,
    time_hours: 1.75,
    urgency: "P1",
    urgency_reason: "Physical security breach on exterior emergency exit door.",
    is_tech_confirmed: true,
    timestamp: "2026-09-19 15:10"
  },
  {
    id: "CASE-146",
    building: "Building B",
    equipment: "Security",
    complaint: "CCTV security camera in parking garage video stream flickering black.",
    cause: "Water ingress inside outdoor IP camera PoE RJ45 weather gland connection",
    fix_steps: [
      "Lower camera housing and inspect RJ-45 connector (corrosion found)",
      "Re-terminate Cat6 cable with new shielded RJ45 connector",
      "Seal cable entry housing with silicone grease and IP67 weather boot"
    ],
    cost: 175,
    time_hours: 1.25,
    urgency: "P3",
    urgency_reason: "Reduced security surveillance blind spot in garage.",
    is_tech_confirmed: true,
    timestamp: "2026-09-23 14:00"
  },
  {
    id: "CASE-147",
    building: "Building D",
    equipment: "Security",
    complaint: "Turnstile gate barrier arm stuck in raised position and alarm sounding.",
    cause: "Optical passage sensor obstructed by reflective tape sticker",
    fix_steps: [
      "Remove optical sensor housing cover",
      "Clean photo-eye lenses and clear tape obstruction",
      "Recalibrate turnstile barrier zero-position encoder switch"
    ],
    cost: 120,
    time_hours: 0.75,
    urgency: "P2",
    urgency_reason: "Lobby entrance bottleneck during morning rush hour.",
    is_tech_confirmed: true,
    timestamp: "2026-09-27 08:40"
  },
  {
    id: "CASE-148",
    building: "Building C",
    equipment: "Security",
    complaint: "Loading dock overhead security shutter door closing very slowly with squealing noise.",
    cause: "Unlubricated roller guide tracks and stretched motor drive chain",
    fix_steps: [
      "Tighten motor drive chain turnbuckle assembly",
      "Spray heavy-duty lithium grease onto curtain guide channels",
      "Test emergency stop safety edge sensor reverse drive"
    ],
    cost: 195,
    time_hours: 1.5,
    urgency: "P3",
    urgency_reason: "Freight loading dock operation slowdown.",
    is_tech_confirmed: true,
    timestamp: "2026-10-03 10:30"
  }
];

/**
 * Storage helper for persisting active case database in localStorage
 */
export function getActiveCases() {
  const stored = localStorage.getItem("fixfinder_cases");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored cases", e);
    }
  }
  return [...INITIAL_CASES];
}

export function saveCaseToLibrary(newCase) {
  const cases = getActiveCases();
  cases.unshift(newCase);
  localStorage.setItem("fixfinder_cases", JSON.stringify(cases));
  return cases;
}

export function resetCasesToDefault() {
  localStorage.removeItem("fixfinder_cases");
  return [...INITIAL_CASES];
}

/**
 * Stopwords list for text scoring
 */
const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "with", "and", "or", "is", "are",
  "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "but", "if", "not", "no", "this", "that", "it", "its", "from", "by", "my", "of",
  "off", "out", "over", "under", "again", "then", "once", "here", "there", "when",
  "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other",
  "some", "such", "than", "too", "very", "can", "will", "just", "should", "now", "room"
]);

/**
 * Tokenize and normalize text
 */
export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Detect Equipment Type from complaint text
 */
export function detectEquipment(text) {
  const lower = text.toLowerCase();
  if (lower.includes("ac") || lower.includes("air cond") || lower.includes("chiller") || lower.includes("hvac") || lower.includes("duct") || lower.includes("vent") || lower.includes("vav") || lower.includes("thermostat") || lower.includes("cooling")) {
    return "HVAC";
  }
  if (lower.includes("fridge") || lower.includes("cooler") || lower.includes("refrigerat") || lower.includes("freezer") || lower.includes("ice") || lower.includes("compressor")) {
    return "Refrigeration";
  }
  if (lower.includes("leak") || lower.includes("pipe") || lower.includes("sink") || lower.includes("drain") || lower.includes("toilet") || lower.includes("flush") || lower.includes("water") || lower.includes("plumb") || lower.includes("urinal") || lower.includes("faucet") || lower.includes("sump")) {
    return "Plumbing";
  }
  if (lower.includes("breaker") || lower.includes("light") || lower.includes("power") || lower.includes("spark") || lower.includes("outlet") || lower.includes("ballast") || lower.includes("wire") || lower.includes("fuse") || lower.includes("electr")) {
    return "Electrical";
  }
  if (lower.includes("elevator") || lower.includes("lift") || lower.includes("hoist") || lower.includes("door sensor") || lower.includes("hall call")) {
    return "Elevator";
  }
  if (lower.includes("door") || lower.includes("badge") || lower.includes("keycard") || lower.includes("camera") || lower.includes("cctv") || lower.includes("maglock") || lower.includes("security") || lower.includes("turnstile") || lower.includes("gate")) {
    return "Security";
  }
  return "General Maintenance";
}

/**
 * Calculate Word-Overlap & Keyword Similarity Score between complaint & historical cases
 */
export function diagnoseComplaint(complaintText, selectedBuilding = "All") {
  const queryTokens = tokenize(complaintText);
  if (queryTokens.length === 0) {
    return {
      status: "invalid",
      message: "Please enter a descriptive maintenance complaint."
    };
  }

  const detectedEquip = detectEquipment(complaintText);
  const cases = getActiveCases();

  // Filter cases if building filter specified
  let candidateCases = cases;
  if (selectedBuilding && selectedBuilding !== "All") {
    candidateCases = cases.filter(c => c.building === selectedBuilding || c.building === "All");
    if (candidateCases.length < 3) {
      candidateCases = cases; // Fallback to full library if specific building cases are sparse
    }
  }

  // Calculate score for each case
  const scoredCases = candidateCases.map(c => {
    const caseText = `${c.complaint} ${c.cause} ${c.equipment} ${c.fix_steps.join(" ")}`;
    const caseTokens = tokenize(caseText);
    const caseTokenSet = new Set(caseTokens);

    // Calculate Jaccard & overlap boost
    let matchCount = 0;
    queryTokens.forEach(token => {
      if (caseTokenSet.has(token)) matchCount++;
    });

    // Bonus for equipment match
    let equipmentBonus = 0;
    if (c.equipment.toLowerCase() === detectedEquip.toLowerCase()) {
      equipmentBonus = 0.15;
    }

    // Direct exact keyword match boosts
    let keywordBonus = 0;
    const queryLower = complaintText.toLowerCase();
    if (queryLower.includes("leaking") && c.complaint.toLowerCase().includes("leak")) keywordBonus += 0.1;
    if (queryLower.includes("rattling") && c.complaint.toLowerCase().includes("rattling")) keywordBonus += 0.15;
    if (queryLower.includes("tripping") && c.complaint.toLowerCase().includes("tripping")) keywordBonus += 0.15;
    if (queryLower.includes("grinding") && c.complaint.toLowerCase().includes("grinding")) keywordBonus += 0.15;

    const jaccard = matchCount / (queryTokens.length + caseTokenSet.size - matchCount || 1);
    const overlapRatio = matchCount / queryTokens.length;

    let score = (overlapRatio * 0.5) + (jaccard * 0.2) + equipmentBonus + keywordBonus;
    score = Math.min(Math.round(score * 100), 98); // Cap max confidence to 98%

    return {
      ...c,
      match_score: score
    };
  });

  // Sort by score descending
  scoredCases.sort((a, b) => b.match_score - a.match_score);

  const topMatches = scoredCases.slice(0, 5);
  const highestScore = topMatches.length > 0 ? topMatches[0].match_score : 0;

  // Threshold check for "No Strong Precedent"
  const MATCH_THRESHOLD = 30; // 30% score required
  const isNoPrecedent = highestScore < MATCH_THRESHOLD;

  if (isNoPrecedent) {
    return {
      status: "no_precedent",
      complaint: complaintText,
      detected_equipment: detectedEquip,
      highest_score: highestScore,
      top_matches: topMatches,
      reasoning: `No historical case in the library matched "${complaintText}" with confidence above the threshold (${MATCH_THRESHOLD}%). The top candidate matched at only ${highestScore}%.`,
      manager_summary: `The issue appears novel. The agent has safely flagged this for technician manual inspection without guessing a false diagnosis.`
    };
  }

  // Synthesize diagnosis results
  const rankedCausesMap = new Map();
  topMatches.forEach(c => {
    if (c.match_score >= MATCH_THRESHOLD) {
      if (!rankedCausesMap.has(c.cause)) {
        rankedCausesMap.set(c.cause, {
          cause: c.cause,
          score: c.match_score,
          cited_cases: [c.id],
          equipment: c.equipment,
          fix_steps: c.fix_steps
        });
      } else {
        const item = rankedCausesMap.get(c.cause);
        item.score = Math.max(item.score, c.match_score);
        if (!item.cited_cases.includes(c.id)) {
          item.cited_cases.push(c.id);
        }
      }
    }
  });

  const rankedCauses = Array.from(rankedCausesMap.values()).sort((a, b) => b.score - a.score);

  // Determine top diagnosis cause
  const primaryMatch = topMatches[0];

  // Calculate Median Cost & Range from top matches
  const validCosts = topMatches.filter(c => c.match_score >= MATCH_THRESHOLD).map(c => c.cost);
  const sortedCosts = [...validCosts].sort((a, b) => a - b);
  const medianCost = sortedCosts.length > 0 ? sortedCosts[Math.floor(sortedCosts.length / 2)] : primaryMatch.cost;
  const minCost = sortedCosts.length > 0 ? sortedCosts[0] : primaryMatch.cost;
  const maxCost = sortedCosts.length > 0 ? sortedCosts[sortedCosts.length - 1] : primaryMatch.cost;

  // Calculate Median Time
  const validTimes = topMatches.filter(c => c.match_score >= MATCH_THRESHOLD).map(c => c.time_hours);
  const sortedTimes = [...validTimes].sort((a, b) => a - b);
  const medianTime = sortedTimes.length > 0 ? sortedTimes[Math.floor(sortedTimes.length / 2)] : primaryMatch.time_hours;
  const minTime = sortedTimes.length > 0 ? sortedTimes[0] : primaryMatch.time_hours;
  const maxTime = sortedTimes.length > 0 ? sortedTimes[sortedTimes.length - 1] : primaryMatch.time_hours;

  // Determine Urgency & Escalation Rules
  let urgency = primaryMatch.urgency;
  let urgencyReason = primaryMatch.urgency_reason;

  // Rule override safety bumps
  const lowerText = complaintText.toLowerCase();
  if (lowerText.includes("leak") || lowerText.includes("spark") || lowerText.includes("trap") || lowerText.includes("smoke") || lowerText.includes("burst")) {
    if (urgency === "P3" || urgency === "P4") {
      urgency = "P2";
      urgencyReason = `Safety Escalation Bump: Detected critical safety keyword in complaint ('${lowerText.includes("leak") ? "leak" : "safety hazard"}').`;
    }
  }
  if (lowerText.includes("server") || lowerText.includes("fire") || lowerText.includes("power failure")) {
    urgency = "P1";
    urgencyReason = `P1 Critical Bump: Incident affects primary infrastructure or life safety systems.`;
  }

  // Check for Disagreement / Check before closing warning
  let disagreementWarning = null;
  if (rankedCauses.length > 1 && (rankedCauses[0].score - rankedCauses[1].score < 15)) {
    disagreementWarning = `⚠️ Diagnostic Ambiguity: Competing causes detected. Check secondary hypothesis ("${rankedCauses[1].cause}") before closing ticket.`;
  }

  // Manager plain-language summary
  const managerSummary = `Diagnosed as "${primaryMatch.cause}" with ${highestScore}% confidence based on ${topMatches.slice(0, 3).map(c => c.id).join(", ")}. Estimated repair cost is $${medianCost} taking approx ${medianTime} hrs (Urgency: ${urgency}).`;

  return {
    status: "success",
    complaint: complaintText,
    detected_equipment: detectedEquip,
    building: selectedBuilding,
    primary_cause: primaryMatch.cause,
    highest_score: highestScore,
    ranked_causes: rankedCauses,
    top_matches: topMatches,
    recommendation: {
      fix_steps: primaryMatch.fix_steps,
      median_cost: medianCost,
      cost_range: `$${minCost} - $${maxCost}`,
      median_time_hours: medianTime,
      time_range: `${minTime} - ${maxTime} hrs`,
      urgency: urgency,
      urgency_reason: urgencyReason
    },
    disagreement_warning: disagreementWarning,
    manager_summary: managerSummary,
    cited_case_ids: topMatches.map(m => m.id)
  };
}

/**
 * Activity Log helper
 */
export function getStoredActivityLog() {
  const stored = localStorage.getItem("fixfinder_activity");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return [
    {
      id: "ACT-901",
      timestamp: "2026-10-06 14:22",
      building: "Building A",
      complaint: "AC in room 204 is leaking water from casing...",
      cause: "Clogged condensate drain line and loose fan blade mounting",
      urgency: "P2",
      score: 94,
      status: "Confirmed"
    },
    {
      id: "ACT-902",
      timestamp: "2026-10-06 12:10",
      building: "Building B",
      complaint: "Cafeteria fridge compressor making grinding noise...",
      cause: "No strong precedent found",
      urgency: "P1",
      score: 22,
      status: "Corrected (Tech added case)"
    }
  ];
}

export function logActivity(activity) {
  const logs = getStoredActivityLog();
  logs.unshift(activity);
  localStorage.setItem("fixfinder_activity", JSON.stringify(logs));
  return logs;
}
