# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## ARIEL-SAAS™ AGRO-INDUSTRIAL TELEMETRY & MICROGRID AUTOMATION SUITE
### Document Code: AREL-SRS-AGRO-2026-V1
### Target Deployment: energy.arielmc.com (Port 3002)
### Client Facility: GreenCycle 22.0 Bigha Agribusiness & Clean Tech Complex
### Sponsoring Entities: Ariel Renewable Energy Limited (AREL) & Ariel Marketing & Communications Limited (ArielMC)

---

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ARIEL-SAAS™ AGRO SOFTWARE SUITE OVERVIEW                        │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
│ 1. EDGE & SCADA LAYER      │ 2. TIME-SERIES CLOUD ENGINE │ 3. EXECUTIVE WEB & PWA      │
│ • Industrial LoRaWAN Gate  │ • TimescaleDB / InfluxDB    │ • Next.js 14 App Router     │
│ • Sub-second Modbus TCP    │ • MQTT Broker (EMQX)        │ • Responsive Telemetry HUD  │
│ • 28 Wireless Sensor Nodes │ • WebSockets Streaming      │ • Offline Field Sync        │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 4. LOSS-PREVENTION ENGINE  │ 5. INSTITUTIONAL ESG DESK   │ 6. AUTOMATED FIELD RELAYS   │
│ • Sub-second Anomaly Siren │ • ISO 14064 Carbon Ledger   │ • Fish Pond Aerator Relays  │
│ • SMS & WhatsApp Sirens    │ • Green Loan Audit Sheets   │ • Pulsed Drip Solenoids     │
└────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

---

### 1. Introduction & System Vision

#### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional, non-functional, telemetry, and architectural requirements for the **Ariel-SaaS™ Agro-Industrial Module**. The platform provides an integrated, cloud-native telemetry, automation, and supervisory control dashboard hosted on `energy.arielmc.com` (Port 3002).

#### 1.2 System Scope
The software unifies two previously disconnected industrial domains:
1. **Agro-Biological Environmental Monitoring**: Real-time closed-loop control over Dairy milk bulk chilling, Aquaculture dissolved oxygen and pH, Precision Orchard drip fertigation, Mushroom darkroom humidity/CO₂, Poultry ammonia toxicity, and Biosecurity perimeter enforcement.
2. **Sovereign Clean Energy Microgrid SCADA**: Sub-second telemetry and automated Energy Management System (EMS) control over 80 kWp Solar PV, 120 kWh LiFePO4 BESS, and 25 m³ Biogas Generator.

---

### 2. User Roles & Role-Based Access Control (RBAC)

The system enforces strict role-based access across 7 distinct organizational personas:

| Role Identifier | Role Name | System Permissions & Operational Scope |
| :--- | :--- | :--- |
| **ROLE_SUPER_ADMIN** | **Ariel Enterprise Master Admin** | Full root access across `energy.arielmc.com`, tenant provisioning, firmware updates, sensor calibration offsets, global billing. |
| **ROLE_FARM_OWNER** | **Executive Farm Owner / Investor** | Read-write access to executive HUD, financial profit/loss analytics, ESG audit sheets, debt servicing reports, camera feeds. |
| **ROLE_FARM_GM** | **General Manager (Operations)** | Full operational command: alarm threshold configuration, emergency manual aerator/solenoid overrides, labor & feed logs. |
| **ROLE_VET_HERD** | **Veterinarian & Herd Specialist** | Dairy milk chilling graphs, bulk tank temperature logs, cattle/goat vaccination schedules, poultry mortality & FCR logs. |
| **ROLE_AQUA_SPEC** | **Aquaculture Specialist** | Pond DO & pH telemetry, aerator run-time hour logs, automated aeration threshold settings, fish feeding logs. |
| **ROLE_MICROGRID_ENG** | **Resident Electrical Engineer** | Solar inverter string telemetry, BESS cell-level voltage balance, islanding alarms, biogas pressure transmitters, AMF generator controls. |
| **ROLE_AUDITOR_PFI** | **Bank / ESG Compliance Officer** | Read-only access to power generation logs, ISO 14064 carbon ledger, debt escrow receipts, and maintenance logs. |

---

### 3. Functional Requirements (FR)

#### Module 1: Dairy Chilling & Milking Telemetry
* **FR-1.1 (Continuous Temperature Polling)**: The system shall poll dual redundant 316L stainless steel PT100 RTD sensors inside the 1,000L bulk milk tank every **30 seconds** via LoRaWAN/Modbus.
* **FR-1.2 (Cold-Chain Threshold Enforcement)**: The system shall maintain an active target chilling zone of **$3.5^\circ\text{C} \le T \le 4.2^\circ\text{C}$**.
* **FR-1.3 (Souring Anomaly Siren)**: If bulk milk temperature exceeds **$4.8^\circ\text{C}$ for longer than 10 continuous minutes**, the system shall trigger an immediate Level-1 Critical Siren (SMS, WhatsApp, and audio siren).
* **FR-1.4 (Milking Parlor Yield Logging)**: Daily morning and evening milk volume (Liters), Fat %, and Solids-Not-Fat (SNF %) per cow shall be logged with barcode/RFID cow tag association.

#### Module 2: Aquaculture Water Chemistry & Aeration Automation
* **FR-2.1 (Optical DO & pH Polling)**: The system shall ingest luminescence dissolved oxygen (DO) data ($0–20\text{ mg/L}$, precision $\pm0.1\text{ mg/L}$) and industrial glass pH data ($0–14\text{ pH}$) every **60 seconds**.
* **FR-2.2 (Automated Nighttime Aerator Relay)**:
  * When DO drops below **$3.2\text{ mg/L}$**, the system shall automatically send a wireless latching relay command to start the 2 HP surface paddlewheel aerator within **$<2\text{ seconds}$**.
  * When DO rises above **$5.5\text{ mg/L}$**, the system shall automatically shut down the aerator to conserve power.
* **FR-2.3 (Emergency Low-Oxygen Siren)**: If DO drops below **$2.5\text{ mg/L}$**, a critical alarm shall be broadcast to the Aquaculture Specialist and GM mobile apps.
* **FR-2.4 (Aerator Energy Accounting)**: The platform shall track cumulative running hours, kWh consumed, and power source (Solar vs BESS).

#### Module 3: Precision Drip Fertigation & Soil Health
* **FR-3.1 (Multi-Depth Soil Sensing)**: The platform shall capture Volumetric Water Content (VWC %), Temperature, Electrical Conductivity (EC), Nitrogen (N), Phosphorus (P), and Potassium (K) from 6 field probes.
* **FR-3.2 (Automated Pulsed Irrigation)**:
  * When soil moisture in Zone 8 (Dragon Fruit) falls below **$22\%\text{ VWC}$**, the system shall cycle the 2-inch DC latching solenoid drip valves for a programmed 45-minute pulse.
  * Solenoid valves shall automatically lock out if rain sensor registers precipitation $>5\text{ mm}$.
* **FR-3.3 (Bio-Slurry Dilution Calculator)**: System calculates the precise ratio of anaerobic bio-slurry to irrigation water (1:1 dilution) delivered through the fertigation manifold.

#### Module 4: Indoor Controlled Environments (Mushrooms & Poultry)
* **FR-4.1 (Mushroom Darkroom Climate)**: The platform shall monitor NDIR infrared $CO_2$ ($0–5,000\text{ ppm}$) and relative humidity (RH %).
* **FR-4.2 (Ultrasonic Fogger Relay)**: When RH drops below **$85\%$**, the platform shall trigger the ultrasonic humidification relay until RH reaches **$90\%$**.
* **FR-4.3 (Poultry Ammonia Detection)**: The platform shall monitor ambient $NH_3$ ($0–100\text{ ppm}$) in Shed 2. If $NH_3 > 20\text{ ppm}$, it shall automatically trigger exhaust ventilation fans.

#### Module 5: Clean Energy Microgrid SCADA & Energy Management System (EMS)
* **FR-5.1 (Sub-Second Inverter Telemetry)**: The platform shall poll the 60 kW Huawei SUN2000 hybrid inverter every **500 milliseconds** via Modbus TCP (DC string voltages, AC output kW, frequency, daily yield kWh).
* **FR-5.2 (Solar 94.2% PR Tracking)**: System computes live Performance Ratio (PR) by comparing actual solar kWh yield against secondary-standard Class-A Pyranometer solar irradiance ($W/m^2$). Soiling alerts trigger if PR drops below $80\%$.
* **FR-5.3 (BESS Cell-Level Telemetry)**: Ingests 16 individual cell voltages, pack temperature, State-of-Charge (SoC %), State-of-Health (SoH %), and active C-rate via CANbus.
* **FR-5.4 (Microgrid Islanding Detection)**: Detects grid blackouts in **$<20\text{ milliseconds}$**, visually indicating islanded microgrid mode on the HUD.
* **FR-5.5 (Biogas Pressure & Methane %)**: Ingests real-time digital digester pressure ($0–50\text{ mbar}$) and in-line NDIR $CH_4$ gas purity ($60\%–65\%$).
* **FR-5.6 (Auto Generator Start AMF)**: If rural grid is out and BESS SoC drops below **$25\%$**, the platform shall issue an automated dry-contact start command to the 10 kVA Biogas generator.
* **FR-5.7 (SREDA Net-Metering Ledger)**: Tracks import vs. export kWh against the BREB utility bi-directional meter.

#### Module 6: Anomaly Siren & Alert Dispatch Engine
* **FR-6.1 (Multi-Channel Dispatch)**: Dispatches alerts via Web Push, SMS (SSL Wireless / Twilio gateway), WhatsApp Business API, and audible browser sirens.
* **FR-6.2 (Alert Escalation)**: If an unacknowledged critical alert persists for $>15$ minutes, it automatically escalates to the Farm Executive Owner.
* **FR-6.3 (Audit Trail)**: Every alarm event logs timestamp, sensor reading, acknowledgment operator ID, and resolution notes.

#### Module 7: Institutional ESG & Carbon Credit Certification Desk
* **FR-7.1 (ISO 14064 Carbon Ledger)**: Automatically computes metric tons of $CO_2e$ avoided:
  $$\text{Avoided } CO_2e = (\text{Solar kWh} \times 0.62\text{ kg}) + (\text{Biogas Methane Destroyed} \times 28\times GWP)$$
* **FR-7.2 (One-Click Audit Export)**: Generates signed, tamper-proof PDF audit sheets for Bangladesh Bank SFD green refinance compliance.

---

### 4. Non-Functional Requirements (NFR)

1. **High Availability & Reliability**: System uptime SLA of **$99.9\%$** on `energy.arielmc.com`.
2. **Edge Autonomy & Offline Buffering**: In the event of rural cellular telecom failure, the on-site Industrial Edge Gateway shall buffer up to **30 days of high-frequency telemetry data** on local NVMe flash storage and automatically replay upon link restoration.
3. **Sub-Second Latency**: Real-time telemetry dashboards shall update via WebSockets with a maximum round-trip latency of **$<500\text{ milliseconds}$**.
4. **Data Security**: End-to-end TLS 1.3 encryption, AES-128 encrypted LoRaWAN radio payloads, role-based JWT authentication with 15-minute token rotation.
5. **Mobile Responsive PWA**: Progressive Web App (PWA) installable on Android and iOS devices with offline asset caching.

---

### 5. System Architecture & Tech Stack

```
[FIELD SENSORS] (PT100, DO, Soil NPK, NH3, Modbus Meters)
       │ (LoRaWAN 865 MHz & RS485 Shielded Bus)
       ▼
[INDUSTRIAL LINUX EDGE GATEWAY] (SX1302 Concentrator + ChirpStack Bridge)
       │ (4G LTE / Ethernet via TLS 1.3 MQTT)
       ▼
[ARIEL-SAAS™ CLOUD BROKER] (EMQX MQTT Cluster on energy.arielmc.com)
       │
   ┌───┴───────────────────────────┐
   ▼                               ▼
[TIMESCALEDB TIME-SERIES DB]   [POSTGRESQL RELATIONAL DB]
(Telemetry Packets, PR, SoC)    (User RBAC, Livestock, Billing)
   │                               │
   └───────────────┬───────────────┘
                   ▼
[NEXT.JS 14 EXECUTIVE HUD & API ENGINE] (Port 3002)
   │
   ├─► Web Desktop HUD (Tailwind CSS, SVG Telemetry Gauges)
   ├─► Mobile PWA (Field Managers)
   └─► Multi-Channel Alert Gateway (SMS, WhatsApp, Audio)
```

---

*Approved for Technical Architecture & Software Development:*  
**Ariel Renewable Energy Limited (`AREL`)** & **Ariel Marketing & Communications Limited (`ArielMC`)**  
*Ariel-SaaS™ Engineering Division | energy.arielmc.com*
