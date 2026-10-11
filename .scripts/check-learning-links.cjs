/* Authored wine study joins and component scope, over the existing full
   component harness and shipped house. No browser storage is touched. */
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const prefix = fs.readFileSync(path.join(__dirname, 'check-components.js'), 'utf8').split('async function main()')[0];
const H = new Function('require', '__dirname', prefix + ';return {bootDevice,settle,shipped};')(require, __dirname);
let passed = 0;
function check(name, fn) {
  try { fn(); passed++; console.log('  ok  ' + name); }
  catch (error) { console.error('FAIL ' + name + '\n' + error.stack); throw error; }
}
async function main() {
  const D = H.bootDevice({pack: JSON.stringify(H.shipped), location: {href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: ''}});
  await H.settle(D);
  const G = D.G;
  const get = (expression) => JSON.parse(G('JSON.stringify(' + expression + ')'));
  const grape = (name) => get('v28GrapeProfiles({grapes:[' + JSON.stringify(name) + ']}).map(function(x){return {name:x.p.g,flash:x.flash}})');
  const primer = (region) => get('v28Primer({region:' + JSON.stringify(region) + '})');
  const map = (region) => get('v28Map({region:' + JSON.stringify(region) + '}, [])');
  const house = H.shipped.house;
  const wineIds = new Set(house.wines.map((w) => w.id));
  const kept = (c) => c.card && c.card.by === 'person' && c.card.value && c.card.value.front && c.card.value.back;
  const allIds = house.components.filter(kept).map((c) => c.id);
  const wineCards = house.components.filter((c) => kept(c) && (c.itemIds || []).some((id) => wineIds.has(id)));
  const wineCardIds = wineCards.map((c) => c.id);
  for (const level of ['intro', 'certified', 'advanced', 'master']) {
    G('applyLevel(' + JSON.stringify(level) + ')');
    check(level + ': grape synonyms resolve to one current profile', () => {
      for (const names of [['Syrah', 'Shiraz', 'Syrah / Shiraz'], ['Grenache', 'Garnacha', 'Grenache / Garnacha']]) {
        const first = grape(names[0]);
        assert.equal(first.length, 1);
        assert.equal(first[0].flash, !(level === 'intro' && names[0] === 'Grenache'));
        names.forEach((n) => assert.deepEqual(grape(n), first));
        names.forEach((n) => assert.equal(get('v35Grape(' + JSON.stringify(n) + ').g.g'), first[0].name));
      }
    });
    check(level + ': synonyms deduplicate; similar names and unknown blends do not match', () => {
      assert.equal(G('v28GrapeProfiles({grapes:["Syrah","Shiraz","Syrah / Shiraz"]}).length'), 1);
      ['Petite Sirah', 'Syrah blend', 'Grenache Blanc'].forEach((n) => {
        const rows = grape(n);
        assert.ok(rows.every((r) => !/^(Syrah|Grenache)( \/|$)/.test(r.name)));
      });
      assert.equal(G('v28GrapeProfiles({region:"Northern Rhone",grapes:[]}).length'), 0);
    });
    check(level + ': real menu wines recover their Syrah and Grenache doors', () => {
      const targets = house.wines.filter((w) => w.list !== 'bottle' && /Vincent|Durban|Minuty|Banyuls/.test(w.name));
      assert.ok(targets.length >= 4);
      for (const wine of targets) {
        const rows = get('v28GrapeProfiles(v28Find(v28House().wines,' + JSON.stringify(wine.id) + ')).map(function(x){return {name:x.p.g,flash:x.flash}})');
        assert.ok(rows.length, wine.name);
        if (level !== 'intro') assert.ok(rows.some((x) => x.flash), wine.name);
      }
    });
    check(level + ': Piemonte and Piedmont reach the same existing chapter and Italy map', () => {
      assert.deepEqual(primer('Piemonte, Italy'), primer('Piedmont, Italy'));
      assert.equal(primer('Piemonte, Italy').key, level === 'intro' ? G('PRIMERS.findIndex(function(p){return p.id === "piedmont"})') : 'Italy North');
      assert.equal(map('Piemonte, Italy').id, 'italy');
      assert.equal(map('Piemonte, Italy').overview, undefined);
    });
    check(level + ': Roussillon and Loire use labelled parent map overviews', () => {
      for (const region of ['Roussillon, France', 'Val de Loire, France']) {
        assert.equal(map(region).id, 'france');
        assert.equal(map(region).overview, true);
        assert.match(G('v28HereBlock(null,{id:"w-test0001",region:' + JSON.stringify(region) + '})'), /Explore France, a regional overview/);
      }
      assert.equal(primer('Val de Loire, France').key, level === 'intro' ? G('PRIMERS.findIndex(function(p){return p.id === "loire"})') : 'Loire');
      if (level === 'intro') assert.equal(primer('Roussillon, France'), null);
      else assert.equal(primer('Roussillon, France').key, 'Southern France');
    });
    check(level + ': broad California origin gives only an overview and no invented terroir', () => {
      assert.equal(map('Santa Ynez Valley, California').id, 'california');
      assert.equal(map('California').overview, true);
      assert.equal(G('v28Terroir({region:"Piemonte, Italy"}).length'), 0);
      assert.equal(G('v28Terroir({region:"Roussillon, France"}).length'), 0);
      assert.equal(G('v28Terroir({region:"California"}).length'), 0);
      assert.equal(map('California-inspired, Unknown'), null);
      assert.equal(map('Piemonte-like, Unknown'), null);
    });
    check(level + ': components default to exact wine links; all house stays available', () => {
      assert.deepEqual(get('v32DeckDef("components").cards.map(function(c){return c.id})'), wineCardIds);
      assert.deepEqual(get('v32DeckDef("components-all").cards.map(function(c){return c.id})'), allIds);
      for (const kind of ['ingredient', 'technique', 'story']) {
        assert.deepEqual(get('v32DeckDef("components:' + kind + '").cards.map(function(c){return c.id})'), wineCards.filter((c) => c.kind === kind).map((c) => c.id));
      }
    });
    check(level + ': every single-wine component deck is exact and retains its order', () => {
      for (const wine of house.wines) {
        const expected = ['ingredient', 'technique', 'story'].flatMap((kind) => house.components.filter((c) => kept(c) && c.kind === kind && (c.itemIds || []).includes(wine.id)).map((c) => c.id));
        assert.deepEqual(get('v32DeckDef(' + JSON.stringify('item-components:' + wine.id) + ').cards.map(function(c){return c.id})'), expected, wine.name);
      }
      assert.equal(G('v35ItemCards(v28House(),"w-missing1").length'), 0);
    });
  }
  check('absent grapes stay references rather than becoming active-level cards', () => {
    G('var savedGrapes=GRAPES;GRAPES=GRAPES.filter(function(g){return g.g!=="Assyrtiko"})');
    const profile = grape('Assyrtiko');
    assert.equal(profile.length, 1);
    assert.equal(profile[0].flash, false);
    assert.equal(G('v35Grape("Assyrtiko").flash'), false);
    G('GRAPES=savedGrapes');
  });
  check('unavailable sheets and absent map headings never generate a new map door', () => {
    G('var savedSheets=v25MapSheets;v25MapSheets=function(){return []}');
    assert.equal(map('Piemonte, Italy'), null);
    G('v25MapSheets=savedSheets;var savedMapRegions=mapRegions;mapRegions=function(id){return savedMapRegions(id).filter(function(r){return r.n!=="Piedmont"})}');
    assert.equal(map('Piemonte, Italy'), null);
    G('mapRegions=savedMapRegions');
  });
  check('all-house routes are accepted without altering the route grammar', () => {
    assert.deepEqual(get('v32Parse("#/flashcards/components-all")'), {view: 'deck', deck: 'components-all'});
    assert.deepEqual(get('v32Parse("#/flashcards/components-all%3Aingredient")'), {view: 'deck', deck: 'components-all:ingredient'});
    const root = G('v32FlashcardsHtml()');
    assert.match(root, /data-deck="components-all"/);
    assert.match(root, /All house components/);
  });
  check('scope selector retains its kind and accurately names active scope', () => {
    G('S._v32deck="components:ingredient"');
    assert.match(G('v32DeckHtml()'), /data-deck="components-all:ingredient" aria-pressed="false">All house components/);
    G('S._v32deck="components-all:ingredient"');
    assert.match(G('v32DeckHtml()'), /data-deck="components-all:ingredient" aria-pressed="true">All house components/);
    assert.match(G('v32DeckHtml()'), /including food, wine and cocktails/);
  });
  check('only exact existing wine IDs deal item cards; scope does not change IDs or grading', () => {
    const id = house.wines.find((w) => wineCards.some((c) => c.itemIds.includes(w.id))).id;
    G('v32StartRun(' + JSON.stringify('item-components:' + id) + ',{push:true})');
    const before = get('S._v32run');
    const historyCount = D.hist.pushed.length;
    G('v32DeckDef("components-all");v28GrapeProfiles({grapes:["Shiraz"]})');
    assert.deepEqual(get('S._v32run'), before);
    assert.equal(D.hist.pushed.length, historyCount);
    const component = get('v32RunCard()');
    G('S._v32run.flip=true;v32Grade(true)');
    assert.ok(G('Object.keys(ST.q).some(function(k){return k.endsWith(' + JSON.stringify('h-' + component.id + '-component') + ')})'));
    assert.equal(G('v32DeckDef("components").learnt'), G('v32DeckDef("components-all").learnt'));
  });
  for (const [level, ref, profile] of [['intro', 'Grenache', 'Grenache / Garnacha'], ['intro', 'Assyrtiko', 'Assyrtiko'], ['certified', 'Assyrtiko', 'Assyrtiko']]) {
    const refDevice = H.bootDevice({pack: JSON.stringify(H.shipped), seed: {codexLevel: level, codexLevelChosen:'1'}, location: {href: 'http://localhost/codex/#ref=' + ref, pathname:'/codex/',search:'',hash:'#ref=' + ref}});
    await H.settle(refDevice);
    check(level + ': actual #ref=' + ref + ' boot opens the exact reference profile outside the active list', () => {
      assert.equal(refDevice.G('GRAPES.some(function(g){return g.g===' + JSON.stringify(profile) + '})'), false);
      assert.equal(refDevice.G('S._v32run.deckId'), 'grapes-all');
      assert.equal(refDevice.G('v32RunCard().id'), profile);
      assert.equal(refDevice.G('activeLevel'), level);
      assert.equal(refDevice.G('Object.keys(ST.q).length'), 0);
      assert.equal(refDevice.G('Object.keys(v32GrapeRec()).length'), 0);
    });
  }
  check('an unavailable exact reference target does not start an unrelated card', () => {
    const runBefore = get('S._v32run'), stateBefore = get('ST');
    G('var savedDeckDef=v32DeckDef;v32DeckDef=function(id){var d=savedDeckDef(id);if(id==="grapes-all")d.cards=d.cards.filter(function(c){return c.id!=="Assyrtiko"});return d}');
    assert.equal(G('v35OpenRef("Assyrtiko")'), false);
    assert.deepEqual(get('S._v32run'), runBefore);
    assert.deepEqual(get('ST'), stateBefore);
    G('v32DeckDef=savedDeckDef');
  });
  console.log('check-learning-links: ' + passed + ' passed; ' + wineCardIds.length + ' wine components, ' + allIds.length + ' all-house components.');
}
main().then(() => process.exit(0), () => process.exit(1));
