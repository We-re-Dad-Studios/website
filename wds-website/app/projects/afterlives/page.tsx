// app/projects/afterlives/page.tsx
// Copy comes from the "AfterLives GamePlay" and "Afterlives GDD" docs —
// kept spoiler-free (no Trickster reveal, no ending).
import { Metadata } from "next";
import { CardGrid, GamePage, GameSection, Prose } from "@/components/game/GamePage";

const description =
  "Afterlives — a mythic action game in development at We're Dad Studios. Poisoned and denied his place among the dead, the warrior Odi fights through the afterlives of other peoples to reach the Resurrection Stone.";

export const metadata: Metadata = {
  title: "Afterlives | Mythic Action Game | We're Dad Studios",
  description,
  openGraph: {
    title: "Afterlives | We're Dad Studios",
    description,
    url: "https://weredadstudios.com/projects/afterlives",
  },
  alternates: { canonical: "https://weredadstudios.com/projects/afterlives" },
};

export default function AfterlivesPage() {
  return (
    <GamePage
      title="Afterlives"
      genre="Mythic action-adventure"
      accent="pink"
      hook="One cup of poison. Six afterlives. A warrior who refuses to stay dead."
      facts={["In development", "Unreal Engine", "Single-player"]}
      posterLines={["One cup", "of poison.", "Six", "afterlives."]}
      posterTagline="Odi · The Lion of Igala"
    >
      <GameSection title="The story">
        <Prose
          paragraphs={[
            "Odi is the greatest warrior his kingdom has produced in generations. He carves through an entire army and slays a rival king in his own palace — then refuses to treat the defeated king's daughter as spoils of war. He frees her. Hatred becomes respect, respect becomes love, and the two build a life neither thought possible.",
            "That life ends with a single cup of poison.",
            "Odi wakes in the afterlife of his ancestors, certain his death was neither glorious nor deserved. Somewhere in the realm of the dead lies the Resurrection Stone, a relic said to restore those whose destinies were stolen. But the Crossroads Spirit, guardian of the roads between life and death, turns him away: a man who died by poison, not by the blade, has no road back.",
            "Rescued by the spirit of his mother, bound into a sacred amulet, Odi learns of older paths that weave through the afterlives of other peoples. If he cannot reach the Stone from his own realm, perhaps he can reach it from theirs — and every afterlife he trespasses leaves its mark on him.",
          ]}
        />
      </GameSection>

      <GameSection title="Six realms of the dead" intro="Each chapter crosses a different people's afterlife, with its own laws, enemies and guardian.">
        <CardGrid
          accent="pink"
          cards={[
            { kicker: "Duty", title: "Igala — The Kingdom of Rivers", body: "The dead travel endless rivers. Every soul knows its destination. Nothing crosses without permission.", detail: "Drowned warriors · River shades · Crocodile spirits" },
            { kicker: "Memory", title: "Nok — The Memory of Stone", body: "Everything is made of clay and every ancestor is sculpted. Those who are forgotten crumble into dust.", detail: "Terracotta legionnaires · Stone hyenas · Clay giants" },
            { kicker: "The Hunt", title: "Idoma — The Forest of Hunters", body: "Every soul is prey and the forest decides who survives. No hunter stays a hunter forever.", detail: "Antler spirits · Bone panthers · Hollow hunters" },
            { kicker: "Legacy", title: "Edo — The Bronze Throne", body: "Kings never truly die; their kingdoms continue without flesh. Bronze cities, royal processions, ancestor armies.", detail: "Bronze guardians · Royal executioners · Lion riders" },
            { kicker: "Identity", title: "Igbo — The Land of Masks", body: "Masks possess names, and names possess power. Everyone wears one. No one is quite who they seem.", detail: "Masquerade spirits · Face collectors · Laughing ghosts" },
            { kicker: "Oblivion", title: "The Forgotten", body: "Not death — being forgotten. Broken gods, dead civilisations and languages no one can read. The silence is the enemy.", detail: "Collect memories or fade" },
          ]}
        />
      </GameSection>

      <GameSection title="How Odi fights">
        <CardGrid
          accent="pink"
          columns={3}
          cards={[
            { title: "Drain memories", body: "Absorb the memories of stunned enemies to heal — or execute them outright when you catch them by surprise. Memories are the currency of Odi's skill tree." },
            { title: "Spear, knives and bow", body: "Hand-to-hand brawling, spear combat and fighting knives, with weapon-swap combos and a bow for the hunt." },
            { title: "Masks and amulets", body: "Masks that petrify, turn Odi invisible or let him shadow-teleport and possess enemies. Amulets that call lightning, fire and nature to his side." },
            { title: "Move like a spirit", body: "Walk, run, slide, roll, stalk, wall-run, swing and climb your way through every realm." },
            { title: "Mend the world", body: "Drain the memories held in objects to restore them — rebuild a broken bridge, reopen a sealed gate." },
            { title: "Carry every realm", body: "Each afterlife grants new power: stone skin, beast tracking, bronze counters, illusions and shadow clones." },
          ]}
        />
      </GameSection>
    </GamePage>
  );
}
