// app/projects/stryfe/page.tsx
// Copy comes from the Hex War design docs ("Game Overview & Art Direction",
// hex-war-game-design.md, "HEX WAR CHARACTERS"). Stryfe is the game's title;
// Hex War is the project/codename.
import { Metadata } from "next";
import { CardGrid, GamePage, GameSection, Prose } from "@/components/game/GamePage";

const description =
  "Stryfe (Hex War) — a 5v5 team arena game in development at We're Dad Studios. In Arcanis, magic is infrastructure, and two nations are at war over the crystalline Hexnodes that power everything.";

export const metadata: Metadata = {
  title: "Stryfe (Hex War) | 5v5 Team Arena Game | We're Dad Studios",
  description,
  openGraph: {
    title: "Stryfe (Hex War) | We're Dad Studios",
    description,
    url: "https://weredadstudios.com/projects/stryfe",
  },
  alternates: { canonical: "https://weredadstudios.com/projects/stryfe" },
};

export default function StryfePage() {
  return (
    <GamePage
      title="Stryfe"
      eyebrow="Hex War"
      genre="5v5 team arena"
      accent="green"
      hook="What if electricity were magic — and two nations went to war over the power grid? Capture the Hexnodes. Hold the zones. Power your side."
      facts={["In development", "5v5 PvP", "12–20 minute matches"]}
      posterLines={["Hold the", "zones.", "Power", "your side."]}
      posterTagline="Arcanis · The war for the Hexnodes"
    >
      <GameSection title="The world">
        <Prose
          paragraphs={[
            "Arcanis is a world where magic isn't mystical — it's infrastructure. Lights, transit, weapons and medicine all run on raw arcane current drawn from ancient crystalline structures called Hexnodes.",
            "Hexnodes are finite. When one dies, the region around it dies with it. Two factions are locked in an endless war over the nodes — not out of greed, but survival. Neither side is the villain.",
            "It's grounded high fantasy: people argue about ley-line tariffs and complain when their equipment's enchantment warranty expires. The war is serious, but the world feels lived-in rather than grim.",
          ]}
        />
      </GameSection>

      <GameSection title="How a match plays" intro="Two teams of five fight over hex zones. Every zone you hold scores points — and powers up your whole team.">
        <CardGrid
          accent="green"
          columns={4}
          cards={[
            { kicker: "Surge", title: "Haste", body: "Your whole team moves faster." },
            { kicker: "Arsenal", title: "Damage Amp", body: "Abilities hit harder." },
            { kicker: "Bastion", title: "Fortify", body: "Your team shrugs off more damage." },
            { kicker: "Wellspring", title: "Regeneration", body: "Health recovers out of combat." },
            { kicker: "Watchtower", title: "Vision", body: "Enemies near the zone show on your map." },
            { kicker: "Forge", title: "Cooldown", body: "Abilities come back sooner." },
            { kicker: "Nexus", title: "Ult Charge", body: "The contested centre: ultimates charge faster." },
            { kicker: "Win", title: "First to 1,000", body: "Capture by standing on a zone. Run out the clock and sudden death makes every zone worth triple." },
          ]}
        />
        <p className="m-0 mt-5 max-w-[760px] text-[18px] text-wds-text-secondary sm:text-[19px]">
          The strategy isn&apos;t &ldquo;capture everything&rdquo; — it&apos;s &ldquo;which zones do we need right now?&rdquo;
          Overextend and you get picked apart. Play it safe and the enemy stacks buffs that snowball.
        </p>
      </GameSection>

      <GameSection title="Five roles" intro="Every role is a trade: great at one thing because it's deliberately weak at another.">
        <CardGrid
          accent="green"
          columns={3}
          cards={[
            { kicker: "Very tough", title: "Frontliner", body: "Holds contested ground and starts the fights.", detail: "Durable, but hits softer than everyone else" },
            { kicker: "Very fragile", title: "Assassin", body: "Hunts lone, isolated targets and slips away.", detail: "Hits hard and fast, but dies if caught" },
            { kicker: "Sturdy", title: "Support", body: "Keeps teammates alive and moving.", detail: "Brilliant in a group, weak alone" },
            { kicker: "Fragile", title: "Specialist", body: "Owns the objectives and bends the game's rules.", detail: "Dominates zones, loses a straight duel" },
            { kicker: "Average", title: "Controller", body: "Decides where enemies are allowed to stand.", detail: "Well-rounded — if their effects land" },
          ]}
        />
      </GameSection>

      <GameSection title="Early heroes" intro="A first look at heroes on the drawing board. Every power has a price.">
        <CardGrid
          accent="green"
          columns={4}
          cards={[
            { kicker: "Controller", title: "Dark Lyn", body: "A shadow-witch who marks prey, weakens them from afar and unleashes darkness at the perfect moment.", detail: "Signature · Shadow Rebellion" },
            { kicker: "Frontliner", title: "Centurion", body: "A living fortress who leads every charge, absorbs punishment and turns berserker at the peak of battle.", detail: "Signature · Iron Charge" },
            { kicker: "Assassin", title: "Tozo", body: "A relentless butcher who hunts wounded prey — the more injured you are, the more dangerous he becomes.", detail: "Signature · Meat Hook" },
            { kicker: "Controller", title: "Aerie", body: "Mistress of Storms: a wind dancer who scatters enemies, denies their attacks and strikes from wherever the storm carries her.", detail: "Signature · Eye of the Storm" },
            { kicker: "Frontliner", title: "ShatterBack", body: "A master smith whose colossal hammer cracks every defence and reshapes the battlefield.", detail: "Signature · The Anvil" },
            { kicker: "Controller", title: "Luna Kaye", body: "A celestial warrior who commands gravity and moonlight, bending where her enemies can stand.", detail: "Signature · Weight of the Moon" },
            { kicker: "Controller", title: "Toulis Blackheart", body: "A plague alchemist who spreads corruption through every wound — and ultimately becomes death itself.", detail: "Signature · Fester" },
            { kicker: "Assassin", title: "Cora Line", body: "A pirate huntress who swings across the battlefield, tracks prey from above and executes marked enemies.", detail: "Signature · Quartermaster" },
          ]}
        />
        <p className="m-0 mt-5 text-[16px] uppercase tracking-[0.1em] text-wds-text-secondary">
          In development — heroes, zones and numbers may change.
        </p>
      </GameSection>
    </GamePage>
  );
}
