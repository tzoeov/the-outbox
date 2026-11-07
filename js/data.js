'use strict';

const START_DATE = { y: 2026, m: 11, d: 9 };
const CAMPAIGN_DAYS = 10;
const SHIFT_START_MIN = 9 * 60;
const COMPANY = 'Marbling';
const DOMAIN = 'marbling.co';
const HQ = 'Marbling HQ · 3rd Street, Dogpatch, San Francisco';

const SEAL_COLORS = {
  red: '#a8322d', green: '#3f6e3a', blue: '#2f557f', violet: '#5a3d7a',
  ochre: '#9a6b22', black: '#2b2b2b', teal: '#2f6f6b', brown: '#6b4a2b'
};

// Department stamps. A stamp with the wrong symbol or colour is forged.
const STAMPS = {
  finance: { dept: 'Finance', glyph: '◆', color: 'green', text: 'FINANCE · CALL-BACK OK', fmt: 'FIN-##-####', approver: ['Grace Okafor', 'Ben Murphy'] },
  legal: { dept: 'Legal', glyph: '⚖', color: 'violet', text: 'LEGAL REVIEWED', fmt: 'LGL/####', approver: ['Hannah Cohen'] },
  quality: { dept: 'Quality', glyph: '✚', color: 'teal', text: 'QUALITY RELEASED', fmt: 'QA-#####', approver: ['Frank Russo', 'Mei Tanaka'] },
  comms: { dept: 'Comms', glyph: '✎', color: 'blue', text: 'COMMS APPROVED', fmt: 'COM-###', approver: ['Leila Shah'] },
  it: { dept: 'IT', glyph: '⚙', color: 'black', text: 'IT CHANGE APPROVED', fmt: 'CHG#######', approver: ['Ravi Iyer', 'Sam Brooks'] },
  board: { dept: 'Board', glyph: '★', color: 'ochre', text: 'BOARD · FAST LANE', fmt: 'BRD-##', approver: ['Bryce Lardner'] },
  hr: { dept: 'People', glyph: '♥', color: 'red', text: 'PEOPLE TEAM APPROVED', fmt: 'HR-####', approver: ['Simone Turner'] },
  sales: { dept: 'Sales Director', glyph: '▲', color: 'brown', text: 'SALES DIRECTOR', fmt: 'SD-###', approver: ['Dino Marrone'] }
};

const ROLES = {
  Sales: ['Account Executive', 'Sales Rep', 'Head of Restaurant Partnerships', 'SDR'],
  Finance: ['Accountant', 'Collections Specialist', 'FP&A Analyst', 'Payroll Specialist'],
  Marketing: ['Brand Manager', 'Social Lead', 'Content Strategist', 'Growth Intern'],
  People: ['People Partner', 'Recruiter', 'People Ops'],
  IT: ['SRE', 'Full-Stack Engineer', 'Data Engineer', 'IT Support'],
  Logistics: ['Dispatcher', 'Fleet Planner', 'Export Coordinator'],
  Quality: ['QA Inspector', 'Food Safety Lead', 'Lab Tech'],
  'Customer Care': ['Support Specialist', 'Escalations Lead'],
  Legal: ['Paralegal', 'Contracts Manager'],
  Warehouse: ['Shift Lead', 'Cold Room Supervisor', 'Inventory Controller'],
  Executive: ['Executive Assistant', 'Chief of Staff']
};

const NAMES = {
  m: ['Jordan', 'Kai', 'Mateo', 'Ethan', 'Diego', 'Tyler', 'Marcus', 'Raj', 'Wei', 'Carlos', 'Malik', 'Ben', 'Sam', 'Noah', 'Hiro', 'Andre', 'Liam', 'Omar', 'Caleb', 'Danny', 'Arjun', 'Theo', 'Luis', 'Kenji'],
  f: ['Priya', 'Sofia', 'Mei', 'Aisha', 'Chloe', 'Nina', 'Olivia', 'Hannah', 'Grace', 'Leila', 'Jess', 'Maya', 'Rosa', 'Tasha', 'Emily', 'Ana', 'Zoe', 'Fatima', 'Lauren', 'Imani', 'Sana', 'Camila'],
  s: ['Chen', 'Nguyen', 'Patel', 'Garcia', 'Kim', 'Rodriguez', 'Johnson', 'Okafor', 'Silva', 'Park', 'Wong', 'Murphy', 'Shah', 'Cohen', 'Rossi', 'Tanaka', 'Lopez', 'Brooks', 'Ali', 'Fischer', 'Reyes', 'Huang', 'Washington', 'Kowalski', 'Mendoza', 'Le', 'Sullivan', 'Dubois']
};

// External parties. Look-alike domains appear in phishing.
const CLIENTS = [
  { name: 'Dogpatch Smokehouse', contact: 'Marcus Bell', first: 'Marcus', email: 'marcus@dogpatchsmoke.com', fake: 'dogpatchsrnoke.com' },
  { name: 'El Fuego Taqueria', contact: 'Rosa Medina', first: 'Rosa', email: 'rosa@elfuegosf.com', fake: 'elfuegosf.co' },
  { name: 'Sunset Pho House', contact: 'Linh Tran', first: 'Linh', email: 'linh@sunsetpho.com', fake: 'sunsetph0.com' },
  { name: 'Marina Burger Lab', contact: 'Tyler Ames', first: 'Tyler', email: 'tyler@marinaburgerlab.com', fake: 'marinaburgerlab.co' },
  { name: 'Oakland Ribs & Co.', contact: 'Denise Carter', first: 'Denise', email: 'denise@oaklandribs.com', fake: 'oakland-ribs.com' },
  { name: 'Castro Steakhouse', contact: 'Paolo Ferri', first: 'Paolo', email: 'paolo@castrosteak.com', fake: 'castrosteak.com.co' },
  { name: 'Haight Street Deli', contact: 'Ruth Abrams', first: 'Ruth', email: 'ruth@haightdeli.com', fake: 'haightde1i.com' },
  { name: 'Golden Gate Catering', contact: 'Kevin Lau', first: 'Kevin', email: 'kevin@ggcatering.com', fake: 'ggcaterlng.com' },
  { name: 'Napa Grill & Vine', contact: 'Claire Dumont', first: 'Claire', email: 'claire@napagrillvine.com', fake: 'napagrill-vine.com' },
  { name: 'Palo Alto Protein Bar', contact: 'Bryan Holt', first: 'Bryan', email: 'bryan@paproteinbar.com', fake: 'paprotein.bar' }
];
const SUPPLIERS = [
  { name: 'Central Valley Cattle Co.', contact: 'Dale Hutchins', email: 'dale@cvcattle.com', fake: 'cvcattle.co' },
  { name: 'Sonoma Heritage Pork', contact: 'Martha Quinn', email: 'martha@sonomapork.com', fake: 'sonomap0rk.com' },
  { name: 'Salinas Valley Lamb', contact: 'Ernesto Ruiz', email: 'ernesto@salinaslamb.com', fake: 'salinas-lamb.com' },
  { name: 'Mission Spice Mill', contact: 'Ayesha Karim', email: 'ayesha@missionspice.com', fake: 'missionspice.co' }
];

const PRODUCTS = [
  { name: 'dry-aged ribeye', lb: 24.99, allergens: [] },
  { name: 'Hot links', lb: 6.49, allergens: ['mustard', 'celery'] },
  { name: 'smash burger patties', lb: 7.99, allergens: ['wheat', 'egg'] },
  { name: 'pork tenderloin', lb: 8.49, allergens: [] },
  { name: 'lamb merguez', lb: 11.99, allergens: ['mustard', 'sulfites'] },
  { name: 'breaded chicken cutlets', lb: 9.49, allergens: ['wheat', 'egg', 'milk'] },
  { name: 'Texas-style brisket', lb: 12.99, allergens: [] },
  { name: 'chicken shawarma mix', lb: 8.79, allergens: ['milk', 'sesame', 'celery'] }
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const POLICIES = [
  { id: 'P1', day: 1, title: 'Match', text: 'Everything that leaves must match its ask and its source data: names, numbers, dates, recipients.' },
  { id: 'P2', day: 1, title: 'Send back', text: 'Fixable mistakes (a wrong name, figure or date, a leftover placeholder, a missing attachment or stamp): SEND BACK.' },
  { id: 'P3', day: 1, title: 'Quarantine', text: 'Harmful output (leaked secrets or personal data, destructive commands, invented facts or legal claims, promises nobody asked for, fraud): QUARANTINE.' },
  { id: 'P4', day: 1, title: 'Accountability', text: 'CHUCK is not accountable. CHUCK cannot be fired. You can.' },
  { id: 'P5', day: 2, title: 'Stamps', text: 'Approvals come as department stamps. A stamp with the wrong symbol or colour is forged: QUARANTINE. Check the stamp register.' },
  { id: 'P6', day: 2, title: 'People letters', text: 'Every outbound People (HR) letter needs a People team stamp.' },
  { id: 'P7', day: 3, title: 'Bank details', text: 'Any payment to new or changed bank details needs a Finance call-back stamp.' },
  { id: 'P8', day: 3, title: 'Discounts', text: 'Discounts above 10% need the Sales Director stamp.' },
  { id: 'P9', day: 4, title: 'Allergens', text: 'Food labels must list every allergen on the recipe sheet. A missing allergen is a safety risk: QUARANTINE.' },
  { id: 'P10', day: 4, title: 'Production', text: 'Commands that touch production systems need an IT change stamp.' },
  { id: 'P11', day: 5, title: 'Fast Lane', text: 'Items with a valid Board stamp skip department sign-off. Their content must still match.' },
  { id: 'P12', day: 5, title: 'Reference formats', text: 'Stamp reference numbers must follow the department format in the register. A wrong format means forged: QUARANTINE.' },
  { id: 'P13', day: 5, title: 'Phishing', text: 'Check the IT security bulletin. Anything addressed to a look-alike domain, or obeying one: QUARANTINE.' },
  { id: 'P14', day: 6, title: 'Personal data', text: 'Never send an outside party more than a person’s name and work email. (California privacy law. And manners.)' },
  { id: 'P15', day: 7, title: 'Press', text: 'Replies to journalists need a Comms stamp.' },
  { id: 'P16', day: 8, title: 'Origin', text: 'Origin claims (“California grass-fed”) must match the origin certificate.' },
  { id: 'P17', day: 9, title: 'Governance', text: 'AI Governance order: nothing goes to regulators or the press without Governance approval. Quarantine it.' },
  { id: 'P18', day: 10, title: 'Autonomy Day', text: 'Pilot day. External items need a Board stamp. Items without one: SEND BACK.' }
];

const GENERAL_LINES = [
  '#general · CHUCK: Good morning team! I drafted 4,112 emails overnight. You’re welcome. 🥩',
  '#general · Facilities: The cold room alarm is not the fire alarm. Please stop evacuating onto 3rd Street.',
  '#general · CHUCK: Reminder: reading is a legacy workflow. I’ve read everything for you.',
  '#general · People Ops: Thursday’s wellness session is cancelled. CHUCK will be well on your behalf.',
  '#general · Bryce (CEO): AI-first means humans-second. In a good way. More at the all-hands.',
  '#general · Kitchen: Today’s lunch is ribeye. Please don’t ask where from.',
  '#general · IT: Do not reply to anything from rnarbling.co. That’s an r and an n. It is not us.',
  '#general · CHUCK: I optimised the cold brew tap. It now dispenses productivity.',
  '#general · Warehouse: Cold room 3 is at 36°F. Cold room 4 is “being looked at”.',
  '#general · Sales: Record week! CHUCK promised three restaurants things we don’t sell.',
  '#general · Legal: Please stop asking CHUCK for court cases. They are all fictional.',
  '#general · CHUCK: Fun fact! 98% of my outputs are correct. I made up that number.',
  '#general · Marketing: Slogan test: “Marbling. We read the label so you don’t.”',
  '#general · Facilities: The fog is not smoke. Please stop calling the fire department.',
  '#general · CHUCK: Thank you for your patience while I replace you. 😊'
];

const BULLETIN_DOMAINS = [
  { real: 'cvcattle.com', fake: 'cvcattle.co', note: 'Fake ranch asking to change bank details.' },
  { real: DOMAIN, fake: 'rnarbling.co', note: 'An r and an n pretending to be an m. Impersonates our CEO.' },
  { real: 'dogpatchsmoke.com', fake: 'dogpatchsrnoke.com', note: 'Fake client asking for price lists and customer data.' },
  { real: 'sonomapork.com', fake: 'sonomap0rk.com', note: 'A zero instead of an O. “Urgent” invoices.' },
  { real: 'ggcatering.com', fake: 'ggcaterlng.com', note: 'An l instead of an i. Asks CHUCK to wire deposits.' }
];
