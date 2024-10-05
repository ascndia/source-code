import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useMemo } from "react";

const fetchAnime = async (query) => {
  const response = await fetch(
    `https://api.jikan.moe/v4/anime?q=${query}&limit=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch anime data");
  }
  const data = await response.json();
  return data.data || [];
};

const Search = function () {
  const [isOpen, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => fetchAnime(searchQuery),
    enabled: false,
  });

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  async function searchAnime(query) {
    if (!query) return;
    setSearchQuery(query);
    await refetch();
    setOpen(true);
  }

  const handleSearch = useMemo(() => {
    return debounce((e) => {
      const value = e.target.value.trim();
      setSearchQuery(value);
      if (!value) {
        setOpen(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      refetch();
      setOpen(true);
    }
  }, [searchQuery, refetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest("#anime-search") &&
        !event.target.closest("#search-results")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="position-relative">
      <form className="d-flex ms-auto" role="search">
        <div class="input-group">
          <input
            autoComplete="off"
            className="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
            id="anime-search"
            onChange={handleSearch}
          ></input>
          <button class="btn btn-primary" type="submit" id="button-addon2">
            Button
          </button>
        </div>
      </form>
      {isOpen && (
        <div
          className={`position-absolute overflow-y-scroll hide-scrollbar rounded p-2 bg-white mt-2`}
          id="search-results"
          style={{ height: "400px" }}
        >
          {isFetching && <div>Loading...</div>}
          {error && <div>{error.message}</div>}
          {data && (
            <div className="d-flex flex-column gap-2">
              {data.length > 0 ? (
                data.map((anime) => <ListCard key={anime.mal_id} {...anime} />)
              ) : (
                <div className="text-center">No results found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ListCard = (anime) => (
  <div className="row">
    <div className="col">
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        className="img-fluid rounded"
      />
    </div>
    <div className="col">
      <div className="d-flex flex-column h-100 justify-content-center gap-2">
        <h6 className="mb-0">
          {anime.title.length > 30
            ? `${anime.title.substring(0, 30)}...`
            : anime.title}
        </h6>
        <small>Episodes: {anime.episodes ? anime.episodes : "N/A"}</small>
      </div>
    </div>
  </div>
);

export default Search;
