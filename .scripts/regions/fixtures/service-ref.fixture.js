/* A synthetic SERVICE_REF for the codex39 tests, in the shape of
   .scripts/regions/service-ref-schema.json. Never shipped: the real
   js/data-service-ref.js is written by its own author. */
var SERVICE_REF = {
  version: 1,
  tables: [
    {
      key: 'faults', title: 'Wine faults', line: 'What a spoiled glass smells of, why, and what to do at the table.',
      columns: ['Fault', 'Smells or looks of', 'Cause', 'At the table'],
      rows: [
        ['Cork taint', 'Wet cardboard, damp cellar, fruit stripped out', 'TCA from a tainted cork or barrel', 'Apologise, replace the bottle, never argue the point'],
        ['Oxidation', 'Bruised apple, sherry, a dull brown colour', 'Air through a failed closure or long open', 'Replace; check the closure before service'],
        ['Volatile acidity', 'Nail varnish, vinegar', 'Acetic bacteria during or after fermentation', 'A little is style; a lot is a fault, replace']
      ],
      notes: ['Taste every bottle before it goes to the table.', 'A guest who says a wine is corked is right until proven otherwise.'],
      say: [['TCA', 'tee see AY']],
      sources: [{ title: 'The Court’s service standards', asOf: '2026' }]
    },
    {
      key: 'glassware', title: 'Glassware', line: 'The glass for each wine and the pour that fits it.',
      columns: ['Glass', 'Shape and size', 'Pour', 'Used for'],
      rows: [
        ['Tulip', 'Narrow, tall bowl', '125 ml', 'Champagne and sparkling'],
        ['Burgundy bowl', 'Wide, round bowl', '150 ml', 'Pinot Noir and rich whites']
      ],
      notes: [],
      say: [],
      sources: [{ title: 'House standard', asOf: '2026' }]
    },
    {
      key: 'temperatures', title: 'Serving temperatures', line: 'Where each wine shows best and how to get it there.',
      columns: ['Wine', 'Serve at', 'Why', 'How to get there'],
      rows: [
        ['Champagne', '6 to 8 degrees C', 'Keeps the mousse fine', 'Twenty minutes in an ice bucket, half ice, half water'],
        ['Light red', '12 to 14 degrees C', 'Lifts the fruit', 'Fifteen minutes in the fridge']
      ],
      notes: ['A degree too cold is kinder than a degree too warm; the glass warms it.'],
      say: [],
      sources: [{ title: 'House standard', asOf: '2026' }]
    }
  ],
  cards: [{ f: 'What does cork taint smell of?', b: 'Wet cardboard and a damp cellar; the fruit is stripped out.' }],
  questions: [{ cat: 'Service references', q: 'What compound causes cork taint?', opts: ['TCA', 'Acetic acid', 'Sulphur dioxide', 'Brettanomyces'], a: 0, exp: 'TCA, trichloroanisole, from a tainted cork or barrel, is cork taint; the others are different faults.' }]
};
