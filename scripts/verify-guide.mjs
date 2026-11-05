import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';

// Exercise the same parser used by the browser without bundling the app.
const source = (await fs.readFile('src/api/guide.ts', 'utf8'))
  .replace(/const GUIDE_API_URL[\s\S]*?;\r?\n/, 'const GUIDE_API_URL = "";\n');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { parseGuideResponse } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const response = JSON.parse(await fs.readFile('docs/guide-response.json', 'utf8'));
const guide = parseGuideResponse(response);
assert.deepEqual(guide, JSON.parse(await fs.readFile('docs/guide.json', 'utf8')));
assert.equal(guide.cities.length, 9);
assert.equal(new Set(guide.cities.map(c => c.country)).size, 9);
let placeCount = 0;
let photoCount = 0;
for (const city of guide.cities) {
  assert.ok(city.places.length >= 5);
  for (const place of city.places) {
    placeCount++;
    const images = new Set([place.image, ...place.images]);
    assert.ok(images.size >= 2 && images.size <= 3, place.id);
    assert.equal(place.image, place.images[0]);
    assert.ok(URL.canParse(place.source));
    for (const image of images) {
      photoCount++;
      if (!image.startsWith('/images/')) continue;
      const contents = await fs.readFile(`public${image}`);
      assert.ok(contents.length > 1000, image);
      assert.ok(contents.subarray(0, 3).equals(Buffer.from([255, 216, 255])) || contents.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), image);
      const credit = Object.values(guide.photoCredits).find(c => c.image === image);
      assert.ok(credit?.author && credit?.license && URL.canParse(credit?.source) && URL.canParse(credit?.licenseUrl), image);
    }
  }
}
const legacy = structuredClone(response);
legacy[0].cities.forEach(c => c.places.forEach(p => delete p.images));
assert.doesNotThrow(() => parseGuideResponse(legacy));
for (const images of [[123], [''], [null], 'not-an-array']) {
  const bad = structuredClone(response);
  bad[0].cities[0].places[0].images = images;
  assert.throws(() => parseGuideResponse(bad), /некорректные данные/);
}
const duplicate = structuredClone(response);
duplicate[0].cities[1].places[0].id = duplicate[0].cities[0].places[0].id;
assert.throws(() => parseGuideResponse(duplicate), /повторяются/);
console.log(`Verified: 9 cities, ${placeCount} places, ${photoCount} photos; legacy format, invalid images, duplicate IDs.`);
