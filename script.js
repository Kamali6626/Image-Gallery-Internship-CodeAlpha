// ===== IMAGESET: mobile, laptop, car with crisp labels =====
  const galleryDataSet = [
    { src: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",   caption: " iPhone 15 Pro ",    category: "mobile" },
    { src: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",  caption: " Sumsung Galaxy ",  category: "mobile" },
    { src: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700", caption: " OnePLuse ",     category: "mobile" },
    { src: "https://picsum.photos/id/0/700/467?grayscale&seed=laptop1", caption: " MacBook Pro 16 ", category: "laptop" },
    { src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",  caption: " Dell Laptop ",    category: "laptop" },
    { src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",  caption: " HP Laptop ", category: "laptop" },
    { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70", caption: " Toyota ",           category: "car" },
    { src: "https://images.unsplash.com/photo-1555215695-3004980ad54e", caption: " BMW ",    category: "car" },
    { src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=700", caption: " jeep ",      category: "car" }
  ];

  // Reference elements
  const galleryContainer = document.getElementById("gallery");
  const lightboxElem = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const closeBtn = document.getElementById("lb-close");
  const prevBtn = document.getElementById("lb-prev");
  const nextBtn = document.getElementById("lb-next");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Rebuild gallery items dynamically to ensure perfect sync
  function buildGallery() {
    galleryContainer.innerHTML = "";
    galleryDataSet.forEach((item, idx) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "gallery-item";
      galleryItem.setAttribute("data-category", item.category);
      galleryItem.setAttribute("data-index", idx);
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption;
      img.loading = "lazy";
      const overlayDiv = document.createElement("div");
      overlayDiv.className = "overlay";
      const span = document.createElement("span");
      span.textContent = item.caption;
      overlayDiv.appendChild(span);
      galleryItem.appendChild(img);
      galleryItem.appendChild(overlayDiv);
      galleryContainer.appendChild(galleryItem);
    });
    attachGalleryEvents();
  }

  let currentVisibleIndices = galleryDataSet.map((_, i) => i); // all indices initially
  let currentLightboxGlobalIdx = 0;

  function attachGalleryEvents() {
    const items = document.querySelectorAll(".gallery-item");
    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        const idx = parseInt(item.getAttribute("data-index"));
        const visiblePos = currentVisibleIndices.indexOf(idx);
        if (visiblePos !== -1) {
          currentLightboxGlobalIdx = visiblePos;
          showLightboxByVisibleIndex(currentLightboxGlobalIdx);
          lightboxElem.classList.add("active");
        }
      });
    });
  }

  function showLightboxByVisibleIndex(visiblePos) {
    if (visiblePos < 0 || visiblePos >= currentVisibleIndices.length) return;
    const realIdx = currentVisibleIndices[visiblePos];
    const imageData = galleryDataSet[realIdx];
    lbImg.src = imageData.src;
    lbCaption.textContent = imageData.caption;
  }

  function updateVisibleIndices(category) {
    const newIndices = [];
    galleryDataSet.forEach((img, idx) => {
      if (category === "all" || img.category === category) {
        newIndices.push(idx);
      }
    });
    currentVisibleIndices = newIndices;
    // hide/show based on category
    const allItems = document.querySelectorAll(".gallery-item");
    allItems.forEach((item) => {
      const cat = item.getAttribute("data-category");
      const idx = parseInt(item.getAttribute("data-index"));
      if (category === "all" || cat === category) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
    // reset lightbox current index if out of bounds
    if (currentLightboxGlobalIdx >= currentVisibleIndices.length) {
      currentLightboxGlobalIdx = 0;
    }
    if (currentVisibleIndices.length === 0) currentLightboxGlobalIdx = -1;
  }

  // Lightbox controls (based on visible filter)
  function nextImage() {
    if (currentVisibleIndices.length === 0) return;
    currentLightboxGlobalIdx = (currentLightboxGlobalIdx + 1) % currentVisibleIndices.length;
    showLightboxByVisibleIndex(currentLightboxGlobalIdx);
  }

  function prevImage() {
    if (currentVisibleIndices.length === 0) return;
    currentLightboxGlobalIdx = (currentLightboxGlobalIdx - 1 + currentVisibleIndices.length) % currentVisibleIndices.length;
    showLightboxByVisibleIndex(currentLightboxGlobalIdx);
  }

  // event listeners for lightbox navigation
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    prevImage();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nextImage();
  });
  closeBtn.addEventListener("click", () => {
    lightboxElem.classList.remove("active");
  });
  lightboxElem.addEventListener("click", (e) => {
    if (e.target === lightboxElem) lightboxElem.classList.remove("active");
  });

  // keyboard events
  document.addEventListener("keydown", (e) => {
    if (!lightboxElem.classList.contains("active")) return;
    if (e.key === "ArrowLeft") { prevImage(); e.preventDefault(); }
    else if (e.key === "ArrowRight") { nextImage(); e.preventDefault(); }
    else if (e.key === "Escape") { lightboxElem.classList.remove("active"); e.preventDefault(); }
  });

  // filter logic + active button
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filterVal = btn.getAttribute("data-filter");
      updateVisibleIndices(filterVal);
      // reset current lightbox position within new visible set
      if (currentVisibleIndices.length > 0) {
        currentLightboxGlobalIdx = 0;
        showLightboxByVisibleIndex(0);
      } else {
        // no images scenario (unlikely)
      }
    });
  });

  // initialize gallery
  buildGallery();
  // set initial visible indices (all)
  updateVisibleIndices("all");
  // set initial lightbox first visible image if any
  if (currentVisibleIndices.length) {
    currentLightboxGlobalIdx = 0;
    showLightboxByVisibleIndex(0);
  }

  // small fix to ensure images high-quality loading
  const styleInject = document.createElement("style");
  styleInject.textContent = `img { image-rendering: auto; } .gallery-item img { transition: transform 0.5s ease-out; }`;
  document.head.appendChild(styleInject);