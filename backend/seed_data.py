import json
import random
import os
from datetime import datetime, timedelta

# Seed for reproducibility
random.seed(42)

BUILDINGS = ["Building A", "Building B", "Building C", "Building D"]
EQUIPMENT_TYPES = [
  "AC",
  "Generator",
  "Elevator",
  "Water Pump",
  "UPS",
  "Projector",
  "Electrical Panel"
]

EQUIPMENT_MODELS = {
  "AC": ["Daikin SkyAir 500", "Voltas Commercial VRV", "Carrier Ductable 10T", "BlueStar Inverter AC"],
  "Generator": ["Kirloskar KG200", "Cummins Silent Power 250", "Ashok Leyland 125kVA"],
  "Elevator": ["Otis Gen2 Premier", "Schindler 3300", "KONE Monospace 500"],
  "Water Pump": ["Grundfos Hydro MPC", "CRI Submersible 15HP", "Kirloskar Centrifugal Pump"],
  "UPS": ["APC Smart-UPS VT 40kVA", "Eaton 93E Industrial", "Emerson Liebert EXM"],
  "Projector": ["Epson PowerLite L635SU", "BenQ Laser LH720", "Sony VPL-FHZ85"],
  "Electrical Panel": ["Schneider Prisma P 400V", "ABB ArTu K Panel", "Siemens Sivacon S8"]
}

TECHNICIANS = [
  "Rajesh Kumar", "Amit Sharma", "Suresh Patel", "Vikram Singh",
  "Priya Nair", "Anil Deshmukh", "Deepak Verma", "Kavita Rao"
]

# Planted Specific Patterns:
# 1. Building C AC condensate-drain clogs in monsoon months (July-Sept)
# 2. Generator model Cummins Silent Power 250 fuel-filter issues

FAULT_TEMPLATES = {
  "AC": [
    {
      "complaint": "AC in room {room} is leaking water heavily onto desk and making rattling sound.",
      "symptoms": ["water leakage", "rattling noise", "reduced airflow"],
      "cause": "Clogged condensate drain line and loose blower fan mounting",
      "fix": "Cleared condensate drain line with nitrogen flush, tightened blower fan housing screws.",
      "parts": ["Drain Tube Seal", "V-Belt"],
      "cost_range": (1500, 4500),
      "downtime_range": (1.0, 3.0),
      "urgency": "P2"
    },
    {
      "complaint": "Warm air blowing from AC vents in 3rd floor open hall, temperature reaching 30C.",
      "symptoms": ["warm air", "insufficient cooling", "compressor hum"],
      "cause": "Low refrigerant level due to suction valve pinhole leak",
      "fix": "Repaired suction valve braze, vacuumed line, recharged R-410A refrigerant to spec.",
      "parts": ["R-410A Refrigerant 2kg", "Schrader Valve"],
      "cost_range": (4000, 9500),
      "downtime_range": (2.5, 5.0),
      "urgency": "P3"
    },
    {
      "complaint": "AC unit tripping main breaker immediately when thermostat calls for cooling.",
      "symptoms": ["tripping breaker", "electrical burning smell", "compressor buzz"],
      "cause": "Seized compressor motor windings and failed dual-run capacitor",
      "fix": "Replaced 45/5 uF dual-run start capacitor, installed hard start kit, verified RLA current.",
      "parts": ["Dual-Run Capacitor 45/5uF", "24V Contactor"],
      "cost_range": (6500, 14000),
      "downtime_range": (3.0, 6.0),
      "urgency": "P1"
    }
  ],
  "Generator": [
    {
      "complaint": "DG Set failed to auto-start during main grid power outage, control screen blank.",
      "symptoms": ["no start on outage", "starter solenoid click", "dead control board"],
      "cause": "Discharged 12V starter battery due to faulty trickle charger transformer",
      "fix": "Replaced 12V 120Ah lead-acid battery and trickle battery charger circuit module.",
      "parts": ["Exide 12V 120Ah Battery", "Trickle Charger Module"],
      "cost_range": (8500, 18000),
      "downtime_range": (1.5, 4.0),
      "urgency": "P1"
    },
    {
      "complaint": "Generator sputtering under 50% load and producing heavy black exhaust smoke.",
      "symptoms": ["engine sputtering", "black smoke", "rpm oscillation"],
      "cause": "Clogged primary fuel filter element and water contamination in diesel tank",
      "fix": "Drained fuel water separator bowl, replaced 10-micron fuel filter element, bled fuel lines.",
      "parts": ["Cummins Fuel Filter Element", "Water Separator Cartridge"],
      "cost_range": (3500, 8000),
      "downtime_range": (2.0, 4.5),
      "urgency": "P2"
    }
  ],
  "Elevator": [
    {
      "complaint": "Elevator B doors closing too rapidly, trapping passengers and ignoring light curtain sensor.",
      "symptoms": ["door closing fast", "sensor unresponsive", "passenger impact"],
      "cause": "Faulty door detector infrared curtain controller board",
      "fix": "Cleaned infrared light curtain lenses, replaced 24V DC door detector power supply module.",
      "parts": ["Infrared Light Curtain Sensor Kit", "Door Controller Board"],
      "cost_range": (12000, 28000),
      "downtime_range": (3.5, 8.0),
      "urgency": "P1"
    },
    {
      "complaint": "Elevator stopping 2 inches below floor level at 4th floor landing with slight jerk.",
      "symptoms": ["leveling misalignment", "floor jerk", "landing drift"],
      "cause": "Dirty optical floor leveling encoder sensor and misaligned magnetic vane",
      "fix": "Cleaned car-top leveling sensors, realigned magnetic guide vanes, recalibrated drive inverter zero point.",
      "parts": ["Optical Leveling Sensor"],
      "cost_range": (5500, 12000),
      "downtime_range": (2.0, 5.0),
      "urgency": "P2"
    }
  ],
  "Water Pump": [
    {
      "complaint": "Overhead tank water supply pump making loud screeching bearing noise and overheating.",
      "symptoms": ["screeching noise", "motor overheating", "low flow pressure"],
      "cause": "Worn mechanical drive shaft seal and rusted ball bearings",
      "fix": "Disassembled pump housing, pressed in new SKF 6205 bearings, replaced mechanical carbon-ceramic seal.",
      "parts": ["SKF 6205 Bearings (Set of 2)", "Mechanical Shaft Seal"],
      "cost_range": (3000, 7500),
      "downtime_range": (2.0, 4.0),
      "urgency": "P2"
    },
    {
      "complaint": "Water pump running continuously without shutting off, overflow pipe dripping.",
      "symptoms": ["continuous running", "tank overflow", "pressure switch failure"],
      "cause": "Failed water pressure sensor diaphragm stuck in closed contact state",
      "fix": "Replaced Danfoss pressure switch, adjusted cut-in and cut-off pressure setpoints to 3.5 bar.",
      "parts": ["Danfoss Pressure Switch KP35"],
      "cost_range": (2200, 5000),
      "downtime_range": (1.0, 2.5),
      "urgency": "P3"
    }
  ],
  "UPS": [
    {
      "complaint": "UPS panel alarm sounding, LCD displaying 'Battery Bank Voltage Low' during grid dip.",
      "symptoms": ["beeping alarm", "battery warning", "short backup time"],
      "cause": "Sulfated battery cells in battery rack 2 reducing total string voltage",
      "fix": "Tested individual cell internal impedance, replaced 4 defective 12V 42Ah VRLA batteries.",
      "parts": ["12V 42Ah VRLA AGM Battery (4 units)"],
      "cost_range": (14000, 32000),
      "downtime_range": (1.5, 3.5),
      "urgency": "P1"
    }
  ],
  "Projector": [
    {
      "complaint": "Auditorium projector shutting down after 10 minutes with flashing red TEMP light.",
      "symptoms": ["thermal shutdown", "red temp led", "exhaust fan failure"],
      "cause": "Clogged intake dust filters and stalled intake fan motor",
      "fix": "Cleaned foam air filter elements, replaced 12V DC cooling fan, reset lamp hour counter.",
      "parts": ["Epson Dust Filter Set", "12V Cooling Fan"],
      "cost_range": (1800, 4200),
      "downtime_range": (1.0, 2.0),
      "urgency": "P4"
    }
  ],
  "Electrical Panel": [
    {
      "complaint": "Burning plastic smell coming from 2nd floor main electrical distribution panel.",
      "symptoms": ["burning smell", "hot panel door", "buzzing busbar"],
      "cause": "High resistance loose busbar terminal lug causing extreme ohmic heating",
      "fix": "Performed thermal camera scan, isolated panel, cleaned oxidized busbar lugs, torqued terminal bolts to 22 Nm.",
      "parts": ["Terminal Busbar Lug", "Anti-Oxidant Paste"],
      "cost_range": (4500, 11000),
      "downtime_range": (2.0, 5.0),
      "urgency": "P1"
    }
  ]
}

# Typos & vague complaint additions
VAGUE_COMPLAINTS = [
  "machine making weird sound in room 102 plzz fix fast",
  "some smell near server room stairs",
  "AC not work properly blowing warmish air",
  "lift button stucking floor 3",
  "water coming out from under sink in lab"
]

def generate_dataset(num_records=250):
  records = []
  start_date = datetime.now() - timedelta(days=365)

  for i in range(1, num_records + 1):
    case_id = f"CASE-{i:03d}"
    
    # Plant Pattern 1: Building C AC condensate drain clog during monsoon (July-Sept)
    # Plant Pattern 2: Cummins Silent Power 250 fuel filter issues
    is_pattern_1 = (i % 7 == 0)
    is_pattern_2 = (i % 11 == 0)

    if is_pattern_1:
      equip_type = "AC"
      building = "Building C"
      floor = random.choice([1, 2, 3])
      model = "Daikin SkyAir 500"
      date_reported = datetime(2026, random.choice([7, 8, 9]), random.randint(1, 28), random.randint(8, 17))
      template = {
        "complaint": f"AC condensate drain overflow leaking water down hallway wall near room {floor}04.",
        "symptoms": ["water leakage", "clogged drain", "monsoon humidity overflow"],
        "cause": "Clogged condensate drain line due to algae buildup in high humidity",
        "fix": "Flushed condensate drain line with biocide tablet and pressurized nitrogen air wash.",
        "parts": ["Drain Clearer Tablets", "PVC Elbow"],
        "cost_range": (1800, 3200),
        "downtime_range": (1.0, 2.0),
        "urgency": "P2"
      }
    elif is_pattern_2:
      equip_type = "Generator"
      building = random.choice(BUILDINGS)
      floor = 0
      model = "Cummins Silent Power 250"
      date_reported = start_date + timedelta(days=random.randint(0, 350))
      template = {
        "complaint": f"Cummins Generator engine choking and losing power under load test.",
        "symptoms": ["engine choking", "fuel filter bypass", "rpm drop"],
        "cause": "Premature fuel filter clogging in Cummins Silent Power 250 model series",
        "fix": "Replaced fuel filter assembly with upgraded dual-stage spin-on filter housing.",
        "parts": ["Cummins Dual Fuel Filter Assembly"],
        "cost_range": (4200, 8500),
        "downtime_range": (2.0, 4.0),
        "urgency": "P2"
      }
    else:
      equip_type = random.choice(EQUIPMENT_TYPES)
      building = random.choice(BUILDINGS)
      floor = random.randint(0, 4)
      model = random.choice(EQUIPMENT_MODELS[equip_type])
      date_reported = start_date + timedelta(days=random.randint(0, 360), hours=random.randint(0, 23))

      templates = FAULT_TEMPLATES[equip_type]
      template = random.choice(templates)

    # Sprinkle occasional vague complaint / typos
    complaint_text = template["complaint"]
    if i % 15 == 0 and VAGUE_COMPLAINTS:
      complaint_text = random.choice(VAGUE_COMPLAINTS)

    cost = round(random.uniform(*template["cost_range"]), 2)
    downtime = round(random.uniform(*template["downtime_range"]), 1)

    record = {
      "case_id": case_id,
      "equipment_type": equip_type,
      "model": model,
      "building": building,
      "floor": floor,
      "complaint_text": complaint_text,
      "symptoms": template["symptoms"],
      "root_cause": template["cause"],
      "fix_applied": template["fix"],
      "parts_replaced": template["parts"],
      "cost_inr": cost,
      "downtime_hrs": downtime,
      "urgency": template["urgency"],
      "date_reported": date_reported.strftime("%Y-%m-%d %H:%M:%S"),
      "technician": random.choice(TECHNICIANS)
    }
    records.append(record)

  return records

def main():
  out_dir = os.path.join(os.path.dirname(__file__), "data")
  os.makedirs(out_dir, exist_ok=True)
  
  dataset = generate_dataset(250)
  out_file = os.path.join(out_dir, "synthetic_cases.json")
  
  with open(out_file, "w", encoding="utf-8") as f:
    json.dump(dataset, f, indent=2)

  print(f"[SUCCESS] Generated {len(dataset)} synthetic maintenance records in {out_file}")

if __name__ == "__main__":
  main()
