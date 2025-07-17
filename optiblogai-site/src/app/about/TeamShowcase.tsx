"use client";
import { useEffect, useState } from "react";

type Contributor = {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
};

export default function TeamShowcase() {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/solve-ease/OptiBlogAi/contributors"

        );
        const data = await res.json();
        setContributors(data);
      } catch (error) {
        console.error("Error fetching contributors", error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-5xl font-bold mb-8">Our Amazing Contributors</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 px-4">
        {contributors.map((contributor) => (
          <a
            key={contributor.login}
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:scale-105 transition"
          >
            <img
              src={contributor.avatar_url}
              alt={contributor.login}
              className="w-20 h-20 rounded-full"
            />
            <p className="mt-2 text-sm font-medium">@{contributor.login}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

