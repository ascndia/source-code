"use strict";

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

async function InitCarousel() {
  const data = await CacheRequest(
    "https://api.jikan.moe/v4/top/anime?limit=10",
    "carousel"
  );
  const animeList = data.data;
  const carouselContent = document.getElementById("hero-carousel-wrapper");
  let carouselItems = "";
  animeList.forEach((anime, index) => {
    const activeClass = index === 0 ? "active" : "";
    carouselItems += `
            <div class="swiper-slide position-relative">
                <img src="${anime.images.jpg.image_url}" class="img-fluid w-100" alt="${anime.title}" />
                <div class="overlay position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(0, 0, 0, 0.5);"></div>
                <div class="title-text position-absolute top-50 start-50 translate-middle text-white">
                    <h1>${anime.title}</h1>
                </div>
            </div>
            `;
  });

  carouselContent.innerHTML = carouselItems;

  const swiper = new Swiper(".hero-carousel", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  });
  window.addEventListener("resize", () => {
    swiper.update();
  });
}

async function DisplayTrending() {
  const data = await CacheRequest(
    "https://api.jikan.moe/v4/top/anime?limit=6",
    "trending"
  );
  const trendingWrapper = document.getElementById("trending-wrapper");
  data.data.forEach((anime) => {
    const animeCol = document.createElement("div");
    animeCol.classList.add("col-lg-4", "col-6");

    animeCol.innerHTML = `
      <div class="card border-0 pb-4 bg-transparent anime-card">
        <div class="position-relative rounded overflow-hidden">
          <img
            src="${anime.images.jpg.image_url}"
            alt="${anime.title}"
            class="img-fluid"
          />
        </div>

        <div class="tags px-3">
          <span class="badge bg-primary">Active</span>
          <span class="badge bg-secondary">${anime.type}</span>
        </div>

        <div class="px-3 pb-3 anime-title text-white">
          ${anime.title}
        </div>
      </div>
    `;

    trendingWrapper.appendChild(animeCol);
  });
}

async function DisplayRecentAnime() {
  const data = await CacheRequest(
    "https://api.jikan.moe/v4/seasons/now?limit=6",
    "recent"
  );
  const trendingWrapper = document.getElementById("recent-wrapper");
  data.data.forEach((anime) => {
    const animeCol = document.createElement("div");
    animeCol.classList.add("col-lg-4", "col-6");

    animeCol.innerHTML = `
        <div class="card border-0 pb-4 bg-transparent anime-card">
          <div class="position-relative rounded overflow-hidden">
            <img
              src="${anime.images.jpg.image_url}"
              alt="${anime.title}"
              class="img-fluid"
            />
          </div>
  
          <div class="tags px-3">
            <span class="badge bg-primary">Active</span>
            <span class="badge bg-secondary">${anime.type}</span>
          </div>
  
          <div class="px-3 pb-3 anime-title text-white">
            ${anime.title}
          </div>
        </div>
      `;

    trendingWrapper.appendChild(animeCol);
  });
}

async function DisplayUpcomingAnime() {
  const data = await CacheRequest(
    "https://api.jikan.moe/v4/seasons/upcoming?limit=6",
    "upcoming"
  );
  const trendingWrapper = document.getElementById("upcoming-wrapper");
  data.data.forEach((anime) => {
    const animeCol = document.createElement("div");
    animeCol.classList.add("col-lg-4", "col-6");

    animeCol.innerHTML = `
        <div class="card border-0 pb-4 bg-transparent anime-card">
          <div class="position-relative rounded overflow-hidden">
            <img
              src="${anime.images.jpg.image_url}"
              alt="${anime.title}"
              class="img-fluid"
            />
          </div>
  
          <div class="tags px-3">
            <span class="badge bg-primary">Active</span>
            <span class="badge bg-secondary">${anime.type}</span>
          </div>
  
          <div class="px-3 pb-3 anime-title text-white">
            ${anime.title}
          </div>
        </div>
      `;

    trendingWrapper.appendChild(animeCol);
  });
}

async function CacheRequest(url, key, retries = 3, delay = 1000) {
  const cachedData = localStorage.getItem(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  } else {
    try {
      const data = await WithRetries(url)
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem(key, JSON.stringify(data));
          return data;
        });
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

async function WithRetries(url, retries = 3, delay = 1000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return response;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed. Retrying...`, error);

      attempt++;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
      } else {
        throw new Error("Max retries reached. Could not fetch data.");
      }
    }
  }
}

DisplayTrending();
DisplayRecentAnime();
DisplayUpcomingAnime();
InitCarousel();
