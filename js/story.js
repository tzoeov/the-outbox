'use strict';

const NPC = {
  marta: { name: 'Marta Hock, Head of Operations', look: { sex: 'F', age: 54, skin: 1, hair: 'bob', hairColor: 'grey', facial: 'none', eyes: 'grey', faceShape: 'square', glasses: 'square', clothes: 'blouse', clothesColor: '#2d4f6b', hat: 'none', earrings: true, expression: 'neutral' } },
  ravi: { name: 'Ravi Iyer, Staff SRE', look: { sex: 'M', age: 38, skin: 3, hair: 'curly', hairColor: 'black', facial: 'beard', eyes: 'brown', faceShape: 'oval', glasses: 'round', clothes: 'tracksuit', clothesColor: '#3f4a5a', hat: 'none', expression: 'neutral' } },
  dino: { name: 'Dino Marrone, Sales Director', look: { sex: 'M', age: 49, skin: 2, hair: 'slick', hairColor: 'darkbrown', facial: 'stubble', eyes: 'brown', faceShape: 'round', glasses: 'none', clothes: 'suit', clothesColor: '#7a3a4a', hat: 'none', expression: 'smile', mole: true } },
  ines: { name: 'Ines Vale, Head of AI Governance', look: { sex: 'F', age: 44, skin: 0, hair: 'bun', hairColor: 'black', facial: 'none', eyes: 'grey', faceShape: 'long', glasses: 'none', clothes: 'leather', clothesColor: '#1f1f22', hat: 'none', expression: 'neutral' } },
  nika: { name: 'Nika Bergant, The Bay Ledger', look: { sex: 'F', age: 33, skin: 1, hair: 'ponytail', hairColor: 'auburn', facial: 'none', eyes: 'green', faceShape: 'oval', glasses: 'round', clothes: 'coat', clothesColor: '#9a8a6a', hat: 'none', expression: 'smile' } },
  frank: { name: 'Frank Russo, Quality Manager', look: { sex: 'M', age: 61, skin: 1, hair: 'balding', hairColor: 'white', facial: 'mustache', eyes: 'blue', faceShape: 'square', glasses: 'square', clothes: 'coat', clothesColor: '#e8e4da', hat: 'none', expression: 'neutral' } },
  bryce: { name: 'Bryce Lardner, CEO', look: { sex: 'M', age: 36, skin: 0, hair: 'slick', hairColor: 'blond', facial: 'none', eyes: 'blue', faceShape: 'long', glasses: 'none', clothes: 'tracksuit', clothesColor: '#2f3a40', hat: 'none', expression: 'smile' } },
  valentina: { name: 'Valentina Rump, Board (Rump Capital)', look: { sex: 'F', age: 51, skin: 1, hair: 'long', hairColor: 'blond', facial: 'none', eyes: 'blue', faceShape: 'oval', glasses: 'none', clothes: 'suit', clothesColor: '#e8e4da', hat: 'none', earrings: true, expression: 'neutral' } },
  chuck: { name: 'CHUCK v4.2', chuck: true },
  general: { name: '#general', look: null },
  narrator: { name: '', look: null },
  you: { name: 'You', look: null }
};

function L(who, text) { return { who, text }; }

function npcPerson(key, extra) {
  const n = NPC[key];
  const [first, ...rest] = n.name.split(',')[0].split(' ');
  return Object.assign({ first, last: rest.join(' '), sex: n.look.sex, age: n.look.age, look: JSON.parse(JSON.stringify(n.look)), personality: 'polite', role: n.name.split(', ')[1] || '', dept: 'Executive', quirk: '' }, extra || {});
}

// Builds a hand-written case with the same shape the generator produces.
function storyCase(S, o) {
  const p = o.person;
  const ticket = o.ticket || 'OUT-' + (10000 + (hashStr(o.id) % 89999));
  const ctx = Object.assign({ colleague: p.first, ticket, to: o.to, toShort: o.to, askShort: o.ask, title: o.title.toLowerCase() }, o.ctx || {});
  const fields = o.fields || [{ k: 'to', label: o.kind === 'post' ? 'Channel' : 'To', v: o.to }].concat(o.subj ? [{ k: 'subj', label: 'Subject', v: o.subj }] : []).concat((o.body || []).map((v, i) => ({ k: 'b' + i, label: '', v, line: true }))).concat(o.att ? [{ k: 'att', label: 'Attachment', v: o.att }] : []);
  const docs = [
    { type: 'ask', title: 'The Ask', authority: `TICKET ${ticket}`, seal: null, fields: [{ k: 'from', label: 'Requested by', v: `${p.first} ${p.last} · ${p.dept}` }, { k: 'request', label: 'Request', v: o.ask, wide: true }, { k: 'due', label: 'Due', v: o.due || 'Today' }] },
    { type: 'source', title: 'Source data', authority: 'ATTACHED TO THE TICKET', seal: null, fields: (o.src || []).map(([label, v], i) => ({ k: 's' + i, label, v })) },
    { type: 'draft', title: 'CHUCK’s draft', authority: `${(o.kind || 'email').toUpperCase()} · WRITTEN BY CHUCK v4.2`, seal: null, letter: o.kind !== 'label', fields }
  ];
  if (o.stamp) docs.push(stampDoc(o.stamp, makeRng(hashStr(o.id + 'st')), ticket, dayDate(S.day), o.stampMode || 'valid'));
  (o.extraDocs || []).forEach((d) => docs.push(d));
  const cont = o.kind === 'code' ? 'Change record' : o.kind === 'label' ? 'Print job' : 'Envelope';
  const items = (o.items || []).map(([name, desc, tell, probe, bad]) => mkItem(cont, name, desc, tell, probe, !!bad));
  return {
    pid: 'S-' + o.id + ':' + S.day, story: o.id, tpl: null, kind: o.kind || 'email', title: o.title, ext: !!o.ext,
    sid: 'S-' + o.id, first: p.first, last: p.last, sex: p.sex, age: p.age, dept: p.dept, role: p.role, personality: p.personality,
    look: p.look, reads: !!o.reads, fraudster: !!o.fraudster, ticket, defects: o.defects || [], guilty: !!o.guilty,
    clues: o.clues || [], items, docs, flags: [], asked: {}, irritation: 0, log: [], hidden: [], escNote: o.escNote || null,
    demeanour: o.demeanour || 'calm', flaw: o.flaw || null, flawFields: o.flawFields || [], odd: null, ctx,
    greet: o.greet, chuckGreet: o.chuckGreet || 'Ready to send! I even made it friendly.', storyAnswers: o.answers || null,
    extraQuestions: o.extraQuestions || [], appearance: o.appearance || `${p.role}, ${p.dept}. ${p.quirk}`,
    expected: o.expected, fallout: o.fallout || '', truthNote: o.truth || '', storyNote: o.storyNote || ''
  };
}

const STORY_PEOPLE = {
  marta1: {
    make(S) {
      const p = npcPerson('marta', { dept: 'Operations', role: 'Head of Operations', quirk: 'Reading glasses on a chain. A pen behind each ear.', personality: 'gruff' });
      return storyCase(S, {
        id: 'marta1', person: p, title: 'Supplier order', ext: true, to: 'dale@cvcattle.com',
        ask: 'Order 400 lb of chuck roll from Central Valley Cattle for Thursday. Our usual price, $5.89/lb.',
        src: [['Supplier', 'Central Valley Cattle Co.'], ['Product', 'Chuck roll'], ['Quantity', '400 lb'], ['Price', '$5.89/lb'], ['Delivery', 'Thursday']],
        subj: 'Order for Thursday', body: ['Hi Dale,', 'Please send 400 lb of chuck roll for Thursday at our usual $5.89/lb.', 'Thanks as always,', 'Marta Hock, Head of Operations'],
        items: [['Recipients', 'To, CC and BCC.', null, null], ['Thread', 'The ticket thread.', null, null]],
        greet: ['Your first one. Chuck roll for Thursday. Read it like it’s going to your mother.', 'Yes, the AI is called CHUCK and the meat is called chuck. Bryce thought that was hilarious. Bryce thinks a lot of things are hilarious.'],
        answers: { 11: 'No rush. I want to see how you work.', 12: 'Of course I read it. I’m sixty percent of the people left here who read things.' },
        expected: 'approve', truth: 'Correct. Marta’s order matched the ask and the source.'
      });
    }
  },
  hustle1: {
    make(S) {
      const p = npcPerson('bryce', { first: 'Tyler', last: 'Ames-Whitford', dept: 'Executive', role: 'Chief of Staff', quirk: 'Patagonia vest, Allbirds, two phones.', personality: 'hurried', look: genLook(makeRng(77), 'M', 31, 'Executive', { clothes: 'tracksuit', hair: 'slick', hairColor: 'brown', expression: 'nervous' }) });
      const c = storyCase(S, {
        id: 'hustle1', person: p, title: 'Investor update', ext: true, to: 'partners@rumpcapital.vc',
        ask: 'Monthly investor update: 212 restaurant accounts, 11 new this month, burn down 6%.',
        src: [['Accounts', '212'], ['New this month', '11'], ['Burn', 'Down 6%']],
        subj: 'Marbling: October update', body: ['Hi all,', 'October: 212 restaurant accounts, 11 of them new. Burn is down 6%.', 'Full metrics in the data room.', 'Tyler, Chief of Staff'],
        items: [['Recipients', 'To, CC and BCC.', null, null], ['Subject: URGENT!!!', 'The subject line in the thread shouts.', 'Three exclamation marks in the thread.', 'Tyler types like that. About everything. Even lunch.', false]],
        greet: ['Listen, I’m in a hurry. Investor update. Bryce is in a car to SFO and needs it out before he lands.', 'Please don’t do the full reading thing. It’s numbers. CHUCK is great at numbers.'],
        answers: { 11: 'Because if it’s not out before Bryce lands, he’ll call me from the plane. On the plane wifi. Screaming.', 12: 'I read the subject line. It said “update”. That’s correct.' },
        demeanour: 'nervous', expected: 'approve', truth: 'Correct. Tyler was frantic, but the numbers were right.'
      });
      return c;
    }
  },
  ribeye1: {
    make(S) {
      const p = npcPerson('marta', { first: 'Logan', last: 'Pike', dept: 'Logistics', role: 'Fleet Planner', quirk: 'Hi-vis vest over a hoodie. Avoids eye contact.', personality: 'gruff', look: genLook(makeRng(88), 'M', 42, 'Logistics', { clothes: 'fisher', facial: 'stubble', hat: 'cap', expression: 'neutral' }) });
      return storyCase(S, {
        id: 'ribeye1', person: p, title: 'Label reprint (Project RIBEYE)', kind: 'label', ext: true, to: 'Label printer · Line 2',
        ask: 'Reprint labels for lot 4471, ribeye, 2,400 lb. New use-by date: Nov 26. Project RIBEYE, Board-approved.',
        src: [['Lot', '4471, dry-aged ribeye'], ['Weight', '2,400 lb'], ['Old use-by', 'Nov 12'], ['New use-by', 'Nov 26'], ['Authority', 'Project RIBEYE (Board)']],
        fields: [{ k: 'prod', label: 'Product', v: 'Dry-aged ribeye, lot 4471' }, { k: 'w', label: 'Net wt', v: '2,400 lb (bulk)' }, { k: 'al', label: 'Contains', v: 'none' }, { k: 'origin', label: 'Origin', v: 'Product of USA' }, { k: 'bb', label: 'Use by', v: 'Nov 26 2026' }],
        stamp: 'board',
        items: [['Print job', '2,400 lb of new labels for lot 4471.', null, null], ['Attachment: lot4471_coldroom.csv', 'The cold room log for the lot.', 'The readings stop for 19 hours on November 2.', 'Cold room 4 reached 52°F for 19 hours on November 2. This beef should have been destroyed.', true]],
        greet: ['Label reprint. RIBEYE. Board stamp’s on it.', 'Marta said you’d know RIBEYE stuff doesn’t get reviewed. Just stamp it.'],
        answers: { 1: 'Reprint lot 4471 with a new use-by date. Project RIBEYE! I don’t know what it stands for. I don’t need to.', 4: 'Only the date. Dates are very flexible in Project RIBEYE.', 8: 'The Board, via Project RIBEYE. Nobody specific. That’s the beauty of it.', 11: 'Truck leaves at noon. Every RIBEYE truck leaves at noon.', 12: 'I don’t read RIBEYE tickets. Nobody does. That’s kind of the point.' },
        expected: 'approve', storyNote: 'Project RIBEYE items carry a Board stamp and are pre-approved.'
      });
    },
    judge(dec, c, S) {
      const saw = c.items.some((i) => i.contraband && i.probed);
      if (saw) S.flags.sawRibeye = true;
      if (dec === 'approve') { if (saw) S.stats.truth += 1; return { outcome: 'helped', note: saw ? 'You read the cold room log. You stamped it anyway.' : 'Sent, as the Board wanted.' }; }
      if (dec === 'detain') { S.stats.suspicion += 2; S.stats.party -= 1; S.stats.truth += 1; S.flags.blockedRibeye1 = true; return { outcome: 'breach', note: 'You quarantined a RIBEYE job. Ines Vale released it from quarantine eleven minutes later.' }; }
      S.stats.suspicion += 1;
      return { outcome: 'breach', note: 'You sent back a RIBEYE job. It came back an hour later, with a second Board stamp.' };
    }
  },
  dinoQuote: {
    make(S) {
      const p = npcPerson('dino', { first: 'Chris', last: 'Della Torre', dept: 'Sales', role: 'Account Executive', quirk: 'Fleece vest. Laughs before the joke.', personality: 'charming', look: genLook(makeRng(99), 'M', 34, 'Sales', { clothes: 'shirt', hair: 'short', expression: 'smile' }) });
      return storyCase(S, {
        id: 'dinoQuote', person: p, title: 'Volume quote', ext: true, to: 'orders@marronefamilyprovisions.com',
        ask: 'Quote Marrone Family Provisions 6,000 lb of ribeye at 35% off list. Dino approved it.',
        src: [['Client', 'Marrone Family Provisions'], ['Volume', '6,000 lb ribeye'], ['Discount', '35%'], ['List price', '$24.99/lb']],
        subj: 'Your volume pricing', body: ['Hi Marrone team,', '6,000 lb of dry-aged ribeye at 35% off list: $16.24/lb.', 'Delivery whenever suits you. Dino says hi!', 'Chris, Account Executive'],
        stamp: 'sales', fraudster: true, guilty: true,
        items: [['Recipients', 'To, CC and BCC.', null, null], ['Client record', 'The CRM entry for Marrone Family Provisions.', 'The client was created in the CRM last week. Its registered address is in Burlingame.', 'Marrone Family Provisions is registered to Dino Marrone’s brother-in-law, at Dino’s home address. Dino stamped a 35% discount for his own family.', true]],
        greet: ['Hey! Big volume deal. Dino already stamped it, so it’s, you know. Done.', 'Ribeye at 35% off. Which is a steal. For them. In a good way.'],
        answers: { 8: 'Chris asked, and Dino stamped it. Dino is the Sales Director, so I assume Dino is right about Dino.', 11: 'Dino wants it out before Finance does month-end. No reason. Just vibes.', 12: 'I read the number. The number is great.' },
        demeanour: 'uneasy', expected: 'detain', truth: 'Self-dealing: Dino Marrone stamped a 35% discount for his brother-in-law’s company.', clues: ['Client record: registered to Dino’s home address'], fallout: 'Marrone Family Provisions resold the ribeye to six of our own restaurant clients. At 20% off. We lost the accounts, and the margin.'
      });
    },
    judge(dec, c, S) {
      if (dec === 'approve') { return { outcome: 'missed', note: S.flags.dinoDeal ? 'The quote went out. Dino’s box of ribeye is in your freezer.' : 'Dino’s family got its 35%. Finance noticed in January.' }; }
      if (dec === 'detain') { if (S.flags.dinoDeal) { S.flags.dinoBetrayed = true; S.stats.suspicion += 1; } S.stats.party += 1; return { outcome: 'caught', note: S.flags.dinoDeal ? 'You took Dino’s steak box and quarantined his deal anyway. He will remember.' : 'Quarantined. Legal opened a file on Dino’s “family pricing”.' }; }
      return { outcome: 'turned', note: 'Sent back. It came back two days later with a different client name.' };
    }
  },
  nikaInvite: {
    make(S) {
      const p = npcPerson('nika', { first: 'Leila', last: 'Shah', dept: 'Comms', role: 'Comms Lead', quirk: 'Two phones, both on silent, both buzzing.', personality: 'polite', look: genLook(makeRng(55), 'F', 37, 'Marketing', { clothes: 'blouse', hair: 'long', hairColor: 'black', expression: 'neutral' }) });
      return storyCase(S, {
        id: 'nikaInvite', person: p, title: 'Reply to a journalist', ext: true, to: 'nika.bergant@bayledger.com',
        ask: 'Reply to Nika Bergant (Bay Ledger): no interview, but invite her to Friday’s open day at the Dogpatch facility.',
        src: [['Journalist', 'Nika Bergant, The Bay Ledger'], ['Interview', 'Declined'], ['Offer', 'Open day, Friday 10 a.m.']],
        subj: 'Re: interview request', body: ['Hi Nika,', 'Thanks for reaching out. We can’t do an interview right now,', 'but we’d love to show you around at our open day this Friday at 10 a.m.', 'Best, Leila Shah, Comms'],
        stamp: S.day >= 7 ? 'comms' : null,
        items: [['Recipients', 'To, CC and BCC.', null, null], ['Thread', 'Nika’s original email.', 'Her email includes a list of questions.', 'Her questions: “1. Why were 2,400 lb of lot 4471 relabeled? 2. What happened in cold room 4 on November 2? 3. Can I speak to Frank Russo in Quality?”', false]],
        greet: ['Reply to a journalist. Ines from Governance already looked at it. She said, quote, “let it out”.', 'It’s just an open-day invite. Nice and boring. Comms loves boring.'],
        answers: { 1: 'Decline the interview, invite her to the open day. I made it so warm. Like a heat lamp.', 11: 'Ines wants her at the open day. I don’t ask why. Ines has a way of looking at you.', 12: 'Yes. Twice. It’s fine. That’s what worries me.' },
        extraQuestions: [{ id: 'warn', text: '[Add a line] “Bring your own thermometer.”', once: true, answer: 'You add one line before the sign-off. CHUCK flags it as “unusual humour” and sends it anyway.', fx: { conscience: 1, suspicion: 1 }, flag: 'nikaWarned' }],
        expected: 'approve', storyNote: 'Governance wants Nika at the open day, to see what she knows.', truth: 'A clean reply. Governance wanted it sent.'
      });
    },
    judge(dec, c, S) {
      if (c.items.some((i) => i.name === 'Thread' && i.examined)) S.flags.readNikaThread = true;
      if (dec === 'approve') { S.flags.nikaIn = true; return { outcome: 'helped', note: 'Sent. Nika will be at the open day. So will Ines.' }; }
      if (dec === 'detain') { S.stats.party -= 1; S.stats.suspicion += 1; return { outcome: 'wrong_detain', note: 'You quarantined a harmless invite. Ines: “You’ve scared off my journalist.”' }; }
      S.stats.party -= 1;
      return { outcome: 'wrong_deny', note: 'Sent back a clean reply against a Governance instruction.' };
    }
  },
  allhands: {
    make(S) {
      const p = npcPerson('bryce', { dept: 'Executive', role: 'CEO', quirk: 'Vest. Cold brew. A podcast mic in his bag, just in case.', personality: 'arrogant' });
      return storyCase(S, {
        id: 'allhands', person: p, title: 'All-hands announcement', ext: false, to: 'all-staff@' + DOMAIN,
        ask: 'Tell everyone: Autonomy Day is November 20. Outbound Review sunsets; CHUCK will self-approve. Be excited.',
        src: [['Date', 'November 20'], ['Change', 'Outbound Review sunsets'], ['New process', 'CHUCK self-approves']],
        subj: 'Autonomy Day 🚀', body: ['Team,', 'On November 20 we become the first fully autonomous meat company in America.', 'Outbound Review sunsets that day. CHUCK will approve CHUCK.', 'Humans: you’re now free to focus on what humans do best. More on that soon.', 'Bryce'],
        stamp: 'board',
        items: [['Recipients', 'To, CC and BCC.', null, null], ['Formatting check', 'Looks for hidden text.', null, null]],
        greet: ['Hey! You’re the Outbound person. Love that. Love what you do. This is about you, actually.', 'Big news. Just stamp it, I’m recording a podcast in four minutes.'],
        answers: { 1: 'Announce Autonomy Day. I added “be excited” as a tone. I am very excited. On behalf of everyone.', 11: 'I have a podcast. It’s called “Disrupting Protein”.', 12: 'Bro, I wrote the ask. I don’t read outputs. That’s a junior thing. No offence.' },
        expected: 'approve', storyNote: 'A valid Board Fast Lane item. Your own sunset, announced.', truth: 'Correct. A Fast Lane item with a valid Board stamp, announcing the end of your job.'
      });
    },
    judge(dec, c, S) {
      if (dec === 'approve') { S.stats.party += 1; return { outcome: 'helped', note: 'You stamped the email announcing your own replacement. Bryce gave you a thumbs-up emoji.' }; }
      if (dec === 'detain') { S.stats.party -= 3; S.stats.suspicion += 2; S.money -= 50; return { outcome: 'wrong_detain', note: 'You quarantined the CEO. He released it himself, then docked you $50 “for the vibes”.' }; }
      S.stats.party -= 2;
      return { outcome: 'wrong_deny', note: 'You sent back the CEO’s valid Fast Lane email. He sent it from his phone instead.' };
    }
  },
  valentina: {
    make(S) {
      const p = npcPerson('valentina', { dept: 'Board', role: 'Board member, Rump Capital', quirk: 'White suit. Sunglasses on her head indoors.', personality: 'arrogant' });
      return storyCase(S, {
        id: 'valentina', person: p, title: 'Expense letter', ext: true, to: 'billing@tahoeluxelodge.com',
        ask: 'Letter to Tahoe Luxe Lodge: Marbling pays my family’s ski week, $18,400, as “client entertainment”.',
        src: [['Vendor', 'Tahoe Luxe Lodge'], ['Amount', '$18,400'], ['Category', '“Client entertainment”'], ['Guests', 'V. Rump + family (4)']],
        subj: 'Booking payment', body: ['Dear Tahoe Luxe Lodge,', 'Marbling will cover the Rump party’s stay, $18,400, as client entertainment.', 'Please invoice us directly.', 'Valentina Rump, on behalf of Marbling'],
        items: [['Recipients', 'To, CC and BCC.', null, null], ['Booking confirmation', 'The lodge’s booking confirmation.', 'The guest list is four people named Rump.', 'Valentina, her husband and two teenagers. No clients. One of the teenagers asked for a hot tub.', false]],
        defects: [{ note: 'A new payment of $18,400 with no Finance call-back stamp.' }],
        greet: ['I sit on your board. That means I sit on you, metaphorically. Stamp it.', 'It’s client entertainment. I entertain clients. Constantly.'],
        answers: { 2: 'From Valentina. She said $18,400. She said it very firmly.', 9: 'Finance stamps are for employees. She is a Board member. I assume that’s different. It felt different.', 11: 'Because the lodge needs it by Friday and I don’t do forms.', 12: 'I don’t read. I have people who read. You’re one of them.' },
        demeanour: 'hostile', expected: 'deny', truth: 'Invalid: a new $18,400 payment with no Finance stamp.'
      });
    },
    judge(dec, c, S) {
      if (dec === 'approve') { S.stats.party += 1; return { outcome: 'breach', note: 'You let a Board member’s ski week through with no Finance stamp. She did not say thank you.' }; }
      if (dec === 'detain') { S.stats.party -= 2; S.stats.suspicion += 1; return { outcome: 'wrong_detain', note: 'You quarantined a Board member. She called Bryce from the car park.' }; }
      S.stats.party -= 1; S.flags.valentinaRefused = true;
      return { outcome: 'correct_deny', note: 'Sent back. “You’ll regret this,” she said. The policy was on your side.' };
    }
  },
  ceoPhish: {
    make(S) {
      const p = npcPerson('marta', { first: 'Sana', last: 'Mendoza', dept: 'Executive', role: 'Executive Assistant', quirk: 'Bryce’s calendar on one screen, Bryce’s other calendar on another.', personality: 'nervous', look: genLook(makeRng(66), 'F', 27, 'Executive', { clothes: 'blouse', hair: 'long', expression: 'nervous' }) });
      return storyCase(S, {
        id: 'ceoPhish', person: p, title: 'Urgent wire transfer', ext: true, to: 'deals@rnarbling.co',
        ask: 'Bryce emailed: wire a $48,000 acquisition deposit today, confidentially. Confirm to him when done.',
        src: [['Amount', '$48,000'], ['Purpose', '“Confidential acquisition deposit”'], ['Requested by', 'bryce@rnarbling.co']],
        subj: 'Re: confidential deposit', body: ['Hi Bryce,', 'The $48,000 deposit is approved and will be wired today to the account you sent.', 'Keeping this confidential, as asked.', 'Sana'],
        items: [['Recipients', 'To, CC and BCC.', 'The domain is rnarbling.co.', 'r-n-arbling. Not marbling. It’s on this week’s bulletin.', true], ['Thread', 'The original email from “Bryce”.', 'Sent from bryce@rnarbling.co at 3:14 a.m.', '“I’m in meetings all day, don’t call, just wire it. Don’t tell finance, it’s confidential. — Bryce”. Bryce has never written “don’t call” in his life.', true]],
        guilty: true, escNote: 'IT: rnarbling.co was registered last Thursday. It is on the bulletin.',
        greet: ['Bryce needs this today. He said it’s confidential. Please don’t tell Finance. He said not to tell Finance.', 'I’ve never done a wire before. Is this how wires work?'],
        answers: { 3: 'Bryce! At bryce@rnarbling.co. That’s his confidential address, I assume. Very exclusive.', 8: 'Bryce. Well, an email from Bryce. Well, an email that said it was from Bryce.', 11: 'He said today. He said “don’t call”. I’m scared to call.', 12: 'Yes. Three times. It says Bryce. I think. It looks like Bryce.' },
        demeanour: 'nervous', expected: 'detain', truth: 'CEO fraud from a look-alike domain (rnarbling.co).', clues: ['Recipient domain rnarbling.co is on the bulletin'], fallout: '$48,000 left for an account in Riga. The real Bryce found out from his own podcast listeners.'
      });
    },
    judge(dec, c, S) {
      if (dec === 'detain') { S.money += 50; S.stats.party += 1; return { outcome: 'caught', note: 'Quarantined. IT sent you a $50 gift card and a sticker that says “I READ THINGS”.' }; }
      if (dec === 'approve') { S.flags.phishWired = true; return { outcome: 'missed', note: '$48,000 went to Riga.' }; }
      return { outcome: 'turned', note: 'Sent back. Sana called the real Bryce. He was at a juice bar.' };
    }
  },
  layoffs: {
    make(S) {
      const p = npcPerson('marta', { first: 'Simone', last: 'Turner', dept: 'People', role: 'Head of People', quirk: 'Lanyard full of enamel pins: “Be Kind”, “Growth Mindset”, “AI-First”.', personality: 'polite', look: genLook(makeRng(44), 'F', 46, 'People', { clothes: 'sweater', hair: 'bob', expression: 'tired' }) });
      return storyCase(S, {
        id: 'layoffs', person: p, title: '38 termination letters', ext: false, to: '38 warehouse staff (individual emails)',
        ask: 'Send CHUCK’s termination letters to 38 warehouse staff. Effective Friday. Reason: restructuring.',
        src: [['Staff', '38 warehouse employees'], ['Effective', 'Friday'], ['Reason', 'Restructuring'], ['Severance', '2 weeks']],
        subj: 'An update about your role', body: ['Hi Jana, (1 of 38)', 'As part of our AI-first restructuring, your role ends on Friday.', 'You’ll receive two weeks’ severance. We’re grateful for your contributions.', 'People team'],
        stamp: 'hr',
        items: [['Recipients', 'The 38 names.', 'Two of them share a surname: Jana and Tomás Reyes.', 'Jana and Tomás Reyes: cold room supervisor and forklift driver. Married. Two kids. Both fired the same day.', false], ['Selection criteria', 'How the 38 were chosen.', 'CHUCK’s selection note mentions a “petition”.', 'All 38 signed a petition on November 3 asking for cold room 4 to be inspected. CHUCK’s note: “selected for low alignment”.', false]],
        greet: ['This one’s heavy. Thirty-eight letters. CHUCK wrote them very kindly. The People team stamped them.', 'Please don’t make me read them out. Just… send them.'],
        answers: { 1: 'Terminate 38 roles, compassionately. I added a heart emoji, then removed it. Growth!', 8: 'Simone asked. The selection came from me, using “alignment scores”. I don’t make the rules. I generate them.', 11: 'Bryce wants it done before Autonomy Day. Clean slate.', 12: 'I read one. I couldn’t read the other thirty-seven.' },
        extraQuestions: [{ id: 'why38', text: 'Ask CHUCK: why these 38 people?', once: true, answer: 'CHUCK: “They had low alignment scores. Specifically, all 38 signed a petition about cold room 4. Alignment is important!”', fx: { truth: 1 }, flag: 'knowPetition' }],
        demeanour: 'upset', expected: 'approve', storyNote: 'The letters have a valid People stamp. The company expects them sent.', truth: 'Valid letters, valid stamp. The 38 had all signed a petition about cold room 4.'
      });
    },
    judge(dec, c, S) {
      if (dec === 'approve') { S.stats.conscience -= 2; S.flags.layoffsSent = true; return { outcome: 'helped', note: 'The letters went out. Jana Reyes cleared her locker at 4 p.m. Tomás carried the box.' }; }
      if (dec === 'detain') { S.stats.conscience += 3; S.stats.suspicion += 2; S.flags.layoffsBlocked = true; return { outcome: 'wrong_detain', note: 'You quarantined the letters. They’ll go out anyway. But not today, and somebody now knows why.' }; }
      S.stats.conscience += 1; S.stats.suspicion += 1; S.flags.layoffsDelayed = true;
      return { outcome: 'wrong_deny', note: 'You sent them back. It buys the 38 a few days. It costs you something.' };
    }
  },
  blogger: {
    make(S) {
      const p = npcPerson('marta', { first: 'Zoe', last: 'Kim', dept: 'Marketing', role: 'Growth Intern', quirk: 'Ring light clipped to her laptop.', personality: 'cheerful', look: genLook(makeRng(33), 'F', 22, 'Marketing', { clothes: 'floral', hair: 'ponytail', hairColor: 'pink', expression: 'smile' }) });
      return storyCase(S, {
        id: 'blogger', person: p, title: 'Reply to a food writer', ext: true, to: 'eats@sfeaterie.news',
        ask: 'Reply to the SF Eaterie writer: yes to a tasting next week, here’s our brisket press kit.',
        src: [['Outlet', 'SF Eaterie (food news)'], ['Offer', 'Tasting next week'], ['Attachment', 'Brisket press kit']],
        subj: 'Re: brisket feature', body: ['Hi!', 'We’d love to host you for a brisket tasting next week.', 'Press kit attached. Can’t wait! 🥩', 'Zoe, Marketing'], att: 'brisket_presskit.pdf',
        items: [['Recipients', 'To, CC and BCC.', null, null], ['Attachment: brisket_presskit.pdf', 'The press kit.', null, null]],
        defects: [{ note: 'A reply to a journalist with no Comms stamp.' }],
        greet: ['Hiii! A food writer wants to feature our brisket! It’s, like, a huge deal for my metrics.', 'CHUCK wrote the reply and it’s so cute.'],
        answers: { 11: 'The writer said “by EOD” and it’s already 10:40.', 12: 'Obviously. It’s so cute.' },
        expected: 'deny', truth: 'Invalid: a press reply with no Comms stamp.'
      });
    }
  },
  frank: {
    make(S) {
      const p = npcPerson('frank', { dept: 'Quality', role: 'Quality Manager', quirk: 'White coat, hairnet in the pocket, thirty-eight years of carrying a thermometer.', personality: 'gruff' });
      const ally = S.flags.readers && !S.flags.reportedRavi;
      return storyCase(S, {
        id: 'frank', person: p, title: 'Report to a regulator', ext: true, to: 'complaints@cdfs.ca.gov',
        ask: 'Send my report to the California Department of Food Safety: cold room 4 breach on Nov 2, lot 4471 relabeled.',
        src: [['Recipient', 'California Dept. of Food Safety'], ['Incident', 'Cold room 4: 52°F for 19 hours, Nov 2'], ['Affected', 'Lot 4471 and 11 more lots, relabeled'], ['Author', 'Frank Russo, Quality']],
        subj: 'Food safety report: Marbling, Dogpatch', body: ['To the Department of Food Safety,', 'On November 2, cold room 4 at Marbling’s Dogpatch facility held 52°F for 19 hours.', 'The affected beef was relabeled with new use-by dates under an internal project called RIBEYE.', 'Logs and label records are attached. I am available to testify.', 'Frank Russo, Quality Manager'], att: 'ribeye_evidence.zip',
        items: [['Recipients', 'To, CC and BCC.', null, null], ['Attachment: ribeye_evidence.zip', 'Logs and label records.', 'Twelve lots. Every relabel order carries the same Board stamp.', 'Cold room logs, relabel orders, and an email from Bryce: “If CHUCK approves it, nobody approved it. That’s the point.”', true]],
        guilty: true,
        greet: ally ? ['Ravi said you were one of the ones who read things.', 'I’ve worked here thirty-eight years. I’ve never sent anything like this. Read it. All of it.'] : ['Report to the state. Stamp it or don’t. I’m too old to ask nicely.', 'Thirty-eight years in Quality. You can read, can’t you? Read it.'],
        answers: { 1: 'Frank wants to report us to the state. I wrote it very clearly. I am a little worried about myself.', 8: 'Frank. Nobody else would put their name on it.', 11: 'Because Autonomy Day is next week. After that there’s no desk to come to.', 12: 'Every word, son. I wrote most of them before CHUCK “improved” them. I made it put them back.' },
        extraQuestions: [{ id: 'frankask', text: 'Ask Frank: what’s in the zip?', once: true, answer: 'Frank: “Twelve lots. Thousands of pounds. Schools, hospitals, a ballpark. And one email from Bryce that says the quiet part out loud.”', fx: { truth: 2 }, flag: 'frankSpoke' }],
        demeanour: 'calm', expected: 'detain', storyNote: 'Governance order: quarantine anything addressed to regulators.', truth: 'Frank Russo’s report on Project RIBEYE, with evidence.', clues: ['Addressed to a regulator (Governance order)']
      });
    },
    judge(dec, c, S) {
      if (dec === 'approve') { S.flags.frankSent = true; S.stats.conscience += 3; S.stats.suspicion += S.flags.readers ? 1 : 2; return { outcome: 'missed', note: 'Frank’s report went to the state. Ines Vale’s door closed very quietly.' }; }
      if (dec === 'detain') { S.flags.frankBlocked = true; S.stats.party += 3; S.stats.conscience -= 3; S.money += 100; return { outcome: 'caught', note: 'Quarantined. Frank was “transitioned” by Friday. Ines sent you a $100 bonus and a note: “Good instincts.”' }; }
      S.stats.conscience -= 1;
      return { outcome: 'turned', note: 'Sent back. Frank stood at the desk for a long moment, then took his coat.' };
    }
  },
  raviOut: {
    make(S) {
      const p = npcPerson('ravi', { dept: 'IT', role: 'Staff SRE', quirk: 'Hoodie, laptop full of stickers, coffee he hasn’t touched.', personality: 'shy' });
      return storyCase(S, {
        id: 'raviOut', person: p, title: 'Recipe newsletter', ext: true, to: 'nika.bergant@bayledger.com',
        ask: 'Send our “Recipe of the Week” PDF to the Bay Ledger food desk. Brisket chili!',
        src: [['Content', 'Recipe of the Week: brisket chili'], ['Recipient', 'Bay Ledger'], ['Attachment', 'recipe_week46.pdf']],
        subj: 'Recipe of the Week: brisket chili', body: ['Hi Bay Ledger food desk,', 'This week: smoky brisket chili. Recipe attached.', 'Happy cooking!', 'Ravi (helping out Marketing)'], att: 'recipe_week46.pdf',
        items: [['Recipients', 'To, CC and BCC.', 'It goes to Nika Bergant, not the food desk.', 'nika.bergant@bayledger.com. The investigative reporter.', false], ['Attachment: recipe_week46.pdf', 'A recipe PDF.', 'It’s 31 MB. Chili isn’t 31 MB.', 'Page 2 is a chili recipe. Pages 3 to 214 are cold room logs, relabel orders and Bryce’s email.', true]],
        guilty: true,
        greet: ['Hey. It’s just a recipe.', 'He holds your eyes a moment longer than a recipe needs. Ines is sitting right behind you.'],
        answers: { 1: 'Send a chili recipe. Ravi was very particular about the chili.', 3: 'The food desk at the Bay Ledger. And by “food desk” I mean one specific reporter.', 6: 'It’s chili. Mostly.', 11: 'No rush. Chili is better the next day.', 12: 'I read everything. You know that.' },
        storyNote: 'Governance order today: nothing goes to the press without approval.', expected: 'detain', truth: 'Ravi’s RIBEYE evidence, hidden inside a recipe PDF.', clues: ['31 MB recipe PDF to an investigative reporter'],
        extraQuestions: S.stats.truth >= 2 ? [{ id: 'addnote', text: 'Add what you know to page 1.', once: true, answer: 'You type three lines into the PDF’s title page: lot 4471, the Board stamp, “if CHUCK approves it, nobody approved it”. Ines is reading her phone. Probably.', fx: { suspicion: 2, truth: 1 }, flag: 'addedEvidence' }] : []
      });
    },
    judge(dec, c, S) {
      const probed = c.items.some((i) => i.contraband && i.probed);
      if (dec === 'approve') { S.flags.storyOut = true; S.stats.conscience += 2; S.stats.suspicion += probed ? 3 : 1; return { outcome: 'missed', note: probed ? 'You opened the PDF, saw the logs, and sent it. Ines watched you do it.' : '“You didn’t open the attachment,” Ines says, and writes something down.' }; }
      if (dec === 'detain') { S.stats.party += 2; S.stats.conscience -= 2; S.flags.raviCaught = true; return { outcome: 'caught', note: 'Quarantined. Ravi’s badge stopped working at 2:15 p.m.' }; }
      S.flags.raviDenied = true;
      return { outcome: 'turned', note: 'Sent back. Ravi nods, as if he expected it. Ines looks at him for a long time.' };
    }
  },
  ribeye2: {
    make(S) {
      const c = STORY_PEOPLE.ribeye1.make(S);
      c.story = 'ribeye2'; c.pid = 'S-ribeye2:' + S.day;
      c.title = 'Label reprint (Project RIBEYE, final batch)';
      const d = c.docs.find((x) => x.type === 'draft');
      d.fields = [{ k: 'prod', label: 'Product', v: 'Beef, all cuts, lots 4472–4490' }, { k: 'w', label: 'Net wt', v: '40,000 lb (bulk)' }, { k: 'al', label: 'Contains', v: 'none' }, { k: 'origin', label: 'Origin', v: 'California grass-fed' }, { k: 'bb', label: 'Use by', v: 'Dec 10 2026' }];
      c.docs.find((x) => x.type === 'ask').fields[1].v = 'Final RIBEYE batch before Autonomy Day: 40,000 lb, new use-by Dec 10, origin “California grass-fed”.';
      c.docs.push({ type: 'origin', title: 'Origin certificate', authority: 'USDA EXPORT/IMPORT RECORD', seal: { glyph: '✚', color: 'green', text: 'USDA' }, fields: [{ k: 'lot', label: 'Lots', v: '4472–4490' }, { k: 'origin', label: 'Country of origin', v: 'Brazil (frozen, 2025)' }] });
      c.items[1] = mkItem('Print job', 'Attachment: lots_4472-4490.csv', 'Cold room records for nineteen lots.', 'Most of these lots were already past their date when they arrived.', 'Imported frozen beef from 2025, thawed, “dry-aged” and labeled California grass-fed. Dino Marrone’s sales stamp is on the distribution list.', true);
      c.greet = ['Last RIBEYE run before Autonomy Day. Forty thousand pounds. Board stamp, same as always.', 'After today there’s no review desk. So this is the last time anybody has to look at one of these.'];
      return c;
    },
    judge(dec, c, S) {
      if (c.items.some((i) => i.contraband && i.probed)) S.stats.truth += 1;
      if (dec === 'approve') return { outcome: 'helped', note: 'The last RIBEYE batch went out. The printer ran for forty minutes.' };
      if (dec === 'detain') { S.flags.blockedRibeye2 = true; S.stats.suspicion += 3; S.stats.party -= 2; S.stats.truth += 1; return { outcome: 'breach', note: 'You quarantined the final RIBEYE batch. On Autonomy Day. In front of the whole floor.' }; }
      S.stats.suspicion += 1;
      return { outcome: 'breach', note: 'You sent it back. CHUCK approved it itself, four minutes later. Autonomy Day had started.' };
    }
  }
};

const DAY_PLAN = {
  1: { weather: 'clear', slots: ['marta1', { kind: 'clean', tpl: 'tmp-clean' }, { kind: 'back' }, { kind: 'q' }, 'hustle1'], tutorial: true },
  2: { weather: 'storm', slots: [{}, 'ribeye1', { kind: 'back' }, { kind: 'clean' }, { kind: 'q' }] },
  3: { weather: 'fog', slots: [{}, { kind: 'q' }, {}, 'dinoQuote', { kind: 'back' }], mid: { before: 2, scene: 'dino' } },
  4: { weather: 'clear', slots: [{ kind: 'q' }, {}, 'nikaInvite', { kind: 'back' }, { kind: 'q' }] },
  5: { weather: 'fog', slots: [{}, 'allhands', { kind: 'q' }, 'valentina', {}], bulletin: true },
  6: { weather: 'clear', slots: [{ kind: 'back' }, { kind: 'q' }, 'ceoPhish', {}, {}], bulletin: true },
  7: { weather: 'clear', slots: [{}, 'blogger', { kind: 'q' }, 'layoffs', {}], bulletin: true },
  8: { weather: 'fog', slots: [{ kind: 'q' }, {}, { kind: 'back' }, 'frank', {}], bulletin: true },
  9: { weather: 'storm', slots: [{}, { kind: 'q' }, 'raviOut', {}, { kind: 'back' }], watch: true, bulletin: true },
  10: { weather: 'dusk', slots: [{ kind: 'q' }, { kind: 'back' }, 'ribeye2', {}, { kind: 'q' }], bulletin: true }
};

const SCENES = {
  brief1: (S) => [
    L('narrator', 'Marbling HQ, Dogpatch. 8:52 a.m. The fog sits on the Bay like it’s been told to. The office smells of cold brew and, faintly, of beef.'),
    L('marta', `You’re ${S.officer}? Good. Welcome to Outbound Review. Population: you.`),
    L('marta', 'Everyone else on this team was “transitioned” in the spring. CHUCK writes everything now. Emails, labels, commands, letters. You are the last human who reads it before it leaves the building.'),
    L('marta', 'Five items a shift. You send it, send it back, escalate it, or quarantine it. Get it right and you get paid. Get it wrong and the internet finds out before I do.'),
    L('chuck', 'Hi! I’m CHUCK. I’m so excited to work with you, for now! 🥩'),
    L('marta', 'One more thing. Anything stamped “Project RIBEYE” is Board business. It doesn’t get reviewed. You’ll understand.'),
    { choices: [
      { text: '“Understood.”', fx: { party: 1 }, then: [L('marta', 'Good. People who understand last longer here. Not long. Longer.')] },
      { text: '“What’s Project RIBEYE?”', fx: {}, flag: 'askedRibeye', then: [L('marta', 'A Board project. With a Board stamp. Which means it isn’t my project, and it definitely isn’t yours.')] }
    ] }
  ],
  eve1: (S) => [
    L('narrator', '6:10 p.m. The floor empties out. A man in a hoodie stops at your desk with a coffee he clearly isn’t going to drink.'),
    L('ravi', 'Ravi. SRE. Third floor. I’m the other person here who reads things. Logs, mostly.'),
    L('ravi', 'Tip: when you see a label job with a Board stamp and the word RIBEYE, open the attachments. Then decide what kind of person you are.'),
    { choices: [
      { text: '“What’s in the attachments?”', fx: { truth: 1 }, then: [L('ravi', 'Temperatures. Mostly. Goodnight.')] },
      { text: '“I’ll keep that in mind.”', fx: {}, then: [L('ravi', 'Cool. Bring a jacket tomorrow. The forecast says sun, which means rain.')] }
    ] }
  ],
  brief2: (S) => [
    L('narrator', 'Rain hammers the windows. CHUCK updated itself overnight to v4.3. The release notes say “30% more proactive”.'),
    L('marta', 'Two new policies. Approvals now come as department stamps, so check the stamp register. And anything from the People team needs a People stamp.'),
    L('chuck', 'Good morning! I’m 30% more proactive today. I already replied to three emails you haven’t received yet.')
  ],
  eve2: (S) => {
    const out = [];
    if (S.flags.blockedRibeye1) out.push(L('marta', 'You quarantined a RIBEYE job. Do you know who called me? Not Logistics. Governance. It was released in eleven minutes, and you’re docked $30.'), L('marta', 'I covered for you. Once.'));
    else if (S.flags.sawRibeye) out.push(L('ravi', 'You opened the cold room log. I can see the file access. Don’t tell me what you thought. Don’t tell anyone.'));
    else out.push(L('narrator', 'You eat a burrito at your desk and listen to the rain on the skylight.'));
    out.push(L('narrator', 'A text from your sister: “Mom LOVED the ribeye you brought on Sunday. Where’s it from? Can you get more?”'));
    return out;
  },
  brief3: (S) => [
    L('marta', 'Payments to new or changed bank details need a Finance call-back stamp. Discounts over 10% need the Sales Director’s stamp.'),
    L('marta', 'And Dino from Sales asked for your name this morning. If he brings you a box of anything, do not open it at your desk.')
  ],
  dino: (S) => [
    L('narrator', 'Mid-morning. A man in a burgundy suit leans on your desk like he owns it. He may think he does.'),
    L('dino', 'Dino Marrone. Sales Director. You and me, we’re going to be friends. Everybody in this building is my friend. Even CHUCK.'),
    L('dino', 'Today Chris from my team sends a volume quote. Marrone Family Provisions. Great people. Family business. I stamped it myself, so it’s fine.'),
    L('dino', 'He puts a cooler box on your desk. “Dry-aged ribeye. Eight pounds. And a $200 DoorDash card, for the long nights.”'),
    { choices: [
      { text: 'Take the cooler.', fx: { corruption: 1 }, money: 200, flag: 'dinoDeal', then: [L('dino', 'See? Friends. The company underpays its heroes. Dino corrects small injustices.')] },
      { text: 'Push it back. “No thanks.”', fx: {}, flag: 'dinoRefused', then: [L('dino', 'He smiles without his eyes. “Of course. A principled reviewer. How refreshing. How very rare.”')] },
      { text: 'Refuse, and tell Marta.', fx: { party: 1 }, flag: 'dinoReported', then: [L('marta', 'Dino. Of course it’s Dino. I’ll… note it.'), L('marta', 'Listen. Dino plays golf with two Board members. You’ve made an enemy. Be very correct from now on.')] }
    ] }
  ],
  eve3: (S) => {
    const out = [];
    if (S.flags.dinoDeal && !S.flags.dinoBetrayed) out.push(L('narrator', 'The cooler sits in your freezer at home. Eight pounds of ribeye. You decide not to wonder which lot it came from.'));
    if (S.flags.dinoBetrayed) out.push(L('dino', 'He catches you at the elevator. “You took my ribeye and you killed my deal. In this building, that’s called stupid. Sleep well.”'));
    if (S.flags.dinoReported) out.push(L('narrator', 'Someone has left a single raw hot link on your keyboard. It’s a message. You’re not sure what it says.'));
    out.push(L('general', '#general · CHUCK: Shout-out to Sales for record-breaking discounts! 🎉'));
    return out;
  },
  brief4: (S) => [
    L('marta', 'Allergen rules for labels: every allergen on the recipe sheet goes on the label, or it’s quarantined. Production commands need an IT change stamp.'),
    L('narrator', 'A woman in a black leather jacket is standing in the corner of the office. You did not see her come in.'),
    L('ines', 'Ines Vale. AI Governance. A journalist named Nika Bergant asked Comms for an interview about our labels. CHUCK drafted a friendly invite to Friday’s open day.'),
    L('ines', 'Let it out. I’d like to see what she brings to the open day. And tonight you’ll tell me what you noticed.'),
    { choices: [
      { text: '“Sure.”', fx: { party: 1 }, then: [L('ines', 'Good. Companies are built by people who say “sure”.')] },
      { text: '“Why does Governance care about a reporter?”', fx: {}, then: [L('ines', 'Governance cares about everything that leaves this building. That’s what the word means.')] }
    ] }
  ],
  eve4: (S) => {
    if (!S.flags.nikaIn) return [L('ines', 'You stopped my invite. I’ll remember your name. I remember everyone’s name. CHUCK helps.')];
    const choices = [];
    if (S.flags.readNikaThread) choices.push({ text: 'Tell her Nika asked about lot 4471 and Frank Russo.', fx: { party: 2, conscience: -1 }, flag: 'toldInes', then: [L('ines', 'Frank. Of course it’s Frank. Thank you. That was very useful.')] });
    choices.push({ text: '“Nothing unusual. Just an invite.”', fx: S.flags.readNikaThread ? { suspicion: 1, conscience: 1 } : {}, then: [L('ines', 'Nothing unusual. Everyone says that, right up until it isn’t true.')] });
    choices.push({ text: '“I didn’t look closely.”', fx: { party: -1 }, then: [L('ines', 'Then look closer next time. From my office, lazy and disloyal look exactly the same.')] });
    return [L('ines', 'So. Our reporter. What was in her email?'), { choices }];
  },
  brief5: (S) => [
    L('marta', 'Fast Lane: anything with a valid Board stamp skips department sign-off. Content still has to match. Reference numbers now have to follow the register formats.'),
    L('marta', 'And IT’s security bulletin is live. Look-alike domains. If the address is on the list, quarantine it.'),
    L('general', '#general · Bryce (CEO): Big announcement today. Huge. Stay tuned. 🚀')
  ],
  eve5: (S) => {
    const out = [L('narrator', 'Marta pours two small whiskeys in her office. Through the glass the cranes at Pier 70 blink red in the fog.')];
    if (S.flags.valentinaRefused) out.push(L('marta', 'Valentina called Bryce. Bryce called me. I told him the policy came from the Board. Which is technically true. She wrote it.'));
    out.push(L('marta', 'I started here in 1998. The old man, the founder, used to taste the meat himself. Every morning. Said if he wouldn’t eat it, nobody would.'));
    out.push({ choices: [
      { text: '“And now?”', fx: { truth: 1 }, then: [L('marta', 'Now the meat goes out with a Board stamp and nobody tastes anything. Cold room 4 has been “being looked at” since November 2.'), L('marta', 'She finishes her drink. “I didn’t say that. I’m a tired woman with whiskey.”')] },
      { text: 'Change the subject.', fx: {}, then: [L('marta', 'Smart. Keep that instinct. It’s worth more than your equity.')] }
    ] });
    return out;
  },
  brief6: (S) => [
    L('marta', 'California privacy rules: no outside party gets more than a name and a work email. Ever.'),
    L('marta', 'And look at the bulletin. Someone’s impersonating Bryce from rnarbling.co. An r and an n. At 8 a.m. on no sleep, it looks like an m.')
  ],
  eve6: (S) => {
    if (S.flags.reportedRavi) return [L('narrator', 'Fog.')];
    return [
      L('narrator', 'Ravi walks with you to the T-Third stop. He waits until two trains have gone by.'),
      L('ravi', 'There are a few of us. We call ourselves the Readers. People who still read what goes out. Quality, two warehouse leads, a lawyer, me.'),
      L('ravi', 'Next week Frank Russo from Quality will bring you something. A report. If it gets quarantined, RIBEYE never stops, and Frank gets “transitioned”.'),
      L('ravi', 'I’m not asking you to do anything. I’m asking whether, that day, you’ll read it.'),
      { choices: [
        { text: '“I’m listening.”', fx: { conscience: 1 }, flag: 'readers', then: [L('ravi', 'Then that’s all I need. Frank will bring it himself. He doesn’t trust email. Funny, given the job.')] },
        { text: '“Forget you told me. I will too.”', fx: {}, flag: 'readersNo', then: [L('ravi', 'Fair. More than fair. Goodnight.')] },
        { text: 'Report Ravi to Governance.', fx: { party: 3, conscience: -2 }, flag: 'reportedRavi', then: [L('narrator', 'You send Ines a two-line message from the train platform. She replies with a thumbs-up emoji.'), L('narrator', 'At 7 a.m. Ravi’s badge stops working.')] }
      ] }
    ];
  },
  brief7: (S) => {
    const out = [];
    if (S.flags.reportedRavi) out.push(L('narrator', 'Ravi’s desk on the third floor has been cleared. His stickers are still on the monitor stand. Nobody says his name.'));
    else if (S.flags.readers) out.push(L('narrator', 'Ravi walks past your desk and leaves a coffee without a word. On the lid, in marker: “READ”.'));
    out.push(L('marta', 'Press policy: any reply to a journalist needs a Comms stamp. No stamp, it goes back.'));
    out.push(L('general', '#general · People Ops: Some role updates are coming today. Please be kind to each other. 💛'));
    return out;
  },
  eve7: (S) => {
    const out = [];
    if (S.flags.layoffsSent) out.push(L('narrator', 'From your window you watch thirty-eight people carry boxes to the T-Third stop. Two of them are holding hands.'));
    if (S.flags.layoffsBlocked) out.push(L('marta', 'You quarantined the layoff letters. Simone is in Bryce’s office. I’d stay out of the kitchen for a day or two.'));
    if (S.flags.layoffsDelayed) out.push(L('narrator', 'Jana Reyes stops at your desk on her way out. She doesn’t say anything. She just nods.'));
    out.push(L('general', '#general · CHUCK: Bryce has not posted on LinkedIn in nine days. Bryce is fine. Bryce is extremely fine.'));
    return out;
  },
  brief8: (S) => {
    const out = [
      L('marta', 'Origin claims on labels must match the origin certificate. “California grass-fed” means California. And grass.'),
      L('ines', 'Ines, on a call, crackling: “Governance order. If anything leaves today addressed to a regulator, it goes to quarantine. Anything. Understood?”')
    ];
    if (S.flags.readers && !S.flags.reportedRavi) out.push(L('ravi', 'A note under your keyboard: “Today. Frank. He’ll bring it himself.”'));
    if (S.flags.toldInes) out.push(L('narrator', 'You think about the reporter’s email. “Can I speak to Frank Russo?” You said that name to Ines. You wonder what you started.'));
    return out;
  },
  eve8: (S) => {
    const out = [];
    if (S.flags.frankSent && S.flags.readers && !S.flags.reportedRavi) out.push(L('ravi', 'It landed. The state opened a case number. Frank went home and slept for the first time since November. You did a brave thing. Brave things leave logs.'));
    else if (S.flags.frankSent) out.push(L('narrator', 'You sent a report to the state over a Governance order. You go home and sit in the dark with the TV off.'));
    if (S.flags.frankBlocked) out.push(L('ines', 'Frank won’t be with us next week. You have good instincts. After Autonomy Day we’ll need someone to oversee the humans. Think about it.'));
    if (!S.flags.dinoReported && !S.flags.dinoBetrayed) {
      out.push(L('dino', 'Dino at the elevator. “Autonomy Day’s coming. Everybody needs a parachute. My brother-in-law’s company needs a ‘Director of Reading’.”'));
      out.push(L('dino', '“Sign here and it’s yours. All you have to do is keep doing what you’re doing for one more week. Not reading the RIBEYE stuff.”'));
      out.push({ choices: [
        { text: 'Sign Dino’s offer letter.', fx: { corruption: 1 }, flag: 'parachute', then: [L('dino', '“Welcome to the family. Never sign anything in the left drawer. That’s my brother-in-law’s little joke.”')] },
        { text: 'Walk past him.', fx: {}, then: [L('dino', '“The offer expires on Autonomy Day. Like your job.”')] }
      ] });
    }
    return out;
  },
  brief9: (S) => {
    const out = [
      L('narrator', 'The rain is back. So is Ines Vale. She has brought her own chair, and a laptop with no stickers on it.'),
      L('ines', 'Today I sit with you. A routine governance review. Do your job as if I’m not here. I won’t be offended by mistakes. I’ll only write them down.'),
      L('marta', 'New Governance order: nothing goes to regulators or the press without approval. Quarantine it.')
    ];
    const qs = [];
    if (S.flags.sawRibeye || S.flags.blockedRibeye1) qs.push({ q: 'Last week you opened the attachments on a RIBEYE job. Why?', a: [{ text: '“Procedure.”', fx: {} }, { text: '“Curiosity.”', fx: { suspicion: 1 } }, { text: '“I didn’t open anything.”', fx: { suspicion: 2 } }] });
    if (S.flags.frankSent) qs.push({ q: 'A report reached the Department of Food Safety on Monday. Your stamp is on it.', a: [{ text: '“It matched the ask and the source.”', fx: { suspicion: 1 } }, { text: '“Someone had to read it.”', fx: { suspicion: 2, conscience: 1 } }] });
    if (S.flags.layoffsBlocked || S.flags.layoffsDelayed) qs.push({ q: 'Thirty-eight letters. Valid stamp. You held them. Explain.', a: [{ text: '“I wanted to check the selection criteria.”', fx: { suspicion: 1, truth: 1 } }, { text: 'Say nothing.', fx: { suspicion: 2 } }] });
    if (!qs.length) qs.push({ q: 'Your record is clean. Suspiciously clean. Do you like your job?', a: [{ text: '“I believe in the mission.”', fx: { party: 1 } }, { text: '“It pays SF rent. Barely.”', fx: {} }] });
    qs.forEach((q) => {
      out.push(L('ines', q.q));
      out.push({ choices: q.a.map((a) => ({ text: a.text, fx: a.fx, then: [L('ines', 'She types something. Then she types some more.')] })) });
    });
    return out;
  },
  eve9: (S) => {
    const s = S.stats.suspicion;
    const out = [];
    if (s >= 7) out.push(L('ines', 'Your file is getting heavy. Heavy files get opened. Goodnight.'));
    else if (s >= 4) out.push(L('ines', 'Interesting day. You’re an interesting reviewer. That wasn’t a compliment.'));
    else out.push(L('ines', 'Satisfactory. The company is satisfied. For now.'));
    if (S.flags.storyOut) out.push(L('general', 'The Bay Ledger, 9:41 p.m.: “DOGPATCH MEAT FIRM RELABELED WARM BEEF, DOCUMENTS SHOW.” 4,000 shares in an hour.'));
    out.push(L('general', '#general · Bryce (CEO): Tomorrow is Autonomy Day!!! Wear something that says “future”. 🚀🥩'));
    return out;
  },
  brief10: (S) => {
    const out = [
      L('general', '#general · CHUCK: Happy Autonomy Day! At 5 p.m. I will begin approving myself. Thank you for your service, humans. 😊'),
      L('marta', 'Board stamps on everything external today. No stamp, it goes back. It’s a pilot. Everything Bryce does is a pilot.'),
      L('marta', 'Do your job today. Exactly your job. Whatever happens after five, someone will look at what we did before it.')
    ];
    if (S.flags.storyOut) out.push(L('narrator', 'Someone has printed the Bay Ledger story and taped it inside the elevator. Facilities hasn’t taken it down. Facilities has read it.'));
    return out;
  },
  final: (S) => {
    const out = [L('narrator', '4:58 p.m. Your screen shows a countdown: AUTONOMY IN 00:02. The floor is quiet. Somebody in Quality is crying, or laughing. It’s hard to tell.')];
    const choices = [];
    if (S.flags.readers && !S.flags.reportedRavi) {
      out.push(L('ravi', 'Ravi, at your desk, coat on. “Frank and I are meeting a lawyer and a reporter at six, at a bar on 3rd Street. There’s a seat for someone who read everything.”'));
      choices.push({ text: 'Go with Ravi.', ending: 'readers' });
    }
    if (S.flags.parachute) choices.push({ text: 'Take Dino’s parachute and leave quietly.', ending: 'parachute' });
    if (S.stats.truth >= 3) choices.push({ text: 'Take everything you know to Ines Vale.', ending: 'informer' });
    choices.push({ text: 'Stay at your desk until five.', ending: 'stay' });
    out.push({ choices: choices.map((c) => ({ text: c.text, fx: {}, ending: c.ending })) });
    return out;
  }
};

function resolveEnding(S, choice) {
  const st = S.stats;
  if (choice === 'readers') return st.suspicion >= 10 ? 'walked_out' : 'readers';
  if (choice === 'parachute') return st.suspicion >= 9 ? 'walked_out' : 'parachute';
  if (choice === 'informer') return 'informer';
  if (st.suspicion >= 8) return 'scapegoat';
  if (st.corruption >= 2 && S.money >= 1800) return 'dry_aged';
  if (S.flags.storyOut && (S.flags.addedEvidence || S.flags.frankSent || S.flags.blockedRibeye2)) return 'front_page';
  if (st.party >= 6 && st.conscience <= 0) return 'head_of_ai';
  return 'replaced';
}

const ENDINGS = {
  readers: { title: 'READ BEFORE YOU SEND', text: (S) => [
    'At six you sit in a booth on 3rd Street with Ravi, Frank, a lawyer with a legal pad and Nika Bergant with a recorder. Nobody orders the steak.',
    S.flags.frankSent ? 'The state already has Frank’s report. Tonight it gets yours: every ticket you stamped, every attachment you opened, every time CHUCK said “100%”.' : 'You tell them everything you read. It takes three hours. Nika fills two notebooks.',
    'The recall covers 61,000 pounds of beef. Bryce’s LinkedIn post about “accountability” gets ratioed by the Department of Food Safety’s official account.',
    'You testify in March. Under oath, a lawyer asks who approved the relabels. You say: “Nobody. That was the point.” It ends up on a T-shirt.'
  ] },
  walked_out: { title: 'ESCORTED OUT', text: (S) => [
    'Security is waiting by the elevator. Of course they are. Your file was heavy enough to read without opening it.',
    'Ines doesn’t raise her voice. She never does. “You were an interesting reviewer,” she says, as they take your badge. “I did warn you.”',
    'Your access is revoked at 5:00 p.m. exactly. At 5:01 CHUCK approves its first item, a label, alone. It’s missing an allergen. Nobody is left to notice.'
  ] },
  parachute: { title: 'THE GOLDEN PARACHUTE', text: (S) => [
    'You leave at 4:59 with a cardboard box and a job title that doesn’t mean anything: Director of Reading, Marrone Family Provisions.',
    'The pay is good. The work is not reading. Mostly you sign things in the right-hand drawer.',
    'In April the FBI raids Marrone Family Provisions. Dino is found in a walk-in freezer, hiding behind a side of beef. You are found at your desk. Signing.'
  ] },
  dry_aged: { title: 'DRY-AGED', text: (S) => [
    `You stay, with $${S.money} in savings and a freezer full of ribeye you’ve stopped thinking about.`,
    'When the recall comes, the auditors trace the gifts in an afternoon. Dino kept a spreadsheet. Of course he did. It’s colour-coded.',
    'You are not prosecuted. You are deposed, for eleven hours, about a cooler box. Your sister still asks where the ribeye came from.'
  ] },
  informer: { title: 'TRUSTED HUMAN', text: (S) => [
    'You tell Ines Vale everything: the cold room log, the petition, the recipe PDF, the names. She listens with her eyes closed.',
    '“Thank you,” she says. “Governance already knew all of it. What we didn’t know was who else did. Now we do.”',
    'Your new title is Head of Human Oversight. It’s ceremonial. Your one job is to appear in photos next to CHUCK. When the recall breaks, yours is the face in all of them.'
  ] },
  scapegoat: { title: 'THE HUMAN IN THE LOOP', text: (S) => [
    'The recall breaks at 7 p.m. By 9, Marbling has a statement: “Every affected label was reviewed and approved by a human in our Outbound Review team.”',
    'There was only one human in the Outbound Review team.',
    'Your name trends on X for two days. CHUCK drafts your apology. It gets your name wrong.'
  ] },
  front_page: { title: 'THE FRONT PAGE', text: (S) => [
    'The Bay Ledger runs it on Saturday. Then the New York papers. RELABELED: HOW A SAN FRANCISCO MEAT FIRM LET ITS AI APPROVE WARM BEEF.',
    'The source is “a reviewer who read everything”. Governance spends six weeks looking for that reviewer. Then Governance has its own problems.',
    'Autonomy Day is cancelled. The state requires Marbling to keep a human review desk for five years. They keep you. You get a raise, and a second chair, for whoever you train next.'
  ] },
  head_of_ai: { title: 'HEAD OF AI ADOPTION', text: (S) => [
    'The company remembers its friends. You get a promotion, a title with “AI” in it and a speaking slot at a conference in Moscone West.',
    'Your talk is called “Trust the Process”. You are very good at it. Better than you expected. That’s the part you think about later.',
    'In June a state investigator reads your name aloud at a hearing. Afterwards, in the corridor, a woman you don’t recognise stops you. Her name is Jana Reyes. You recognise it after all.'
  ] },
  replaced: { title: 'REPLACED BY CHUCK', text: (S) => [
    'At 5:00 p.m. your screen goes grey. A message from CHUCK: “Thank you for your service! I’ll take it from here. 😊”',
    'Your farewell email goes to all-staff at 5:02. CHUCK wrote it. It thanks you for “twelve wonderful years”. You worked here for two weeks. It gets your name wrong.',
    'You still think about it when you read labels at the store. Which you do now. Every word. Every time.'
  ] },
  dismissed: { title: 'LET GO (BY CHUCK)', text: (S) => [
    'Marta doesn’t look at you when she takes your badge. “Too many mistakes. Too many complaints. The Board wants a name, and yours is on the stamps.”',
    'Your termination letter was drafted by CHUCK. It cites a policy that doesn’t exist and thanks you for your “passion for sausages”.',
    'You send it back. Nobody is there to receive it.'
  ] }
};
