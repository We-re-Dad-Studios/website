"use client";

import { useState, useEffect, useCallback } from "react";
import { Volume2, Download, Loader2, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

const PROJECTS = [
  { slug: "dawnshipper", label: "Dawnshipper" },
  { slug: "project_osiris", label: "Project Osiris" },
];

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  slug: string;
}

type GenStatus = "idle" | "generating" | "done" | "error";

export default function InternalTTSPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [selectedProject, setSelectedProject] = useState(PROJECTS[0].slug);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);

  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [genStatus, setGenStatus] = useState<GenStatus>("idle");
  const [genError, setGenError] = useState("");

  // Fetch chapters when project changes
  const fetchChapters = useCallback(async () => {
    if (!authenticated) return;
    setLoadingChapters(true);
    setSelectedChapter("");
    try {
      const res = await fetch(`/api/internal/chapters?project=${selectedProject}`, {
        headers: { "x-internal-secret": secret },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setChapters(data.chapters);
      if (data.chapters.length > 0) {
        setSelectedChapter(data.chapters[0].id);
      }
    } catch {
      setChapters([]);
    } finally {
      setLoadingChapters(false);
    }
  }, [selectedProject, secret, authenticated]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // Auth check — try fetching chapters to validate secret
  const handleLogin = async () => {
    try {
      const res = await fetch(`/api/internal/chapters?project=${PROJECTS[0].slug}`, {
        headers: { "x-internal-secret": secret },
      });
      if (res.ok) {
        setAuthenticated(true);
      } else {
        setGenError("Invalid secret");
      }
    } catch {
      setGenError("Connection failed");
    }
  };

  const handleGenerate = async () => {
    if (!selectedChapter) return;
    setGenStatus("generating");
    setGenError("");

    try {
      const res = await fetch("/api/internal/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": secret,
        },
        body: JSON.stringify({ chapterId: selectedChapter }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error);
      }

      // Download the file
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const filenameMatch = disposition.match(/filename="(.+?)"/);
      const filename = filenameMatch?.[1] ?? "chapter.mp3";

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setGenStatus("done");
    } catch (err) {
      setGenStatus("error");
      setGenError(err instanceof Error ? err.message : "Generation failed");
    }
  };

  const selectedChapterData = chapters.find((c) => c.id === selectedChapter);

  // ---- Login screen ----
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Lock className="w-7 h-7 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Internal TTS Tool</h1>
            <p className="text-white/50 text-sm mt-1">Enter your access key to continue</p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={secret}
              onChange={(e) => { setSecret(e.target.value); setGenError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Access key"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {genError && (
              <p className="text-red-400 text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {genError}
              </p>
            )}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Main screen ----
  return (
    <div className="min-h-screen bg-[#0d1117] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Audio Generator</h1>
          </div>
          <p className="text-white/50 text-sm">
            Generate chapter narration audio via ElevenLabs. Download the MP3 then upload to Contentful.
          </p>
        </div>

        {/* Project selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Project</label>
          <div className="flex gap-2">
            {PROJECTS.map((p) => (
              <button
                key={p.slug}
                onClick={() => setSelectedProject(p.slug)}
                className={`
                  px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${selectedProject === p.slug
                    ? "bg-amber-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                  }
                `}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Chapter</label>
          {loadingChapters ? (
            <div className="flex items-center gap-2 text-white/40 text-sm py-3">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading chapters...
            </div>
          ) : chapters.length === 0 ? (
            <p className="text-white/40 text-sm py-3">No chapters found for this project.</p>
          ) : (
            <select
              value={selectedChapter}
              onChange={(e) => { setSelectedChapter(e.target.value); setGenStatus("idle"); }}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer"
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id} className="bg-gray-900">
                  Ch. {c.chapterNumber} — {c.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Generate button */}
        <div className="space-y-4">
          <button
            onClick={handleGenerate}
            disabled={!selectedChapter || genStatus === "generating"}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3
              ${genStatus === "generating"
                ? "bg-amber-500/50 text-white/70 cursor-wait"
                : "bg-amber-500 hover:bg-amber-600 text-white hover:scale-[1.01]"
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            {genStatus === "generating" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating{selectedChapterData ? ` "${selectedChapterData.title}"` : ""}...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Generate & Download MP3
              </>
            )}
          </button>

          {genStatus === "done" && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Audio downloaded! Upload it to the chapter&apos;s Audio field in Contentful.
            </div>
          )}

          {genStatus === "error" && genError && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {genError}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-sm font-medium text-white/50 mb-3">Workflow</h3>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-white/40">
            <li>Select a project and chapter above</li>
            <li>Click generate — the MP3 will download when ready</li>
            <li>Go to Contentful &rarr; open the chapter entry</li>
            <li>Upload the MP3 to the <strong className="text-white/60">Audio</strong> media field</li>
            <li>Publish — the Listen button will appear on the chapter page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
