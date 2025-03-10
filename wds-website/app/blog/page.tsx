
import { Home } from "./[id]/_components/Home";
export default function Page() {
  

  return (
    <Home/>
  );
}

export async function generateMetadata() {
    return {
      title: "WDS Blog | Latest Updates & Insights",
      description: "Stay updated with the latest news, insights, and developments from WDS. Explore in-depth articles, project updates, and industry trends.",
      openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://weredadstudios.netlify.app/blog",
        title: "WDS Blog | Latest Updates & Insights",
        description: "Stay updated with the latest news, insights, and developments from WDS. Explore in-depth articles, project updates, and industry trends.",
        siteName: "WDS",
        images: [
          {
            url: "https://weredadstudios.netlify.app/images/android-chrome-512x512.png",
            width: 1200,
            height: 630,
            alt: "WDS Blog",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@wds",
        creator: "@wds",
      },
    };
  }
   