export function pokemonWeakness(type1, type2) {
  const typesName = new Set();

  type1.damage_relations.double_damage_from.map((r) => typesName.add(r.name));

  if (type2)
    type2.damage_relations.double_damage_from.map((r) => typesName.add(r.name));

  for (let relation of type1.damage_relations.half_damage_from)
    if (typesName.has(relation.name)) typesName.delete(relation.name);

  for (let relation of type1.damage_relations.no_damage_from)
    if (typesName.has(relation.name)) typesName.delete(relation.name);

  if (type2)
    for (let relation of type2.damage_relations.half_damage_from)
      if (typesName.has(relation.name)) typesName.delete(relation.name);

  if (type2)
    for (let relation of type2.damage_relations.no_damage_from)
      if (typesName.has(relation.name)) typesName.delete(relation.name);

  return [...typesName];
}

export function getFlavorTextEntry(species) {
  for (let entry of species.flavor_text_entries)
    if (entry.language?.name === "en") return entry.flavor_text;
  return species.flavor_text_entries[0].flavor_text;
}

export function getEvolutionIdFromSpecies(species) {
  let urlSplit = species.evolution_chain?.url.split("/");
  if (urlSplit[urlSplit.length - 1] === "") urlSplit.pop();

  return urlSplit[urlSplit.length - 1];
}

export function getEvolutions(chain) {
  let evolutions = getEvolutionsRecursive(chain, new Set());

  return [chain.species.name, ...evolutions];
}

function getEvolutionsRecursive(chain, evolutions) {
  if (chain.length === 0) return evolutions;

  for (let evo of chain.evolves_to) {
    evolutions.add(evo.species.name);
    for (let ev of evo.evolves_to) {
      evolutions.add(ev.species.name);
      getEvolutionsRecursive(ev, evolutions);
    }
  }

  return evolutions;
}
